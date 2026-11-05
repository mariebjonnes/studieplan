const { spawn } = require("node:child_process");

const nextBin = require.resolve("next/dist/bin/next");
const port = process.env.PORT || 3000;

console.info("INFO: Server started");
console.info(`INFO: Listening on 0.0.0.0:${port}`);

const child = spawn(
    process.execPath,
    [nextBin, "start", "-H", "0.0.0.0", "-p", String(port)],
    { stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));