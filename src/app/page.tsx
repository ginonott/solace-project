"use client";

import { useEffect, useState } from "react";
import type { Advocate } from '../db/schema';

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        // TODO: validate the server response with a library like zod or yup or etc
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    const includesInsensitive = (a: string) => {
      return a.toLowerCase().includes(searchTerm.toLowerCase());
    }


    // TODO: we should not be doing this in react - will fix in follow up PR
    const searchTermEl = document.getElementById("search-term");
    if (searchTermEl) {
      searchTermEl.innerHTML = searchTerm;
    }

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      // TODO: this should be filtered at the database level as this wouldn't scale with more than a few advocates
      return (
        includesInsensitive(advocate.firstName) ||
        includesInsensitive(advocate.lastName) ||
        includesInsensitive(advocate.city) ||
        includesInsensitive(advocate.degree) ||
        advocate.specialties.map(s => s.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        advocate.yearsOfExperience.toString().includes(searchTerm) ||
        advocate.phoneNumber.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <label htmlFor="search">Search</label>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input name="search" style={{ border: "1px solid black" }} onChange={onChange} type="text" role="searchbox"/>
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
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
