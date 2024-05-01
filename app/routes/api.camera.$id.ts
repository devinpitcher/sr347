import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { CAMERAS } from "~/constants/cameras";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const camera = CAMERAS.find(({ id }) => id === params.id!);

  if (!camera) {
    return new Response(null, {
      status: 400,
      statusText: "Camera not allowed",
    });
  }

  const url = `http://vods.az511.com/adot_${params.id}.jpg?v=${new Date().getTime()}`;

  const response = await fetch(url);

  if (!response.ok) {
    return new Response(null, {
      status: 503,
      statusText: "Camera offline",
    });
  }

  return new Response(response.body, {
    headers: {
      "x-camera-name": camera.name,
      "content-type": response.headers.get("content-type")!,
      "content-length": response.headers.get("content-length")!,
      "cache-control": "private, max-age=15",
    },
  });
};
