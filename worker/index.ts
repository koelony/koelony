/**
 * In front of the static site on koelony.com: www.koelony.com answers with a permanent redirect to
 * the bare domain, so search engines see one site, not two copies. Everything else is the static
 * files in dist/ (including the 404 page and the short links in _redirects).
 */
type Env = { ASSETS: { fetch: (request: Request) => Promise<Response> } };

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    const url = new URL(request.url);
    if (url.hostname === "www.koelony.com") {
      url.hostname = "koelony.com";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
