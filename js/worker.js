export default {
  async fetch(request) {
    const url = new URL(request.url);

    // /fetch?url=https://www.ebay.com/...
    if (url.pathname !== "/fetch") {
      return new Response("OK", { status: 200, headers: corsHeaders() });
    }

    const target = url.searchParams.get("url");
    if (!target) return new Response("Missing url param", { status: 400, headers: corsHeaders() });

    // Basic safety: only allow ebay.com
    let t;
    try { t = new URL(target); } catch {
      return new Response("Invalid url", { status: 400, headers: corsHeaders() });
    }
    if (!/(\.|^)ebay\.com$/i.test(t.hostname)) {
      return new Response("Host not allowed", { status: 403, headers: corsHeaders() });
    }

    const resp = await fetch(target, {
      headers: {
        "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml"
      }
    });

    const body = await resp.text();

    return new Response(body, {
      status: 200,
      headers: {
        ...corsHeaders(),
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "*"
  };
}
