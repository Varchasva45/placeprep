import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GrPowerReset } from "react-icons/gr";
import Select from 'react-select';
import { Dialog } from '@headlessui/react';

const AllProblems: React.FC = () => {
  const [problems, setProblems] = useState<any>([]);
  const [showTags, setShowTags] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const optionTags: any = [
    'Array',
    'String',
    'Hash Table',
    'Linked List',
    'Math',
    'Two Pointers',
    'Binary Search',
    'Divide and Conquer',
    'Dynamic Programming',
    'Backtracking',
    'Stack',
    'Heap',
    'Greedy',
    'Sort',
    'Bit Manipulation',
    'Tree',
    'Depth-first Search',
    'Breadth-first Search',
    'Union Find',
    'Graph',
    'Design',
    'Topological Sort',
    'Trie',
    'Binary Indexed Tree',
    'Segment Tree',
    'Binary Search Tree',
    'Recursion',
    'Brainteaser',
    'Memoization',
    'Queue',
    'Minimax',
    'Reservoir Sampling',
    'Ordered Map',
    'Geometry',
    'Random',
    'Rejection Sampling',
    'Sliding Window',
    'Line Sweep',
    'Rolling Hash',
    'Suffix Array',
    'Geometry',
    'Random',
    'Rejection Sampling',
    'Sliding Window',
    'Line Sweep',
    'Rolling Hash',
    'Suffix Array',
    'Geometry',
    'Random',
    'Rejection Sampling',
    'Sliding Window',
    'Line Sweep',
    'Rolling Hash',
    'Suffix Array',
    'Geometry',
    'Random',
    'Rejection Sampling',
    'Sliding Window',
    'Line Sweep',
    'Rolling Hash',
    'Suffix Array',
    'Geometry',
    'Random',
    'Rejection Sampling',
    'Sliding Window',
    'Line Sweep',
    'Rolling Hash',
    'Suffix Array',
    'Geometry',
    'Random',
    'Rejection Sampling',
    'Sliding Window',
    'Line Sweep',
    'Rolling Hash',
    'Suffix Array',
    'Geometry',
    'Random',
    'Rejection Sampling',
    'Sliding Window',
    'Line Sweep',
    'Rolling Hash',
    'Suffix Array',
  ]
  const initialFilters = {
    title: '',
    difficulty: '',
    tags: []
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  

  const pageSize = 10; 

  interface Filters {
    title: string;
    difficulty: string;
    tags: string[];
  }
  
  const buildFilterQuery = (filters: Filters) => {
    // Define a more flexible type for filterQuery
    const filterQuery: { [key: string]: any } = {
      $and: [
        { isDeleted: false },
      ],
    };
  
    if (filters.title !== '') {
      filterQuery.$and.push({ title: { $regex: filters.title, $options: 'i' } });
    }
    if (filters.difficulty !== '') {
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
        const response = await axios.get(`http://localhost:3000/problem/api/problems?page=${page}&pageSize=${pageSize}&filter=${JSON.stringify(filterQuery)}`);
        setProblems(response.data.problems);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (error) {
        alert('Failed to fetch problems');
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
  const ProblemTitle: React.FC<ProblemTitleProps> = ( {title} ) => {
    const { shortTitle, isTruncated } = truncateTitle(title);
  
    return (
      <td
        className="py-2 px-4 text-left max-w-1"
        title={isTruncated ? title : ''}
      >
        {shortTitle}
      </td>
    );
  };

  const truncateTitle = (title: any, maxLength = 30) => {
    if (title.length > maxLength) {
      return {
        shortTitle: title.substring(0, maxLength) + '...',
        isTruncated: true
      };
    }
    return {
      shortTitle: title,
      isTruncated: false
    };
  };

  const handleReset = () => {
    setFilters(initialFilters);
  }

  useEffect(() => {
    if (problems.length === 0) {
      setCurrentPage(1);
    }
  }, [problems, setCurrentPage]);

  const handleTagsChange = (selectedTags: any) => {
    setFilters({ ...filters, tags: selectedTags });
  };

  const handleChange = (selectedOptions: any) => {
    const selectedTags = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    handleTagsChange(selectedTags);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-evenly items-center mb-4">
        <h1 className="text-3xl font-bold">All Problems</h1>
        <div className='flex flex-row gap-6 justify-end items-end'>
        <input
          size={50}
          type="text"
          name="title"
          placeholder="Search by title"
          value={filters.title}
          className="px-2 py-1 border border-gray-400 rounded"
          onChange={handleInputChange}
        />
        <select
          style={{ width: '250px' }}
          value={filters.difficulty}
          name="difficulty"
          className="px-2 py-1 border border-gray-400 rounded"
          onChange={handleInputChange}
        >
          <option value=''>Select difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-gray-800 text-white font-bold rounded"
      >
        Select Tags
      </button>
          {isModalOpen && (
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
                <div className="bg-white rounded p-6 z-20 w-96">
                  <Dialog.Title className="text-lg font-bold mb-4">Select Tags</Dialog.Title>
                  
                  <Select
                    isMulti // Customize width as needed
                    value={filters.tags.map(tag => ({ value: tag, label: tag }))}
                    name="tags"
                    options={optionTags.map((tag: any) => ({ value: tag, label: tag }))}
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
       
        <button className='flex flex-row gap-2 bg-gray-800 text-white font-bold py-2 px-4 rounded' onClick={handleReset}>
        <GrPowerReset fontSize="large"/>
        Reset
        </button>

        </div>
        <button
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded"
          onClick={toggleTags}
        >
          {showTags ? 'Hide Tags' : 'Show Tags'}
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-800">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 max-w-1 text-left">Question ID</th>
            <th className="py-2 px-4 max-w-1 text-left">Title</th>
            <th className="py-2 px-4 max-w-1 text-left">Difficulty</th>
            {showTags && <th className="py-2 px-4 max-w-1 text-left">Tags</th>}
            <th className="py-2 px-4 max-w-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-white">
          {problems.map((problem: any) => (
            <tr key={problem.question_id} className="border-t border-gray-300">
              <td className="py-2 px-4 text-left max-w-1">{problem.question_id}</td>
              <ProblemTitle title={problem.title} />
              <td className="py-2 px-4 text-left max-w-1">
                <span
                  className={`rounded px-2 font-bold ${
                    problem.difficulty === 'Easy'
                      ? 'text-blue-300'
                      : problem.difficulty === 'Medium'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </td>
              {showTags && (
                <td className="py-2 px-4 text-left max-w-1">
                  {problem.tags.length > 2 ? (
                    <>
                      {problem.tags.slice(0, 2).map((tag: string, index: number) => (
                        <span key={index} className="rounded-xl px-2 py-1 mr-1 bg-gray-300 text-gray-800 whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                      <span className="rounded-xl px-2 py-1 bg-gray-300 text-gray-800 whitespace-nowrap">+{problem.tags.length - 2}</span>
                    </>
                  ) : (
                    problem.tags.map((tag: string, index: number) => (
                      <span key={index} className="rounded-xl px-2 py-1 mr-1 bg-gray-300 text-gray-800 whitespace-nowrap">
                        {tag}
                      </span>
                    ))
                  )}
                </td>

              )}
              <td className="py-2 px-4 text-center max-w-1">
                <div className="inline-flex gap-2">
                  <button className="bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded-l w-20 text-white">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-700  font-bold py-2 px-4 rounded-r text-white">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          className={`bg-gray-800 text-white font-bold py-2 px-4 rounded ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-black">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`bg-gray-800 text-white font-bold py-2 px-4 rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {problems.length === 0 && <h1 className="text-center">No Data</h1>}
    </div>
  );
};

export default AllProblems;


