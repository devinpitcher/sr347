export function proxyRequest(url: string, request: Request) {
  const proxyUrl = new URL(url);
  const pRequest = new Request(proxyUrl, request.clone());

  pRequest.headers.set("Host", proxyUrl.hostname);

  return fetch(proxyUrl, pRequest);
}
