import type { Metadata, Viewport } from "next";
import {
  NextStudio,
  NextStudioLayout,
  metadata as studioMetadata,
  viewport as studioViewport,
} from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Bolo-Bolo Studio",
};

export const viewport: Viewport = studioViewport as Viewport;

export default function StudioPage() {
  return (
    <NextStudioLayout>
      <NextStudio config={config} />
    </NextStudioLayout>
  );
}
