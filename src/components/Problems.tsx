import {
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const Problems: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const problems = [
    { id: 1, name: "Problem 1" },
    { id: 2, name: "Probem 2" },
    { id: 3, name: "Prolem 3" },
    { id: 4, name: "Problem 4" },
    { id: 5, name: "Poblem 3" },
  ];

  const renderProblemCards = () => {
    const filteredProblems = problems.filter((problem) =>
      problem.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return filteredProblems.map((problem) => (
      <div
        key={problem.id}
        className="bg-gray-100 p-4 rounded-md shadow-md mb-4"
      >
        <div>{problem.name}</div>
      </div>
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-center font-bold text-2xl p-4">
        Top Coding Problems
      </div>

      {/* Search Bar and Filters */}
      <div className="filter w-8/12 flex items-center p-4">
        <div className="relative flex-1 mr-2" style={{ flex: "0 0 30%" }}>
          <input
            type="text"
            placeholder="Search for the problems or Keywords"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 pl-10 border rounded-md focus:border-gray-700 bg-gray-100 text-black w-full"
          />

          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
