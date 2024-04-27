import moment from "moment";

export function normalizeDate(date: string | null) {
  if (date == null) return null;
  if (date == "") return null;
  return moment(date).format("YYYY-MM-DD");
}

export function jsonToQueryString(json: object) {
  return Object.keys(json)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
    .join("&");
}
