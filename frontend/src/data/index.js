import Typesense from "typesense";

export const tsClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || "localhost",
      port: process.env.TYPESENSE_PORT || 8108,
      protocol: process.env.TYPESENSE_PROTOCOL || "http",
    },
  ],
  apiKey: "xyz",
  connectionTimeoutSeconds: 2,
});
