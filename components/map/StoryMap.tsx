"use client";

import { Fragment, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import type { DestinationFull } from "@/data/siteData";
import type { TherapeuticSite } from "@/lib/therapeuticSites";
import type { Recommendation } from "@/hooks/useRecommendation";
import { useTranslations } from "@/components/site/LocaleProvider";

/* ── Map styles — real tile providers, not abstract art ── */
type MapStyle = "streets" | "satellite" | "terrain" | "dark";

const TILE_CONFIG: Record<
  MapStyle,
  { url: string; attribution: string; maxZoom: number; label: string; icon: string }
> = {
  // All tiles proxied through our own /api/tiles route so they're same-origin
  // and bypass CSP/CORS/sandbox restrictions.
  streets: {
    url: "/api/tiles/streets/{z}/{x}/{y}",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    maxZoom: 19,
    label: "خريطة",
    icon: "🗺️",
  },
  satellite: {
    url: "/api/tiles/satellite/{z}/{x}/{y}",
    attribution: "Tiles &copy; Esri, Maxar",
    maxZoom: 19,
    label: "أقمار",
    icon: "🛰️",
  },
  terrain: {
    url: "/api/tiles/terrain/{z}/{x}/{y}",
    attribution: "© OpenStreetMap, SRTM | © OpenTopoMap",
    maxZoom: 17,
    label: "تضاريس",
    icon: "⛰️",
  },
  dark: {
    url: "/api/tiles/dark/{z}/{x}/{y}",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    maxZoom: 19,
    label: "ليلي",
    icon: "🌙",
  },
};

/* ── Leaflet default icon fix (must run once) ── */
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Icons ─────────────────────────────────────────────── */

function destinationIcon(
  color: string,
  emoji: string,
  size = 48,
  dim = false,
  recommended = false,
) {
  const opacity = dim ? 0.35 : 1;
  // A small gold star rides on top of the recommended pin so it's
  // distinguishable without relying on color alone.
  const starBadge = recommended
    ? `
      <div style="
        position: absolute;
        top: -6px; right: -6px;
        width: 22px; height: 22px;
        background: #f59e0b;
        border: 2px solid white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        font-size: 11px;
      ">⭐</div>`
    : "";
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        position: relative; width: ${size}px; height: ${size}px;
        opacity: ${opacity}; transition: opacity 0.5s;
      ">
        <div style="
          position: absolute; inset: 0;
          background: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.35);
        ">
          <span style="transform: rotate(45deg); font-size: ${size * 0.42}px; line-height: 1;">${emoji}</span>
        </div>
        ${starBadge}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function subSiteIcon(emoji: string, name: string = "") {
  // Escape a short display name in the label under the pin.
  const safe = (name || "").toString();
  const safeName = safe.length > 18 ? safe.slice(0, 17) + "…" : safe;
  const esc = safeName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return L.divIcon({
    className: "sub-site-marker",
    html: `
      <div style="
        position: relative;
        display: flex; flex-direction: column;
        align-items: center; gap: 2px;
        font-family: Cairo, sans-serif;
      ">
        <div style="
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.95);
          border: 2px solid #91b149;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          font-size: 14px; line-height: 1;
        ">${emoji}</div>
        <span style="
          background: rgba(18,57,77,0.92);
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          direction: rtl;
        ">${esc}</span>
      </div>
    `,
    iconSize: [120, 48],
    iconAnchor: [60, 15],
    popupAnchor: [0, -15],
  });
}

/**
 * Forces Leaflet to re-measure its container after mount and whenever
 * the window resizes. Without this, a <MapContainer> placed inside an
 * `absolute inset-0` wrapper often ends up with a 0-height tile-pane
 * and tiles never paint.
 */
function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    const invalidate = () => map.invalidateSize({ animate: false });

    // Re-measure now + a few frames later (covers font loading, layout
    // reflow from fixed/absolute siblings, etc.)
    invalidate();
    const t1 = setTimeout(invalidate, 100);
    const t2 = setTimeout(invalidate, 400);
    const t3 = setTimeout(invalidate, 1200);

    window.addEventListener("resize", invalidate);

    // ResizeObserver on the map container itself — catches the case
    // where a parent lays out after Leaflet mounted.
    const container = map.getContainer();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(invalidate);
      ro.observe(container);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", invalidate);
      ro?.disconnect();
    };
  }, [map]);
  return null;
}

/* ── Camera controller ─────────────────────────────────── */

interface CameraControllerProps {
  target: [number, number] | null;
  zoom: number;
}

function CameraController({ target, zoom }: CameraControllerProps) {
  const map = useMap();
  // Destructure to primitives so the effect dep array compares VALUES,
  // not the array reference. Before: a fresh `[lat, lng]` array on every
  // parent render re-fired `flyTo` and snapped the user's zoom back to
  // `cameraZoom` — making manual zoom impossible.
  const lat = target?.[0] ?? null;
  const lng = target?.[1] ?? null;
  const lastFlownRef = useRef<string>("");
  useEffect(() => {
    if (lat === null || lng === null) return;
    // Skip if we already flew to this exact target at this zoom.
    const key = `${lat.toFixed(4)},${lng.toFixed(4)},${zoom}`;
    if (lastFlownRef.current === key) return;
    lastFlownRef.current = key;
    map.flyTo([lat, lng], zoom, { duration: 1.8 });
  }, [lat, lng, zoom, map]);
  return null;
}

/* ── Main map ──────────────────────────────────────────── */

interface Props {
  destinations: DestinationFull[];
  subSites: TherapeuticSite[];
  recommendation: Recommendation | null;
  highlighted: string | null; // currently focused destination id
  showSubSites: boolean;
  onSelectDestination: (id: string) => void;
  /** Optional treatment filter — pins not matching get extra-dim */
  treatmentFilter?: string | null;
  /** Optional search query — filters destinations + sub-sites */
  searchQuery?: string;
}

export default function StoryMap({
  destinations,
  subSites,
  recommendation,
  highlighted,
  showSubSites,
  onSelectDestination,
  treatmentFilter,
  searchQuery,
}: Props) {
  const { locale } = useTranslations();
  const [mapStyle, setMapStyle] = useState<MapStyle>("streets");
  const [tileError, setTileError] = useState(false);
  const [tilesSeen, setTilesSeen] = useState(0);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const tile = TILE_CONFIG[mapStyle];

  // Reset error state when switching styles — gives the new provider a fresh chance
  useEffect(() => {
    setTileError(false);
    setTilesSeen(0);
  }, [mapStyle]);

  // Auto-switch to dark tiles when user prefers dark mode (only on first mount)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const hasDarkClass = document.documentElement.classList.contains("dark");
    if (prefersDark || hasDarkClass) {
      setMapStyle("dark");
    }
  }, []);

  const highlightedDest = useMemo(
    () => destinations.find((d) => d.id === highlighted) ?? null,
    [destinations, highlighted],
  );

  const normalizedSearch = (searchQuery || "").trim().toLowerCase();

  const matchesSearch = useCallback(
    (text: string) =>
      !normalizedSearch || text.toLowerCase().includes(normalizedSearch),
    [normalizedSearch],
  );

  const visibleSubSites = useMemo(() => {
    if (!showSubSites || !highlighted) return [];
    return subSites
      .filter((s) => s.destinationId === highlighted)
      .filter(
        (s) =>
          matchesSearch(s.name) ||
          matchesSearch(s.subtitle) ||
          s.treatments.some((t) => matchesSearch(t)),
      );
  }, [subSites, showSubSites, highlighted, matchesSearch]);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const cameraTarget: [number, number] | null = highlightedDest
    ? [highlightedDest.lat, highlightedDest.lng]
    : null;

  const cameraZoom = showSubSites ? 10 : 6;

  // If no tiles have loaded after ~4s, assume they failed and show a fallback banner.
  const showTileFailureBanner = tileError && tilesSeen === 0;

  return (
    <div className="relative w-full h-full">
      {/* Decorative base layer: stylized Egypt outline visible when tiles fail.
          Sits under the leaflet container so loaded tiles always cover it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, #1a3a4f 0%, #0e1e2b 55%, #070d15 100%)",
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800' preserveAspectRatio='xMidYMid meet'>
              <defs>
                <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
                  <path d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(145,177,73,0.06)' stroke-width='1'/>
                </pattern>
              </defs>
              <rect width='800' height='800' fill='url(%23grid)' />
              <!-- Simplified Egypt outline (approximate) -->
              <path d='M 200 180 L 560 180 L 640 200 L 680 260 L 700 340 L 680 420 L 650 480 L 600 540 L 540 580 L 480 600 L 420 620 L 380 640 L 340 620 L 320 580 L 300 540 L 290 480 L 280 420 L 260 360 L 240 300 L 220 240 Z'
                    fill='rgba(145,177,73,0.08)' stroke='rgba(145,177,73,0.25)' stroke-width='2' stroke-dasharray='4 4' />
              <!-- Nile river -->
              <path d='M 420 620 Q 400 500 410 400 Q 420 300 400 220' fill='none' stroke='rgba(100,180,220,0.3)' stroke-width='3' stroke-linecap='round' />
              <!-- Red Sea hint -->
              <path d='M 560 280 Q 600 380 580 500' fill='none' stroke='rgba(220,100,100,0.15)' stroke-width='8' stroke-linecap='round' />
            </svg>`,
          )}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <MapContainer
        center={[26.8, 30.8]}
        zoom={6}
        minZoom={5}
        maxZoom={tile.maxZoom}
        className="w-full h-full relative"
        style={{ background: "transparent" }}
        zoomControl={false}
      >
      <TileLayer
        key={mapStyle}
        attribution={tile.attribution}
        url={tile.url}
        maxZoom={tile.maxZoom}
        eventHandlers={{
          tileload: () => {
            setTilesSeen((n) => n + 1);
            setTileError(false);
          },
          tileerror: () => setTileError(true),
        }}
      />

      <MapInvalidator />
      <CameraController target={cameraTarget} zoom={cameraZoom} />

      <StyleSwitcher current={mapStyle} onChange={setMapStyle} locale={locale} />

      {/* Destination pins */}
      {destinations.map((dest) => {
        const isRecommended =
          recommendation && dest.id === recommendation.destinationId;
        const isHighlighted = highlighted === dest.id;
        // Filter match — dim pins that don't match the active treatment filter.
        const matchesFilter =
          !treatmentFilter ||
          dest.treatments?.some((t) => t.includes(treatmentFilter));
        const matchesQuery =
          !normalizedSearch ||
          matchesSearch(dest.name) ||
          matchesSearch(dest.description || "") ||
          (dest.treatments || []).some((t) => matchesSearch(t));
        // Dim unrelated pins when a destination is focused OR filter doesn't match.
        const dim =
          (highlighted !== null && !isHighlighted && !isRecommended) ||
          !matchesFilter ||
          !matchesQuery;
        const size = isRecommended ? 56 : 44;

        // Build a descriptive alt label for screen readers.
        const ariaLabel = [
          dest.name,
          dest.environment,
          isRecommended ? (locale === "en" ? "Your suggested destination" : "وجهتك المقترحة") : "",
          dim ? (locale === "en" ? "(not matching your search)" : "(غير مناسبة لبحثك)") : "",
          dest.treatments?.length
            ? locale === "en"
              ? `Treats: ${dest.treatments.join(", ")}`
              : `تعالج: ${dest.treatments.join("، ")}`
            : "",
        ]
          .filter(Boolean)
          .join(" — ");

        return (
          <Fragment key={dest.id}>
            {/* Soft halo behind the recommended or highlighted pin */}
            {(isRecommended || isHighlighted) && (
              <CircleMarker
                center={[dest.lat, dest.lng]}
                radius={isRecommended ? 30 : 22}
                pathOptions={{
                  color: dest.color,
                  fillColor: dest.color,
                  fillOpacity: 0.15,
                  weight: 0,
                }}
              />
            )}
            <Marker
              position={[dest.lat, dest.lng]}
              icon={destinationIcon(
                dest.color,
                dest.envIcon,
                size,
                dim,
                !!isRecommended,
              )}
              alt={ariaLabel}
              title={
                dim && !matchesFilter
                  ? locale === "en"
                    ? "Not matching the current filter — click to explore"
                    : "مش مناسبة للفلتر الحالي — اضغط للاستكشاف"
                  : dest.name
              }
              keyboard={true}
              eventHandlers={{ click: () => onSelectDestination(dest.id) }}
            >
              <Popup maxWidth={260} className="custom-popup">
                <div dir={locale === "en" ? "ltr" : "rtl"} style={{ fontFamily: "Cairo, sans-serif" }}>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#12394d",
                      marginBottom: 4,
                      fontFamily: "Reem Kufi, Cairo, sans-serif",
                    }}
                  >
                    {dest.name}
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 50,
                        background: `${dest.color}18`,
                        color: dest.color,
                      }}
                    >
                      {dest.envIcon} {dest.environment}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#7b7c7d", lineHeight: 1.7, marginBottom: 8 }}>
                    {dest.description}
                  </p>
                  {isRecommended && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background: "#91b149",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: 50,
                        textAlign: "center",
                        marginBottom: 8,
                      }}
                    >
                      {locale === "en" ? "⭐ Your suggested destination" : "⭐ وجهتك المقترحة"}
                    </div>
                  )}
                  <a
                    href={`/destination/${dest.id}`}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "7px 0",
                      background: "#1d5770",
                      color: "white",
                      borderRadius: 50,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {locale === "en" ? "Discover more" : "اكتشف المزيد"}
                  </a>
                </div>
              </Popup>
            </Marker>
          </Fragment>
        );
      })}

      {/* Sub-site pins (shown only when a destination is focused) */}
      {visibleSubSites.map((site) => (
        <Marker
          key={site.id}
          position={[site.lat, site.lng]}
          icon={subSiteIcon(site.icon, site.name)}
          alt={`${site.name} — ${site.subtitle} — ${site.treatments.join(locale === "en" ? ", " : "، ")}`}
          title={site.name}
          keyboard={true}
        >
          <Popup maxWidth={240}>
            <div dir={locale === "en" ? "ltr" : "rtl"} style={{ fontFamily: "Cairo, sans-serif" }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#12394d",
                  marginBottom: 2,
                  fontFamily: "Reem Kufi, Cairo, sans-serif",
                }}
              >
                {site.icon} {site.name}
              </div>
              <div style={{ fontSize: 11, color: "#7b7c7d", marginBottom: 6 }}>
                {site.subtitle}
              </div>
              <p style={{ fontSize: 11, color: "#12394d", lineHeight: 1.6, marginBottom: 6 }}>
                {site.pitch}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {site.treatments.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 50,
                      background: "#e4edf2",
                      color: "#1d5770",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* User location marker — shows current position when geolocation is granted */}
      {userLocation && (
        <>
          <CircleMarker
            center={userLocation}
            radius={24}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.15,
              weight: 0,
            }}
          />
          <CircleMarker
            center={userLocation}
            radius={8}
            pathOptions={{
              color: "white",
              fillColor: "#3b82f6",
              fillOpacity: 1,
              weight: 3,
            }}
          />
          <UserLocationCamera target={userLocation} />
        </>
      )}

      {/* Zoom + locate controls */}
      <MapZoomControl onLocate={handleLocateMe} locating={locating} locale={locale} />
    </MapContainer>

      {/* Offline / tile-error banner — shown when tiles can't load.
          Positioned below all the map controls (zoom + style switcher
          sit at ~60-130px from top). */}
      {showTileFailureBanner && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[500] pointer-events-none"
          dir={locale === "en" ? "ltr" : "rtl"}
          style={{ top: "calc(env(safe-area-inset-top) + 140px)" }}
        >
          <div className="pointer-events-auto bg-[#1d5770]/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/15 shadow-lg flex items-center gap-1.5 max-w-[88vw]">
            <span>📡</span>
            <span className="truncate">
              {locale === "en"
                ? "Offline mode — map running without tiles"
                : "وضع غير متصل — الخريطة شغالة بدون tiles"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Recenters the map on the user's location when it becomes available.
 * Only fires once per location update (not on every re-render).
 */
function UserLocationCamera({ target }: { target: [number, number] }) {
  const map = useMap();
  const lastTarget = useRef<string | null>(null);
  useEffect(() => {
    const key = `${target[0]},${target[1]}`;
    if (lastTarget.current === key) return;
    lastTarget.current = key;
    map.flyTo(target, 10, { duration: 1.5 });
  }, [target, map]);
  return null;
}

function MapZoomControl({
  onLocate,
  locating,
  locale,
}: {
  onLocate: () => void;
  locating: boolean;
  locale: string;
}) {
  const map = useMap();
  const zoomIn = useCallback(() => map.zoomIn(), [map]);
  const zoomOut = useCallback(() => map.zoomOut(), [map]);

  const baseBtnStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    background: "rgba(18, 57, 77, 0.92)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.15)",
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
  };

  return (
    <div
      className="leaflet-top leaflet-left"
      style={{ pointerEvents: "auto" }}
    >
      <div
        style={{
          margin: 12,
          marginTop: "calc(max(12px, env(safe-area-inset-top)) + 52px)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Zoom group */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={zoomIn}
            aria-label={locale === "en" ? "Zoom in" : "تكبير"}
            style={{ ...baseBtnStyle, borderRadius: "12px 12px 0 0" }}
          >
            +
          </button>
          <button
            onClick={zoomOut}
            aria-label={locale === "en" ? "Zoom out" : "تصغير"}
            style={{ ...baseBtnStyle, borderRadius: "0 0 12px 12px" }}
          >
            −
          </button>
        </div>

        {/* Locate-me button */}
        <button
          onClick={onLocate}
          aria-label={
            locating
              ? locale === "en"
                ? "Locating you"
                : "جاري تحديد موقعك"
              : locale === "en"
                ? "Locate me"
                : "اعرف موقعي"
          }
          title={locale === "en" ? "Locate me" : "اعرف موقعي"}
          disabled={locating}
          style={{
            ...baseBtnStyle,
            borderRadius: 12,
            fontSize: 18,
            opacity: locating ? 0.6 : 1,
          }}
        >
          {locating ? (
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#91b149",
                borderRadius: "50%",
                animation: "spin-slow 0.8s linear infinite",
              }}
            />
          ) : (
            "📍"
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Segmented toggle for map style — rendered inside the leaflet container
 * so it sits on top of the tiles with the proper z-index.
 */
function StyleSwitcher({
  current,
  onChange,
  locale,
}: {
  current: MapStyle;
  onChange: (s: MapStyle) => void;
  locale: string;
}) {
  const styles: MapStyle[] = ["streets", "satellite", "terrain"];
  // Collapse to icon-only under ~640px so it can't overflow the top bar.
  const [isSmall, setIsSmall] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );
  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className="leaflet-top leaflet-right"
      style={{ pointerEvents: "auto" }}
    >
      <div
        style={{
          margin: 12,
          marginTop: "calc(max(12px, env(safe-area-inset-top)) + 52px)",
          display: "flex",
          background: "rgba(18, 57, 77, 0.92)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 999,
          padding: 4,
          backdropFilter: "blur(8px)",
          gap: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
        dir={locale === "en" ? "ltr" : "rtl"}
        role="group"
        aria-label={locale === "en" ? "Map style" : "نمط الخريطة"}
      >
        {styles.map((s) => {
          const cfg = TILE_CONFIG[s];
          const active = current === s;
          return (
            <button
              key={s}
              onClick={() => onChange(s)}
              aria-pressed={active}
              aria-label={cfg.label}
              title={cfg.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: isSmall ? 0 : 6,
                minWidth: 40,
                minHeight: 40,
                padding: isSmall ? "0 10px" : "6px 14px",
                background: active ? "#91b149" : "transparent",
                color: active ? "#0a0f14" : "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Cairo, sans-serif",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              <span style={{ fontSize: 15 }}>{cfg.icon}</span>
              {!isSmall && <span>{cfg.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
