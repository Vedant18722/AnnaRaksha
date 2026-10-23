import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const disableHmrClientPlugin = (): Plugin => ({
  name: 'disable-hmr-client',
  transformIndexHtml: {
    order: 'pre',
    handler() {
      return [
        {
          tag: 'script',
          children: `(function(){
  try {
    var W = window.WebSocket;
    if (!W) return;
    function MockWebSocket(url, proto) {
      if (proto === 'vite-hmr' || (typeof url === 'string' && (url.indexOf('token=') !== -1 || url.indexOf('24678') !== -1))) {
        var dummy = new EventTarget();
        dummy.readyState = 1;
        dummy.OPEN = 1;
        dummy.CONNECTING = 0;
        dummy.CLOSING = 2;
        dummy.CLOSED = 3;
        dummy.send = function() {};
        dummy.close = function() {};
        dummy.binaryType = 'blob';
        dummy.bufferedAmount = 0;
        dummy.extensions = '';
        dummy.protocol = 'vite-hmr';
        dummy.url = url;
        dummy.onopen = null;
        dummy.onclose = null;
        dummy.onerror = null;
        dummy.onmessage = null;
        setTimeout(function() {
          var evt = new Event('open');
          if (typeof dummy.onopen === 'function') dummy.onopen(evt);
          dummy.dispatchEvent(evt);
        }, 0);
        return dummy;
      }
      return new W(url, proto);
    }
    MockWebSocket.prototype = W.prototype;
    MockWebSocket.CONNECTING = 0;
    MockWebSocket.OPEN = 1;
    MockWebSocket.CLOSING = 2;
    MockWebSocket.CLOSED = 3;
    window.WebSocket = MockWebSocket;
  } catch(e) {}
})();`,
          injectTo: 'head-prepend',
        },
      ];
    },
  },
});

export default defineConfig(() => {
  return {
    plugins: [disableHmrClientPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio preview environments to prevent websocket connection errors
      hmr: false,
      watch: null,
    },
  };
});

