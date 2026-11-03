import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import https from 'https'

function ttsProxyPlugin() {
  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', (req, res) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost:5173');
          const text = urlObj.searchParams.get('text') || '';
          const lang = urlObj.searchParams.get('lang') || 'en';

          if (!text) {
            res.statusCode = 400;
            return res.end('Missing text parameter');
          }

          const targetLang = lang.startsWith('hi') ? 'hi' : 'en';
          const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodeURIComponent(text)}`;

          const googleReq = https.get(googleUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
          }, (googleRes) => {
            res.writeHead(googleRes.statusCode || 200, {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=86400',
              'Access-Control-Allow-Origin': '*'
            });
            googleRes.pipe(res);
          });

          googleReq.on('error', (err) => {
            console.error('[TTS Proxy Error]:', err.message);
            res.statusCode = 500;
            res.end(err.message);
          });
        } catch (e) {
          res.statusCode = 500;
          res.end(e.message);
        }
      });
    }
  };
}

function ghPagesImagePlugin() {
  return {
    name: 'gh-pages-image-plugin',
    transform(code, id) {
      if (process.env.NODE_ENV === 'production' && !id.includes('node_modules')) {
        return {
          code: code.replace(/(['"])\/images\//g, '$1/JourneyToBharat/images/'),
          map: null
        };
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/JourneyToBharat/' : '/',
  plugins: [react(), ttsProxyPlugin(), ghPagesImagePlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false
  }
})
