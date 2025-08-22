import { tsClient } from "@/data";
import { searchParamsSchema } from "@/schema";

export async function submitSearchQuery(searchParameters) {
  try {
    const validatedFields = searchParamsSchema.validate(searchParameters, {
      abortEarly: false,
    });
    if (validatedFields.error) {
      throw new Error(validatedFields.error);
    }
    const searchResults = await tsClient
      .collections("books")
      .documents()
      .search(searchParameters);

    return { ...searchResults, success: true };
  } catch (error) {
    console.error("Search Action Error:", error);
    return {
      success: false,
      error: error,
    };
  }
}
