import React, { useEffect, useState } from "react";
import axios from "axios";
import { GrPowerReset } from "react-icons/gr";
import { CgFileDocument } from "react-icons/cg";
import Select from "react-select";
import { Dialog } from "@headlessui/react";
import { optionTags } from "../constants/problemTags";
import { Link } from "react-router-dom";

const AllProblems: React.FC = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [showTags, setShowTags] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFilters = {
    title: "",
    difficulty: "",
    tags: [],
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const pageSize = 10;

  interface Filters {
    title: string;
    difficulty: string;
    tags: string[];
  }

  const buildFilterQuery = (filters: Filters) => {
    const filterQuery: { [key: string]: any } = {
      $and: [{ isDeleted: false }],
    };

    if (filters.title !== "") {
      filterQuery.$and.push({
        title: { $regex: filters.title, $options: "i" },
      });
    }
    if (filters.difficulty !== "") {
      filterQuery.$and.push({ difficulty: filters.difficulty });
    }
    if (filters.tags.length > 0) {
      filterQuery.$and.push({ tags: { $all: filters.tags } });
    }

    return filterQuery;
  };

  useEffect(() => {
    const fetchProblems = async (page: number) => {
      try {
        const filterQuery = buildFilterQuery(filters);
        const response = await axios.get(
          `http://localhost:3000/problem/api/problems?page=${page}&pageSize=${pageSize}&filter=${JSON.stringify(filterQuery)}`,
        );
        setProblems(response.data.problems);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (error) {
        alert("Failed to fetch problems");
      }
    };
    fetchProblems(currentPage);
  }, [currentPage, filters]);

  const toggleTags = () => {
    setShowTags(!showTags);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  interface ProblemTitleProps {
    title: any;
  }

  const ProblemTitle: React.FC<ProblemTitleProps> = ({ title }) => {
    const { shortTitle, isTruncated } = truncateTitle(title);

    return (
      <td
        className="py-2 px-4 text-left max-w-1 w-1/4 truncate"
        title={isTruncated ? title : ""}
      >
        {shortTitle}
      </td>
    );
  };

  const truncateTitle = (title: any, maxLength = 200) => {
    if (title.length > maxLength) {
      return {
        shortTitle: title.substring(0, maxLength) + "...",
        isTruncated: true,
      };
    }
    return {
      shortTitle: title,
      isTruncated: false,
    };
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    if (problems.length === 0) {
      setCurrentPage(1);
    }
  }, [problems, setCurrentPage]);

  const handleTagsChange = (selectedTags: any) => {
    setFilters({ ...filters, tags: selectedTags });
  };

  const handleChange = (selectedOptions: any) => {
    const selectedTags = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    handleTagsChange(selectedTags);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-row gap-4 items-center">
          <input
            size={40}
            type="text"
            name="title"
            placeholder="Search by title"
            value={filters.title}
            className="px-2 py-1 rounded bg-slate-900 border hover:border-gray-400"
            onChange={handleInputChange}
          />
          <select
            style={{ width: "250px" }}
            value={filters.difficulty}
            name="difficulty"
            className="px-2 py-1 border bg-slate-900 hover:border-gray-400"
            onChange={handleInputChange}
          >
            <option value="">Select difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded"
            >
              Select Tags
            </button>
            {isModalOpen && (
              <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="fixed z-10 inset-0 overflow-y-auto"
              >
                <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
                  <div className="bg-white rounded p-6 z-20 w-96">
                    <Dialog.Title className="text-lg font-bold mb-4">
                      Select Tags
                    </Dialog.Title>

                    <Select
                      isMulti
                      value={filters.tags.map((tag) => ({
                        value: tag,
                        label: tag,
                      }))}
                      name="tags"
                      options={optionTags.map((tag: string) => ({
                        value: tag,
                        label: tag,
                      }))}
                      className="px-2 py-1 border border-gray-400 rounded w-full"
                      onChange={handleChange}
                    />

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-800 text-white rounded"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog>
            )}
          </div>

          <button
            className="flex flex-row gap-2 bg-slate-900 hover:bg-slate-800 py-2 px-4 rounded"
            onClick={handleReset}
          >
            <GrPowerReset fontSize="large" />
            Reset
          </button>
          <button
            className="bg-slate-900 hover:bg-slate-800 py-2 px-4 rounded"
            onClick={toggleTags}
          >
            {showTags ? "Hide Tags" : "Show Tags"}
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div>
          <table className="w-full ">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="py-2 px-4 max-w-1 text-left text-gray-400">
                  Question ID
                </th>
                <th className="py-2 px-4 max-w-1 text-left text-gray-400">
                  Title
                </th>
                <th className="py-2 px-4 max-w-1 text-left text-gray-400">
                  Difficulty
                </th>
                <th className="py-2 px-4 max-w-1 text-left text-gray-400">
                  Acceptance
                </th>
                <th className="py-2 px-4 max-w-1 text-left text-gray-400">
                  Actions
                </th>
                <th className="py-2 px-4 max-w-1 text-left text-gray-400">
                  Actions
                </th>
                {showTags && (
                  <th className="py-2 px-4 max-w-1 text-left text-gray-400">
                    Tags
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-gray-800 text-white">
              {problems.map((problem: any, index: number) => (
                <tr
                  key={problem.question_id}
                  className={` ${index % 2 === 0 ? "bg-slate-900" : "bg-slate-950"} h-16`}
                >
                  <td className="py-2 px-4 text-left max-w-1">
                    {problem.question_id}
                  </td>
                  <ProblemTitle title={problem.title} />
                  <td className="py-2 px-4 text-left max-w-1">
                    <span
                      className={`rounded px-2 ${
                        problem.difficulty === "Easy"
                          ? "text-blue-300"
                          : problem.difficulty === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-left max-w-1">
                    <div className="text-white">61.1%</div>
                  </td>
                  {showTags && (
                    <td className="py-2 px-4 text-left max-w-1 w-1/4">
                      <div className="flex flex-row">
                        {problem.tags.length > 2 ? (
                          <>
                            {problem.tags
                              .slice(0, 2)
                              .map((tag: any, index: number) => (
                                <span
                                  key={index}
                                  className="bg-gray-600 text-white px-2 py-1 rounded-full inline-block mr-2 mb-1"
                                >
                                  {tag}
                                </span>
                              ))}
                            <span className="bg-gray-600 text-white px-2 py-1 rounded-full inline-block mr-2 mb-1">
                              +{problem.tags.length - 2}
                            </span>
                          </>
                        ) : (
                          problem.tags.map((tag: any, index: number) => (
                            <span
                              key={index}
                              className="bg-gray-600 text-white px-2 py-1 rounded-full inline-block mr-2 mb-1"
                            >
                              {tag}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  )}
                  <td className="py-2 px-4 text-left max-w-1">
                    <Link to={`/problems/${problem._id}`}>
                      <div className="text-green-400">Solve</div>
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-left max-w-1">
                    <CgFileDocument size="23" color="magenta" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 ${
                currentPage === 1
                  ? "bg-slate-900 text-gray-300 cursor-not-allowed"
                  : "bg-gray-800 text-white"
              } rounded`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="text-white">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 ${
                currentPage === totalPages
                  ? "bg-slate-900 text-gray-300 cursor-not-allowed"
                  : "bg-gray-800 text-white"
              } rounded`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProblems;
