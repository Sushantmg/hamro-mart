"use client";

import { useState, FormEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Searchbar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
    // Replace with real search logic or router navigation
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-md mx-auto"
    >
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          flex-grow 
          px-4 py-3 
          rounded-l-lg 
          border 
          border-gray-300 
          focus:outline-none 
          focus:ring-2 focus:ring-green-500 
          dark:bg-gray-700 
          dark:border-gray-600 
          dark:text-white
          transition 
          duration-200
          hover:border-green-500
        "
      />
      <button
        type="submit"
        className="
          bg-green-600 
          hover:bg-green-700 
          text-white 
          px-5 py-3 
          rounded-r-lg 
          flex items-center justify-center
          transition-colors duration-200
        "
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
    </form>
  );
};

export default Searchbar;
