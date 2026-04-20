import { createServer } from "node:http";

const PORT = 8787;

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(payload));
};

const server = createServer((request, response) => {
  if (request.url !== "/api/register" || request.method !== "POST") {
    sendJson(response, 404, { message: "Route not found." });
    return;
  }

  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", () => {
    try {
      const payload = JSON.parse(body);
      const shouldFail =
        String(payload.fullName ?? "")
          .toLowerCase()
          .includes("fail") ||
        String(payload.taxIdentifier ?? "")
          .toUpperCase()
          .includes("ERROR");

      if (shouldFail) {
        sendJson(response, 422, {
          message: "Registration rejected by mock server. Remove 'fail' from full name and retry.",
        });
        return;
      }

      sendJson(response, 200, {
        message: "Registration completed successfully.",
      });
    } catch {
      sendJson(response, 400, {
        message: "Malformed JSON payload.",
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}`);
});
