"use client";

import { useEffect, useRef, useCallback } from "react";

/*
 * DepthParallax — Pseudo-3D immersive image component
 *
 * Takes a single image and creates a depth-based parallax effect using
 * WebGL fragment shaders. The depth is estimated from a generated gradient
 * (landscape heuristic: sky=far, ground=near) or a custom depth map.
 *
 * The shader displaces pixels based on their depth value and the mouse/gyro
 * position, creating a convincing 3D parallax illusion.
 */

interface Props {
  /** Source image URL */
  src: string;
  /** Optional custom depth map URL (grayscale: white=near, black=far) */
  depthMap?: string;
  /** Depth type for auto-generation: landscape (horizon), underwater, desert */
  depthType?: "landscape" | "underwater" | "desert" | "mountain";
  /** Parallax intensity (0-1, default 0.03) — subtle is better */
  intensity?: number;
  /** Enable auto-animation when no mouse interaction */
  autoAnimate?: boolean;
  /** Auto-animation speed (default 0.3) */
  autoSpeed?: number;
  /** CSS class for the container */
  className?: string;
  /** Enable subtle zoom breathing effect */
  breathe?: boolean;
}

// Vertex shader — simple pass-through
const VERT = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// Fragment shader — depth-based displacement with smooth parallax
const FRAG = `
  precision mediump float;

  varying vec2 v_texCoord;
  uniform sampler2D u_image;
  uniform sampler2D u_depth;
  uniform vec2 u_mouse;       // normalized mouse offset (-1 to 1)
  uniform float u_intensity;  // displacement strength
  uniform float u_time;       // for subtle animation
  uniform float u_breathe;    // zoom breathing factor
  uniform int u_hasDepthMap;  // whether custom depth map is loaded
  uniform int u_depthType;    // 0=landscape, 1=underwater, 2=desert, 3=mountain

  // Generate depth from UV coordinates (heuristic)
  float generateDepth(vec2 uv, int dtype) {
    float depth;

    if (dtype == 1) {
      // Underwater — center is close, edges far, bottom near
      float centerDist = length(uv - vec2(0.5, 0.5));
      depth = 1.0 - smoothstep(0.0, 0.7, centerDist);
      depth *= mix(0.6, 1.0, uv.y);
    } else if (dtype == 2) {
      // Desert — horizon line at ~40%, gradient below
      float horizon = 0.4;
      if (uv.y < horizon) {
        depth = smoothstep(0.0, horizon, uv.y) * 0.3;
      } else {
        depth = 0.3 + (uv.y - horizon) / (1.0 - horizon) * 0.7;
      }
    } else if (dtype == 3) {
      // Mountain — complex depth: peaks far, base near
      float horizon = 0.35;
      if (uv.y < horizon) {
        depth = uv.y / horizon * 0.2;
      } else {
        depth = 0.2 + (uv.y - horizon) / (1.0 - horizon) * 0.8;
      }
      // Center mountains slightly closer
      float cx = abs(uv.x - 0.5) * 2.0;
      depth *= mix(1.0, 0.7, (1.0 - cx) * step(uv.y, 0.5));
    } else {
      // Landscape (default) — sky far, ground near
      float horizon = 0.45;
      if (uv.y < horizon) {
        depth = smoothstep(0.0, horizon, uv.y) * 0.25;
      } else {
        depth = 0.25 + (uv.y - horizon) / (1.0 - horizon) * 0.75;
      }
    }

    return clamp(depth, 0.0, 1.0);
  }

  void main() {
    float depth;

    if (u_hasDepthMap == 1) {
      depth = texture2D(u_depth, v_texCoord).r;
    } else {
      depth = generateDepth(v_texCoord, u_depthType);
    }

    // Breathing zoom effect
    float breathScale = 1.0 + sin(u_time * 0.5) * u_breathe * 0.008;
    vec2 centeredUV = (v_texCoord - 0.5) * breathScale + 0.5;

    // Displacement based on depth and mouse
    vec2 displacement = u_mouse * u_intensity * depth;

    // Add very subtle organic motion
    displacement += vec2(
      sin(u_time * 0.3 + v_texCoord.y * 3.0) * 0.001 * depth,
      cos(u_time * 0.25 + v_texCoord.x * 2.5) * 0.0008 * depth
    );

    vec2 finalUV = centeredUV + displacement;

    // Clamp to avoid edge artifacts
    finalUV = clamp(finalUV, 0.001, 0.999);

    vec4 color = texture2D(u_image, finalUV);

    // Subtle depth-of-field: slightly blur far areas (simulated)
    float dofBlur = (1.0 - depth) * 0.002;
    vec4 blurSample = (
      texture2D(u_image, finalUV + vec2(dofBlur, 0.0)) +
      texture2D(u_image, finalUV - vec2(dofBlur, 0.0)) +
      texture2D(u_image, finalUV + vec2(0.0, dofBlur)) +
      texture2D(u_image, finalUV - vec2(0.0, dofBlur))
    ) * 0.25;

    color = mix(color, blurSample, (1.0 - depth) * 0.3);

    // Subtle vignette for cinematic feel
    float vignette = 1.0 - smoothstep(0.5, 1.4, length(v_texCoord - 0.5) * 2.0);
    color.rgb *= mix(0.85, 1.0, vignette);

    gl_FragColor = color;
  }
`;

function loadTexture(
  gl: WebGLRenderingContext,
  url: string,
  textureUnit: number
): Promise<WebGLTexture> {
  return new Promise((resolve, reject) => {
    const texture = gl.createTexture();
    if (!texture) return reject("Failed to create texture");

    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Placeholder pixel
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    );

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      gl.activeTexture(gl.TEXTURE0 + textureUnit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      resolve(texture);
    };
    img.onerror = () => reject("Failed to load image: " + url);
    img.src = url;
  });
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function DepthParallax({
  src,
  depthMap,
  depthType = "landscape",
  intensity = 0.03,
  autoAnimate = true,
  autoSpeed = 0.3,
  className = "",
  breathe = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);
  const isHoveringRef = useRef(false);

  const depthTypeInt =
    depthType === "underwater"
      ? 1
      : depthType === "desert"
        ? 2
        : depthType === "mountain"
          ? 3
          : 0;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
      isHoveringRef.current = true;
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
  }, []);

  // Gyroscope support for mobile
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const gamma = (e.gamma || 0) / 45; // -1 to 1
    const beta = ((e.beta || 0) - 45) / 45;
    mouseRef.current = {
      x: Math.max(-1, Math.min(1, gamma)),
      y: Math.max(-1, Math.min(1, beta)),
    };
    isHoveringRef.current = true;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    // Compile shaders
    const vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Geometry (fullscreen quad)
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const texCoords = new Float32Array([
      0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0,
    ]);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const texBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    const aTex = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(aTex);
    gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uImage = gl.getUniformLocation(program, "u_image");
    const uDepth = gl.getUniformLocation(program, "u_depth");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uBreathe = gl.getUniformLocation(program, "u_breathe");
    const uHasDepthMap = gl.getUniformLocation(program, "u_hasDepthMap");
    const uDepthType = gl.getUniformLocation(program, "u_depthType");

    gl.uniform1f(uIntensity, intensity);
    gl.uniform1f(uBreathe, breathe ? 1.0 : 0.0);
    gl.uniform1i(uDepthType, depthTypeInt);

    // Load textures
    let ready = false;
    async function init() {
      try {
        await loadTexture(gl!, src, 0);
        gl!.uniform1i(uImage, 0);

        if (depthMap) {
          await loadTexture(gl!, depthMap, 1);
          gl!.uniform1i(uDepth, 1);
          gl!.uniform1i(uHasDepthMap, 1);
        } else {
          gl!.uniform1i(uHasDepthMap, 0);
        }

        ready = true;
      } catch (err) {
        console.error("DepthParallax texture load error:", err);
      }
    }

    init();

    // Resize handler
    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    // Mouse events
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Gyroscope
    if (typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    // Animation loop
    const startTime = performance.now();
    function render() {
      if (!ready) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const time = (performance.now() - startTime) / 1000;

      // Smooth mouse interpolation (lerp)
      const smooth = smoothMouseRef.current;
      const target = mouseRef.current;

      if (!isHoveringRef.current && autoAnimate) {
        // Auto animation — gentle circular motion
        target.x = Math.sin(time * autoSpeed) * 0.6;
        target.y = Math.cos(time * autoSpeed * 0.7) * 0.4;
      }

      smooth.x += (target.x - smooth.x) * 0.04;
      smooth.y += (target.y - smooth.y) * 0.04;

      gl!.uniform2f(uMouse, smooth.x, smooth.y);
      gl!.uniform1f(uTime, time);

      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("deviceorientation", handleOrientation);
      gl.deleteProgram(program);
    };
  }, [
    src,
    depthMap,
    intensity,
    autoAnimate,
    autoSpeed,
    breathe,
    depthTypeInt,
    handleMouseMove,
    handleMouseLeave,
    handleOrientation,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
