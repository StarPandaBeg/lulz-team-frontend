export default defineEventHandler((event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "*",
  };
  // setHeaders(event, headers);
  setResponseHeaders(event, headers);
});
