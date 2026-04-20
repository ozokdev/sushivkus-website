import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Аригато Суши — доставка суши в Люберцах";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
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
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #2a0808 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #e63946, #f47a82, #e63946)",
          }}
        />

        <div style={{ fontSize: 120, marginBottom: 24 }}>🍣</div>

        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: -2,
            marginBottom: 16,
          }}
        >
          <span style={{ color: "#e63946" }}>Аригато</span>
          <span style={{ color: "#fff", marginLeft: 20 }}>Суши</span>
        </div>

        <div
          style={{
            fontSize: 36,
            color: "#cfcfcf",
            fontWeight: 500,
            marginBottom: 40,
          }}
        >
          Доставка суши в Люберцах
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 24,
            color: "#888",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(230,57,70,0.15)",
              borderRadius: 16,
              color: "#f8a8ae",
            }}
          >
            45–60 минут
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: 16,
              color: "#eee",
            }}
          >
            ул. Шоссейная, 42
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
