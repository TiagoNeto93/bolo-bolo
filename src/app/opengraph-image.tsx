import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bolo-Bolo — Bolos Caseiros em Braga";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F0E8",
          position: "relative",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            background: "#D4A853",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%",
            background: "#C4653A",
            opacity: 0.15,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            position: "relative",
          }}
        >
          <p
            style={{
              fontSize: 20,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C9917A",
              margin: 0,
            }}
          >
            Bolos caseiros em Braga
          </p>

          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span
              style={{
                fontSize: 120,
                fontWeight: 700,
                color: "#3B2314",
                lineHeight: 1,
              }}
            >
              Bolo
            </span>
            <span
              style={{
                fontSize: 120,
                fontWeight: 700,
                color: "#C4653A",
                lineHeight: 1,
              }}
            >
              -
            </span>
            <span
              style={{
                fontSize: 120,
                fontWeight: 700,
                color: "#3B2314",
                lineHeight: 1,
              }}
            >
              Bolo
            </span>
          </div>

          <div
            style={{
              width: 120,
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(to right, #D4A853, #C4653A, #C9917A)",
            }}
          />

          <p
            style={{
              fontSize: 28,
              color: "#5C3D2E",
              margin: 0,
              marginTop: 8,
            }}
          >
            Cheesecakes · Chocolate · Cenoura
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
