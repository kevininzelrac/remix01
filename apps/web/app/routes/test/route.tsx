import { MimeType } from "server-image-core";

import { Image } from "~/components/image";

const src =
  "https://cdn.vox-cdn.com/thumbor/XrQ1hlHUj8-ok5nWOZQBiWAzJxA=/85x0:1014x619/1200x800/filters:focal(85x0:1014x619)/cdn.vox-cdn.com/uploads/chorus_image/image/29585969/mgsvgz_ss_demo_002.0.jpg";

export default function TestPage() {
  return (
    <Image
      src={src}
      responsive={[
        {
          size: {
            width: 480,
            height: 320,
          },
        },
      ]}
      options={{
        contentType: MimeType.WEBP,
      }}
    />
  );
}
