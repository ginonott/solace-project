"use client";

import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import type { Advocate } from "../db/schema";
import Header from "./_components/Header";
import Search from "./_components/Search";
import { Table, TBody, TD, TH, THead, TR } from "./_components/Table";

const ABORT_REASON = "refetching";

const useAdvocates = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const abortController = useRef<AbortController | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const getAdvocates = async (search: string | null = null) => {
    if (abortController.current) {
      abortController.current.abort(ABORT_REASON);
    }

    abortController.current = new AbortController();

    let route = "/api/advocates";

    if (search) {
      route = `${route}?search=${search}`;
    }

    try {
      const response = await fetch(route, {
        signal: abortController.current.signal,
      });
      // TODO: handle an error body instead
      const advocates = (await response.json()) as { data: Advocate[] };
      setAdvocates(advocates.data);
    } catch (error) {
      if (error === ABORT_REASON) {
        return;
      }

      // TODO: we need to handle this better - such as taking the user to an error page
      // and capturing this via sentry or newrelic
      console.error("failed to fetch advocates", { error });
      throw error;
    } finally {
      abortController.current = null;
    }
  };

  // on mount effect
  useEffect(() => {
    getAdvocates();

    return () => {
      // This prevents setting data on an unmounted component
      if (abortController.current) {
        abortController.current.abort(ABORT_REASON);
      }
    };
  }, []);

  const onSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();

    getAdvocates(searchValue);
  }, 200);

  const resetSearch = () => {
    if (searchRef.current) {
      searchRef.current.value = "";
    }

    getAdvocates();
  };

  return { advocates, onSearch, resetSearch, searchRef };
};

export default function Home() {
  const { advocates, onSearch, resetSearch, searchRef } = useAdvocates();

  return (
    <main>
      <Header text="solace advocates" />

      <div className="m-8">
        <Search
          inputRef={searchRef}
          onReset={resetSearch}
          onSearch={onSearch}
        />
        <Table>
          <THead>
            <TR>
              <TH>First Name</TH>
              <TH>Last Name</TH>
              <TH>City</TH>
              <TH>Degree</TH>
              <TH>Specialties</TH>
              <TH>Years of Experience</TH>
              <TH>Phone Number</TH>
            </TR>
          </THead>
          <TBody>
            {advocates.map((advocate) => {
              return (
                <TR key={advocate.id}>
                  <TD>{advocate.firstName}</TD>
                  <TD>{advocate.lastName}</TD>
                  <TD>{advocate.city}</TD>
                  <TD>{advocate.degree}</TD>
                  <TD>
                    {advocate.specialties.map((s) => (
                      // TODO: showing all of these are pretty unwieldly, we should collapse more than
                      // 2 or 3 into a tooltip or only show those relevant to the user
                      <div key={s}>{s}</div>
                    ))}
                  </TD>
                  <TD>{advocate.yearsOfExperience}</TD>
                  <TD>{advocate.phoneNumber}</TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>
    </main>
  );
}
