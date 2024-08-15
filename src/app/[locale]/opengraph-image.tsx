import { ImageResponse } from "next/og";
import { siteConfig } from "~/config/site";

export const alt = siteConfig().shortName;
export const contentType = "image/png";

export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: { locale },
}: {
  params: { locale: string };
}) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          flexDirection: "column",
          padding: 30,
          backgroundImage:
            "linear-gradient(to right, #020817 0%, #040d22 50%, #020817 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              border: `7px solid ${siteConfig().themeColor}`,
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "100%",
                background: siteConfig().themeColor,
              }}
            ></span>
          </div>
          <p
            style={{
              color: "#fff",
              fontSize: "80px",
              marginLeft: "5px",
              fontWeight: 600,
              letterSpacing: "3px",
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          >
            Task
          </p>
        </div>
        <p style={{ color: "#fff", fontSize: "60px", width: "900px" }}>
          {siteConfig().shortName}
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
