import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { resolve } from "node:path";

function apiIsRunning() {
  return new Promise((resolve) => {
    const socket = createConnection({ host: "127.0.0.1", port: 3333 });
    const finish = (running) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(running);
    };
    socket.setTimeout(600);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

function excellenceApiDevServer() {
  let apiProcess;
  let apiMonitor;
  const ensureApi = async (server) => {
    if (await apiIsRunning()) return;
    if (apiProcess && apiProcess.exitCode === null && !apiProcess.killed) {
      apiProcess.kill();
      apiProcess = undefined;
    }
    const apiDirectory = resolve(process.cwd(), "../api");
    const tsxCli = resolve(apiDirectory, "node_modules/tsx/dist/cli.mjs");
    apiProcess = spawn(process.execPath, [tsxCli, "watch", "src/server.ts"], {
      cwd: apiDirectory,
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
    });
    apiProcess.once("error", (error) => {
      server.config.logger.error(`Impossible de démarrer l’API Excellence : ${error.message}`);
    });
    apiProcess.once("exit", () => {
      apiProcess = undefined;
    });
  };
  return {
    name: "excellence-api-dev-server",
    configureServer(server) {
      void ensureApi(server);
      apiMonitor = setInterval(() => void ensureApi(server), 5000);
      apiMonitor.unref();
      server.httpServer?.once("close", () => {
        if (apiMonitor) clearInterval(apiMonitor);
        if (apiProcess && !apiProcess.killed) apiProcess.kill();
      });
    },
  };
}

export default defineConfig({
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
    allowedHosts: ["terminal.local"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3333",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [excellenceApiDevServer(), react()],
});
