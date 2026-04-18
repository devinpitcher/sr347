import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(isSameOrAfter);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.tz.setDefault("America/Phoenix");

function getDate(): dayjs.Dayjs {
  return dayjs().tz();
}

export { dayjs, getDate };
