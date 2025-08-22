"use client";
import { submitSearchQuery } from "@/actions/searchQuery";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState();
  const [searchResults, setSearchResults] = useState({ page_max: 1, hits: [] });
  const [searchPage, setSearchPage] = useState(1);
  const isTableFilled = searchResults.hits.length > 0;
  const searchPageMax = searchResults.page_max;

  useEffect(() => {
    const runSearch = async () => {
      await submitSearch();
    };
    runSearch();
  }, []);

  const submitSearch = async () => {
    const searchParams = {
      q: searchQuery,
      query_by: "title",
      sort_by: "average_rating:desc",
      page: searchPage,
    };
    const returnedResults = await submitSearchQuery(searchParams);
    if (returnedResults.success) {
      setSearchPage(1);
      setSearchResults({
        ...returnedResults,
        page_max: Math.ceil(returnedResults.found / 10),
      });
    }
  };

  const previousPage = async () => {
    if (searchPage <= 1) {
      return;
    }
    setSearchPage((oldPage) => oldPage - 1);
    const searchParams = {
      q: searchQuery,
      query_by: "title",
      sort_by: "average_rating:desc",
      page: searchPage - 1,
    };
    const returnedResults = await submitSearchQuery(searchParams);
    if (returnedResults.success) {
      setSearchResults({
        ...returnedResults,
        page_max: Math.ceil(returnedResults.found / 10),
      });
    }
  };
  const nextPage = async () => {
    if (searchPage >= searchPageMax) {
      return;
    }
    setSearchPage((oldPage) => oldPage + 1);
    const searchParams = {
      q: searchQuery,
      query_by: "title",
      sort_by: "average_rating:desc",
      page: searchPage + 1,
    };
    const returnedResults = await submitSearchQuery(searchParams);
    if (returnedResults.success) {
      setSearchResults({
        ...returnedResults,
        page_max: Math.ceil(returnedResults.found / 10),
      });
    }
  };

  return (
    <div className="bg-[#fefef8] min-h-screen flex justify-center py-16">
      <div className="flex flex-col w-4/5 max-w-[1000px] gap-4 bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-8">Typesense Search</h1>
        <div className="flex gap-4">
          <div className="flex-grow">
            <input
              type="text"
              name="search-query"
              id="search-query"
              placeholder="Search a book here..."
              className="w-full px-4 py-2 shadow-lg"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex">
            <button
              onClick={submitSearch}
              className="bg-orange-100 rounded-lg px-4 py-2 hover:bg-orange-200 active:bg-orange-300 hover:cursor-pointer"
            >
              Search Books
            </button>
          </div>
        </div>
        <div>
          {isTableFilled ? (
            <table className="table-fixed w-full">
              <thead>
                <tr>
                  <th className="w-1/2">Title</th>
                  <th className="w-1/5">Authors</th>
                  <th className="w-1/10">Year</th>
                  <th className="w-1/5">Rating</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.hits.map((aSearchResult, idx) => (
                  <tr key={idx}>
                    <td>{aSearchResult.document.title}</td>
                    <td>{aSearchResult.document.authors.join(", ")}</td>
                    <td>{aSearchResult.document.publication_year}</td>
                    <td>
                      {aSearchResult.document.average_rating}/5.00 (
                      {aSearchResult.document.ratings_count})
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1>No results found!</h1>
          )}
        </div>
        <div className="flex gap-4 items-center justify-center">
          {/* pagination */}
          <button
            className="rounded-lg px-4 py-2 bg-slate-100  hover:bg-slate-200 active:bg-slate-300 hover:cursor-pointer"
            onClick={previousPage}
          >
            Previous
          </button>
          <div>
            <p>
              Page <span>{searchPage}</span> of <span>{searchPageMax}</span>
            </p>
          </div>
          <button
            className="rounded-lg px-4 py-2 bg-slate-100  hover:bg-slate-200 active:bg-slate-300 hover:cursor-pointer"
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
