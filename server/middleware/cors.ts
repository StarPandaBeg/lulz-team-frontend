export default defineEventHandler((event) => {
  const headers = {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Headers":
      "origin, content-type, accept, authorization",
    "Access-Control-Allow-Credentials": "true",
  };
  // setHeaders(event, headers);
  setResponseHeaders(event, headers);
});
