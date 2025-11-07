const assert = require("node:assert/strict");
const path = require("node:path");
const { describe, it } = require("node:test");
const mockFs = require("mock-fs");

const modulePath = path.join(__dirname, "../lib/server.js");

async function withMockedModules({ spawnImpl, fetchImpl }, fn) {
  const childProcess = require("node:child_process");

  const originalSpawn = childProcess.spawn;
  const originalFetch = globalThis.fetch;

  if (spawnImpl) {
    childProcess.spawn = spawnImpl;
  }

  if (fetchImpl) {
    globalThis.fetch = fetchImpl;
  }

  delete require.cache[modulePath];
  const serverModule = require(modulePath);

  try {
    return await fn(serverModule);
  } finally {
    childProcess.spawn = originalSpawn;
    globalThis.fetch = originalFetch;
    delete require.cache[modulePath];
  }
}

describe("lib/server", () => {
  it("starts the dev server and wires logging", async () => {
    const spawnCalls = [];
    let stdoutHandler;
    let stderrHandler;

    await withMockedModules(
      {
        spawnImpl: (command, args, options) => {
          spawnCalls.push({ command, args, options });
          return {
            stdout: {
              on: (event, handler) => {
                if (event === "data") {
                  stdoutHandler = handler;
                }
              },
            },
            stderr: {
              on: (event, handler) => {
                if (event === "data") {
                  stderrHandler = handler;
                }
              },
            },
          };
        },
      },
      async ({ startDevServer }) => {
        mockFs({});
        try {
          const infoMessages = [];
          const failedMessages = [];
          const core = {
            info: (message) => infoMessages.push(message),
            setFailed: (message) => failedMessages.push(message),
          };

          const server = startDevServer({ cwd: "/workspace/app", core });

          assert.equal(spawnCalls.length, 1);
          assert.deepEqual(spawnCalls[0], {
            command: "npm",
            args: ["run", "dev"],
            options: { cwd: "/workspace/app", stdio: "pipe" },
          });

          assert.ok(stdoutHandler, "stdout handler should be registered");
          assert.ok(stderrHandler, "stderr handler should be registered");

          stdoutHandler(Buffer.from("ready\n"));
          stderrHandler(Buffer.from("failed\n"));

          assert.ok(server, "server object should be returned");
          assert.deepEqual(infoMessages, ["ready"]);
          assert.deepEqual(failedMessages, ["failed"]);
        } finally {
          mockFs.restore();
        }
      },
    );
  });

  it("waits for the server to be ready", async () => {
    const fetchCalls = [];

    await withMockedModules(
      {
        fetchImpl: async (url) => {
          fetchCalls.push(url);
          return { ok: true };
        },
      },
      async ({ waitForServer }) => {
        mockFs({});
        try {
          await waitForServer("http://localhost:4321", 50);

          assert.deepEqual(fetchCalls, ["http://localhost:4321"]);
        } finally {
          mockFs.restore();
        }
      },
    );
  });

  it("propagates failure when the server never becomes ready", async () => {
    const fetchCalls = [];

    await withMockedModules(
      {
        fetchImpl: async (url) => {
          fetchCalls.push(url);
          throw new Error("connection refused");
        },
      },
      async ({ waitForServer }) => {
        mockFs({});
        try {
          const start = Date.now();
          await assert.rejects(
            () => waitForServer("http://localhost:3000", 1),
            (error) => {
              assert.match(
                error.message,
                /Server at http:\/\/localhost:3000 did not become ready/,
              );
              assert.ok(
                error.message.includes("connection refused"),
                "error message should include underlying reason",
              );
              return true;
            },
          );

          assert.ok(fetchCalls.length >= 1);
          assert.ok(Date.now() - start >= 0);
        } finally {
          mockFs.restore();
        }
      },
    );
  });

  it("stops the dev server when provided", async () => {
    await withMockedModules({}, async ({ stopDevServer }) => {
      mockFs({});
      try {
        const infoMessages = [];
        let killedWith;
        const core = {
          info: (message) => infoMessages.push(message),
          setFailed: () => {},
        };

        const fakeServer = {
          kill: (signal) => {
            killedWith = signal;
          },
        };

        await stopDevServer(fakeServer, core);

        assert.deepEqual(infoMessages, ["Stopping development server..."]);
        assert.equal(killedWith, "SIGTERM");
      } finally {
        mockFs.restore();
      }
    });
  });
});
