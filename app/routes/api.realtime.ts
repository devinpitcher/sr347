import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { UmamiRealtimeResponse } from "~/types/umami";
import { UMAMI_WEBSITE_ID } from "~/constants/app";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const {
    env: { UMAMI_API_KEY },
  } = context.cloudflare;

  const data = await fetch(`https://api.umami.is/v1/websites/${UMAMI_WEBSITE_ID}/active`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UMAMI_API_KEY}`,
      Accept: "application/json",
    },
  })
    .then((res) => res.json() as unknown as UmamiRealtimeResponse)
    .catch(() => null);

  if (data == null) {
    return Response.json(
      {},
      {
        status: 500,
      }
    );
  }

  return Response.json(data);
};
