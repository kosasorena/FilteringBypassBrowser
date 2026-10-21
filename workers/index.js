export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Please provide a target URL using ?url=...', { status: 400 });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Cookie': request.headers.get('Cookie') || ''
        },
        redirect: 'follow'
      });

      // CORSヘッダーを付与してブラウザからアクセスできるようにする
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Access-Control-Allow-Credentials', 'true');

      const body = await response.text();

      return new Response(body, {
        status: response.status,
        headers: newHeaders
      });
    } catch (e) {
      return new Response(`Error fetching URL: ${e.message}`, { status: 500 });
    }
  }
};
