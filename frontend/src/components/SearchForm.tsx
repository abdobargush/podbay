"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

const SearchForm = () => {
  const router = useRouter();

  const searchTerm = useSearchParams().get("term");
  const [term, setTerm] = useDebounceValue(searchTerm || "", 500);
  const handleSearch = () => {
    if (term === "") {
      router.push("/");
      return;
    }
    if (term.length < 3) return;
    router.push(`/?term=${encodeURIComponent(term)}`);
  };
  useEffect(handleSearch, [term, router]);

  return (
    <div className="w-full relative group foc">
      <label
        htmlFor="search-input"
        className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 text-neutral-300"
      >
        <i className="hn hn-search"></i>
      </label>
      <input
        type="text"
        id="search-input"
        className="h-10 md:h-14 bg-background md:text-lg border border-neutral-700 rounded-full text-neutral-200 block w-full ps-12 md:ps-14 focus:outline-white focus:border-transparent focus:ring-0 focus:outline-dotted focus:outline-offset-2 placeholder:text-neutral-300"
        placeholder="ابحث في مكتبة البودكاست ..."
        defaultValue={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchForm;
