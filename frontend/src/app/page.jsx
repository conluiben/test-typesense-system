"use client";
import { submitSearchQuery } from "@/actions/searchQuery";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ page_max: 1, hits: [] });
  const [searchSuggestedResults, setSearchSuggestedResults] = useState({
    hits: [],
  });
  const [searchPage, setSearchPage] = useState(1);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const isTableFilled = searchResults.hits.length > 0;
  const searchPageMax = searchResults.page_max;

  useEffect(() => {
    const runSearch = async () => {
      await submitSearch({
        q: "",
        query_by: "title",
        sort_by: "average_rating:desc",
        page: 1,
      });
    };
    runSearch();
  }, []);

  const submitSearch = async (searchParams, isSuggestedResults = false) => {
    const returnedResults = await submitSearchQuery(searchParams);
    if (returnedResults.success) {
      if (isSuggestedResults) {
        setSearchSuggestedResults({
          ...returnedResults,
          page_max: Math.ceil(returnedResults.found / 10),
        });
      } else {
        setSearchPage(1);
        setSearchResults({
          ...returnedResults,
          page_max: Math.ceil(returnedResults.found / 10),
        });
      }
    }
  };

  const handleClickSearch = async () => {
    const searchParams = {
      q: searchQuery,
      query_by: "title",
      sort_by: "average_rating:desc",
      page: 1,
      per_page: 10,
    };
    await submitSearch(searchParams);
  };

  const handleChangeSearch = async (e) => {
    setSearchQuery(e.target.value);
    const searchParams = {
      q: e.target.value,
      query_by: "title",
      sort_by: "average_rating:desc",
      page: 1,
      per_page: 5,
      prefix: true,
    };
    await submitSearch(searchParams, true);
  };

  const handleClickSuggestion = async (queryTitle) => {
    setSearchQuery(queryTitle);
    setIsSearchBarFocused(false);

    const searchParams = {
      q: queryTitle,
      query_by: "title",
      sort_by: "average_rating:desc",
      page: 1,
    };
    await submitSearch(searchParams);
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
    await submitSearch(searchParams);
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
    await submitSearch(searchParams);
  };

  return (
    <div className="bg-[#fefef8] min-h-screen flex justify-center py-16">
      <div className="flex flex-col w-4/5 max-w-[1000px] gap-4 bg-white rounded-2xl max-h-[80vh] p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Typesense Search</h1>
        <div className="flex gap-4">
          <div className="flex-grow">
            <div className="flex flex-col relative">
              <input
                type="text"
                name="search-query"
                id="search-query"
                value={searchQuery}
                placeholder="Search a book title here..."
                className="w-full px-4 py-2 shadow-lg"
                autoComplete="off"
                onChange={handleChangeSearch}
                onFocus={() => setIsSearchBarFocused(true)}
                onBlur={() => setIsSearchBarFocused(false)}
              />
              {searchQuery !== "" && isSearchBarFocused && (
                <div className="absolute top-full w-full z-100">
                  {searchSuggestedResults.hits.length > 0 ? (
                    searchSuggestedResults.hits.map((aSuggestedResult, idx) => (
                      <p
                        className="px-4 py-2 bg-orange-50 hover:bg-orange-100 hover:cursor-pointer"
                        key={idx}
                        onMouseDown={() => {
                          handleClickSuggestion(
                            aSuggestedResult.document.title
                          );
                        }}
                      >
                        {aSuggestedResult.document.title}
                      </p>
                    ))
                  ) : (
                    <p className="px-4 py-2 bg-orange-50">No results found</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex">
            <button
              onClick={handleClickSearch}
              className="bg-orange-100 rounded-lg px-4 py-2 hover:bg-orange-200 active:bg-orange-300 hover:cursor-pointer"
            >
              Search Books
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto">
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
