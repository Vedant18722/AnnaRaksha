import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function patchViteClient() {
  try {
    const clientPath = path.resolve(__dirname, '../node_modules/vite/dist/client/client.mjs');
    if (!fs.existsSync(clientPath)) {
      return false;
    }
    let content = fs.readFileSync(clientPath, 'utf8');
    let modified = false;

    if (content.includes('reject(/* @__PURE__ */ new Error("WebSocket closed without opened."));')) {
      content = content.replace(
        'reject(/* @__PURE__ */ new Error("WebSocket closed without opened."));',
        'resolve(); /* Silenced WebSocket closed without opened */'
      );
      modified = true;
    }

    if (content.includes('console.error(`[vite] failed to connect to websocket')) {
      const targetStart = 'async connect(handlers) {';
      const targetEnd = 'async disconnect() {';
      const startIndex = content.indexOf(targetStart);
      const endIndex = content.indexOf(targetEnd);
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const replacement = `async connect(handlers) {\n\t\t\ttry {\n\t\t\t\tawait wsTransport.connect(handlers);\n\t\t\t} catch (e) {\n\t\t\t\t// HMR WebSocket connection is disabled and safely ignored\n\t\t\t}\n\t\t},\n\t\t`;
        content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(clientPath, content, 'utf8');
      console.log('[patch-vite-hmr] Successfully patched client.mjs');
      return true;
    }
  } catch (err) {
    console.warn('[patch-vite-hmr] Non-fatal patch warning:', err);
  }
  return false;
}

if (process.argv[1] === __filename) {
  patchViteClient();
}
