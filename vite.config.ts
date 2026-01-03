import {defineConfig} from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import process from 'node:process';
import zipPack from 'vite-plugin-zip-pack';
import checker from 'vite-plugin-checker';
import WextManifest from 'vite-plugin-wext-manifest';

export default defineConfig(({mode}) => {
  const isDevelopment = mode !== 'production';
  const sourcePath = path.resolve(__dirname, 'source');
  const destPath = path.resolve(__dirname, 'extension');
  const targetBrowser = process.env.TARGET_BROWSER || 'chrome';

  const getOutDir = () => path.resolve(destPath, targetBrowser);

  const getExtensionZipFileName = () => {
    switch (targetBrowser) {
      case 'opera': {
        return `${targetBrowser}.crx`;
      }

      case 'firefox': {
        return `${targetBrowser}.xpi`;
      }

      default: {
        return `${targetBrowser}.zip`;
      }
    }
  };

  return {
    root: sourcePath,

    publicDir: path.resolve(sourcePath, 'public'),

    resolve: {
      alias: {
        '@': path.resolve(sourcePath),
      },
    },

    define: {
      __DEV__: isDevelopment,
      __TARGET_BROWSER__: JSON.stringify(targetBrowser),
    },

    plugins: [
      react(),

      // Run typescript checker in worker thread
      checker({
        typescript: {
          tsconfigPath: './tsconfig.json',
        },
      }),

      // Generate manifest.json for the browser
      WextManifest({
        manifestPath: 'manifest.json',
        usePackageJSONVersion: true,
      }),

      !isDevelopment &&
        zipPack({
          inDir: getOutDir(),
          outDir: destPath,
          outFileName: getExtensionZipFileName(),
          enableLogging: true,
        }),
    ],

    build: {
      outDir: getOutDir(),

      emptyOutDir: !isDevelopment,

      sourcemap: isDevelopment ? 'inline' : false,

      minify: mode === 'production',

      rollupOptions: {
        input: {
          // For UI pages, use the HTML file as the entry.
          // Vite will find the <script> tag inside and bundle it.
          popup: path.resolve(sourcePath, 'Popup/popup.html'),
          options: path.resolve(sourcePath, 'Options/options.html'),
          history: path.resolve(sourcePath, 'History/history.html'),
          // Background script (service worker in Chrome, background script in Firefox)
          // Both MV3 implementations support ES modules
          background: path.resolve(sourcePath, 'Background/index.ts'),
        },

        output: {
          entryFileNames: 'assets/js/[name].bundle.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.names?.[0]?.match(/\.(css|s[ac]ss|less)$/)) {
              return 'assets/css/[name]-[hash].css';
            }
            return 'assets/[name]-[hash].[ext]';
          },
          chunkFileNames: 'assets/js/[name]-[hash].chunk.js',
        },
      },
    },

    // esbuild options - drop console/debugger in production
    esbuild:
      mode === 'production'
        ? {
            drop: ['console', 'debugger'],
          }
        : {},
  };
});
