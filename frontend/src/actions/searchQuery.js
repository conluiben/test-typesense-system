import { tsClient } from "@/data";

export async function submitSearchQuery(searchParameters) {
  try {
    const searchResults = await tsClient
      .collections("books")
      .documents()
      .search(searchParameters);

    return { ...searchResults, success: true };
  } catch (error) {
    console.log("Error:", error);
    return {
      success: false,
      error: error,
    };
  }
}
