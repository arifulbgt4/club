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
            "linear-gradient(to right, #74ebd5 0%, #9face6 100%)",
        }}
      >
        <h1
          style={{
            fontSize: 90,
            marginBottom: 40,
            lineHeight: 1.0002,
          }}
        >
          Otask
        </h1>
      </div>
    ),
    {
      ...size,
    }
  );
}
