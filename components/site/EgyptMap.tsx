"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { DestinationFull } from "@/data/siteData";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createCustomIcon(color: string, emoji: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 42px; height: 42px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      ">
        <span style="transform: rotate(45deg); font-size: 18px; line-height: 1;">${emoji}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
}

// Component to fly to a destination when selected
function FlyTo({
  center,
  zoom,
}: {
  center: [number, number] | null;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

interface Props {
  destinations: DestinationFull[];
  activeDestination: string | null;
  onSelectDestination: (id: string) => void;
}

export default function EgyptMap({
  destinations,
  activeDestination,
  onSelectDestination,
}: Props) {
  const flyTarget = activeDestination
    ? destinations.find((d) => d.id === activeDestination)
    : null;

  return (
    <MapContainer
      center={[26.8, 30.8]}
      zoom={6}
      minZoom={5}
      maxZoom={13}
      className="w-full h-full rounded-2xl z-0"
      style={{ background: "#e8f0f5" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Zoom controls on the left for RTL */}
      <div className="leaflet-top leaflet-left">
        <ZoomControl />
      </div>

      <FlyTo
        center={
          flyTarget ? [flyTarget.lat, flyTarget.lng] : null
        }
        zoom={10}
      />

      {destinations.map((dest) => {
        const icon = createCustomIcon(dest.color, dest.envIcon);

        return (
          <Marker
            key={dest.id}
            position={[dest.lat, dest.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onSelectDestination(dest.id),
            }}
          >
            <Popup maxWidth={280} className="custom-popup">
              <div dir="rtl" style={{ fontFamily: "Cairo, sans-serif" }}>
                {/* Image */}
                <div
                  style={{
                    width: "100%",
                    height: 120,
                    backgroundImage: `url('${dest.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "8px 8px 0 0",
                    marginBottom: 10,
                  }}
                />
                {/* Name */}
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#12394d",
                    marginBottom: 4,
                    fontFamily: "Reem Kufi, Cairo, sans-serif",
                  }}
                >
                  {dest.name}
                </div>
                {/* Environment badge */}
                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
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
                {/* Description */}
                <p
                  style={{
                    fontSize: 12,
                    color: "#7b7c7d",
                    lineHeight: 1.7,
                    marginBottom: 10,
                  }}
                >
                  {dest.description}
                </p>
                {/* Treatments */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    marginBottom: 12,
                  }}
                >
                  {dest.treatments.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 50,
                        background: "#e4edf2",
                        color: "#1d5770",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {/* CTA */}
                <a
                  href={`/destination/${dest.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "8px 0",
                    background: "#1d5770",
                    color: "white",
                    borderRadius: 50,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "background 0.3s",
                  }}
                >
                  اكتشف المزيد
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

// Simple zoom control component
function ZoomControl() {
  const map = useMap();
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <button
        onClick={() => map.zoomIn()}
        style={{
          width: 34,
          height: 34,
          background: "white",
          border: "2px solid rgba(0,0,0,0.15)",
          borderRadius: "8px 8px 0 0",
          fontSize: 18,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
        }}
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        style={{
          width: 34,
          height: 34,
          background: "white",
          border: "2px solid rgba(0,0,0,0.15)",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          fontSize: 18,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
        }}
      >
        −
      </button>
    </div>
  );
}
