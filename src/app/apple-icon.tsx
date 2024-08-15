import { ImageResponse } from "next/og";
import { siteConfig } from "~/config/site";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// export function generateImageMetadata() {
//   return [
//     {
//       contentType: "image/png",
//       size: { width: 48, height: 48 },
//       id: "small",
//     },
//     {
//       contentType: "image/png",
//       size: { width: 72, height: 72 },
//       id: "medium",
//     },
//   ];
// }

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: "100%",
          height: "100%",
          border: `4px solid ${siteConfig().themeColor}`,
          borderRadius: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "100%",
            background: siteConfig().themeColor,
          }}
        ></span>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
