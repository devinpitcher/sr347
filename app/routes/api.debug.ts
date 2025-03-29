import { getDate } from "~/utils/dayjs";

export const loader = async () => {
  const now = getDate();

  return Response.json({
    now: {
      hour: now.hour(),
      iso: now.toISOString(),
      utcOffset: now.utcOffset() / 60,
    },
  });
};
