const { spawn } = require("node:child_process");

let fetchImpl = globalThis.fetch;
try {
  ({ fetch: fetchImpl } = require("node:fetch"));
} catch (error) {
  if (typeof fetchImpl !== "function") {
    throw new Error(
      "A fetch implementation is required to check server status",
      { cause: error },
    );
  }
}

function startDevServer({ cwd, core }) {
  const server = spawn("npm", ["run", "dev"], {
    cwd,
    stdio: "pipe",
  });

  server.stdout?.on("data", (data) => {
    core.info(data.toString().trim());
  });

  server.stderr?.on("data", (data) => {
    core.setFailed(data.toString().trim());
  });

  return server;
}

async function waitForServer(url, timeoutMs) {
  const startTime = Date.now();
  let lastError;

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetchImpl(url);
      if (response?.ok) {
        return;
      }
    } catch (error) {
      // Allow retry loop to continue until timeout elapses.
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(
    `Server at ${url} did not become ready within ${timeoutMs}ms${
      lastError ? lastError.message : ""
    }`,
    lastError ? { cause: lastError } : undefined,
  );
}

async function stopDevServer(server, core) {
  if (!server) {
    return;
  }

  core.info("Stopping development server...");
  server.kill("SIGTERM");
}

module.exports = {
  startDevServer,
  waitForServer,
  stopDevServer,
};
