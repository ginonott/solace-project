"use client";

import { useEffect, useRef, useState } from "react";
import type { Advocate } from "../db/schema";

const useAdvocates = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const getAdvocates = async (search: string | null = null) => {
    const abortControlller = new AbortController();
    let route = "/api/advocates";

    if (search) {
      route = `${route}?search=${search}`;
    }

    try {
      const response = await fetch(route, {signal: abortControlller.signal});
      // TODO: handle an error body instead
      const advocates = await response.json() as {data: Advocate[]};
      setAdvocates(advocates.data);
    } catch (error) {
      // TODO: we need to handle this better - such as taking the user to an error page
      // and capturing this via sentry or newrelic
      console.error("failed to fetch advocates", {error});
      throw error;
    }
  }

  // on mount effect
  useEffect(() => {
    getAdvocates();
  }, []);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();

    getAdvocates(searchValue);
  }

  const resetSearch = () => {
    if (searchRef.current) {
      searchRef.current.value = "";
    }

    getAdvocates();
  }

  return {advocates, onSearch, resetSearch, searchRef };
}

export default function Home() {
  const {advocates, onSearch, resetSearch, searchRef} = useAdvocates();

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <label htmlFor="search">Search</label>
        <input
          name="search"
          style={{ border: "1px solid black" }}
          onChange={onSearch}
          type="text"
          role="searchbox"
          ref={searchRef}
        />
        <button onClick={resetSearch}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
