import Typesense from "typesense";

export const tsClient = new Typesense.Client({
  nodes: [{ host: "localhost", port: 8108, protocol: "http" }],
  apiKey: "xyz",
  connectionTimeoutSeconds: 2,
});
