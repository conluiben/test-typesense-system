import fs from "fs";
import path from "path";
import { tsClient } from "@/data";

const filePath = path.join(process.cwd(), "src", "data", "books.jsonl");
const data = fs.readFileSync(filePath, "utf8");

async function run() {
  try {
    try {
      await tsClient.collections("books").retrieve();
      console.log("Collection already exists!");
    } catch (e) {
      console.log("Creating new collection:", e);
      const booksSchema = {
        name: "books",
        fields: [
          { name: "title", type: "string" },
          { name: "authors", type: "string[]", facet: true },
          { name: "publication_year", type: "int32", facet: true },
          { name: "ratings_count", type: "int32" },
          { name: "average_rating", type: "float" },
        ],
        default_sorting_field: "ratings_count",
      };

      const collections = await tsClient.collections().create(booksSchema);
      console.log("Created collections:");
      console.log(collections);

      await tsClient
        .collections("books")
        .documents()
        .import(data, { action: "upsert" });
    }
  } catch (err) {
    console.error(err);
  }
}

run();
