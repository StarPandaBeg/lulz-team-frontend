import moment from "moment";

export function normalizeDate(date: string | null) {
  if (date == null) return null;
  if (date == "") return null;
  return moment(date).format("YYYY-MM-DD");
}
