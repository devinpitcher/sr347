export async function proxyRequest(url: URL | string, request: Request): Promise<Response> {
  const upstreamHeaders = new Headers(request.headers);

  const clientAddress = request.headers.get("cf-connecting-ip");
  if (clientAddress) {
    upstreamHeaders.set("x-forwarded-for", clientAddress);
  }

  const upstreamResponse = await fetch(url, {
    method: request.method,
    headers: upstreamHeaders,
    cache: "no-store",
    body: request.body,
    // Required when body is a ReadableStream
    ...(request.body && { duplex: "half" as const }),
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: upstreamResponse.headers,
  });
}
