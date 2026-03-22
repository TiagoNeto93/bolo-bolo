import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/sanity/queries";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_LABELS: Record<string, string> = {
  cheesecakes: "Cheesecake",
  chocolate: "Bolo de Chocolate",
  cenoura: "Bolo de Cenoura",
  outros: "Outros",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const name = product?.name ?? "Bolo-Bolo";
  const category = CATEGORY_LABELS[product?.category] ?? "";

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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            position: "relative",
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          {category && (
            <p
              style={{
                fontSize: 20,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9917A",
                margin: 0,
              }}
            >
              {category}
            </p>
          )}

          <p
            style={{
              fontSize: name.length > 20 ? 72 : 96,
              fontWeight: 700,
              color: "#3B2314",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {name}
          </p>

          <div
            style={{
              width: 80,
              height: 4,
              borderRadius: 2,
              background: "#C4653A",
            }}
          />

          <p style={{ fontSize: 24, color: "#5C3D2E", margin: 0 }}>
            Bolo-Bolo · Bolos caseiros em Braga
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
