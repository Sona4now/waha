"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import type { DestinationFull } from "@/data/siteData";
import type { TherapeuticSite } from "@/lib/therapeuticSites";
import type { Recommendation } from "@/hooks/useRecommendation";

/* ── Leaflet default icon fix (must run once) ── */
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Icons ─────────────────────────────────────────────── */

function destinationIcon(color: string, emoji: string, size = 48, dim = false) {
  const opacity = dim ? 0.35 : 1;
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
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function subSiteIcon(emoji: string) {
  return L.divIcon({
    className: "sub-site-marker",
    html: `
      <div style="
        width: 30px; height: 30px;
        background: rgba(255,255,255,0.95);
        border: 2px solid #91b149;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-size: 14px; line-height: 1;
      ">${emoji}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

/* ── Camera controller ─────────────────────────────────── */

interface CameraControllerProps {
  target: [number, number] | null;
  zoom: number;
}

function CameraController({ target, zoom }: CameraControllerProps) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo(target, zoom, { duration: 1.8 });
  }, [target, zoom, map]);
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
}

export default function StoryMap({
  destinations,
  subSites,
  recommendation,
  highlighted,
  showSubSites,
  onSelectDestination,
}: Props) {
  const highlightedDest = useMemo(
    () => destinations.find((d) => d.id === highlighted) ?? null,
    [destinations, highlighted],
  );

  const visibleSubSites = useMemo(() => {
    if (!showSubSites || !highlighted) return [];
    return subSites.filter((s) => s.destinationId === highlighted);
  }, [subSites, showSubSites, highlighted]);

  const cameraTarget: [number, number] | null = highlightedDest
    ? [highlightedDest.lat, highlightedDest.lng]
    : null;

  const cameraZoom = showSubSites ? 10 : 6;

  return (
    <MapContainer
      center={[26.8, 30.8]}
      zoom={6}
      minZoom={5}
      maxZoom={14}
      className="w-full h-full"
      style={{ background: "#1a2332" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <CameraController target={cameraTarget} zoom={cameraZoom} />

      {/* Destination pins */}
      {destinations.map((dest) => {
        const isRecommended =
          recommendation && dest.id === recommendation.destinationId;
        const isHighlighted = highlighted === dest.id;
        // Dim unrelated pins when a destination is focused.
        const dim =
          highlighted !== null && !isHighlighted && !isRecommended;
        const size = isRecommended ? 56 : 44;

        return (
          <div key={dest.id}>
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
              icon={destinationIcon(dest.color, dest.envIcon, size, dim)}
              eventHandlers={{ click: () => onSelectDestination(dest.id) }}
            >
              <Popup maxWidth={260} className="custom-popup">
                <div dir="rtl" style={{ fontFamily: "Cairo, sans-serif" }}>
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
                      ⭐ وجهتك المقترحة
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
                    اكتشف المزيد
                  </a>
                </div>
              </Popup>
            </Marker>
          </div>
        );
      })}

      {/* Sub-site pins (shown only when a destination is focused) */}
      {visibleSubSites.map((site) => (
        <Marker
          key={site.id}
          position={[site.lat, site.lng]}
          icon={subSiteIcon(site.icon)}
        >
          <Popup maxWidth={240}>
            <div dir="rtl" style={{ fontFamily: "Cairo, sans-serif" }}>
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

      {/* Zoom controls */}
      <MapZoomControl />
    </MapContainer>
  );
}

function MapZoomControl() {
  const map = useMap();
  const zoomIn = useCallback(() => map.zoomIn(), [map]);
  const zoomOut = useCallback(() => map.zoomOut(), [map]);

  return (
    <div
      className="leaflet-top leaflet-left"
      style={{ pointerEvents: "auto" }}
    >
      <div style={{ margin: 12, display: "flex", flexDirection: "column", gap: 2 }}>
        <button
          onClick={zoomIn}
          aria-label="تكبير"
          style={{
            width: 36, height: 36,
            background: "rgba(18, 57, 77, 0.9)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px 10px 0 0",
            fontSize: 18, fontWeight: 700,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          aria-label="تصغير"
          style={{
            width: 36, height: 36,
            background: "rgba(18, 57, 77, 0.9)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0 0 10px 10px",
            fontSize: 18, fontWeight: 700,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          −
        </button>
      </div>
    </div>
  );
}
