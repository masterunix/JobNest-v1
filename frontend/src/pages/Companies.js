import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Companies() {
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/users/companies');
        if (res.data?.success) {
          setCompanies(res.data.companies);
        } else {
          setError('Failed to load companies.');
        }
      } catch (err) {
        setError('Failed to load companies.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filtered = companies.filter(c =>
    (c.company?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.company?.industry || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Companies</h1>
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search companies or industries..."
          className="input w-full max-w-md px-4 py-2 border rounded-lg shadow-sm"
        />
      </div>
      {loading ? (
        <div className="text-center py-12 text-primary-600 text-lg animate-pulse">Loading companies...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">No companies found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((company, i) => (
            <div
              key={company._id || company.company?.name || i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition duration-500 hover:-translate-y-2 hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.08 + 0.1}s`, animationFillMode: 'both' }}
            >
              <div className="h-16 w-16 mb-4 rounded-full flex items-center justify-center text-3xl font-bold bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-200 shadow-inner select-none">
                {(company.company?.name?.[0] || '?').toUpperCase()}
              </div>
              <div className="font-semibold text-lg mb-1">{company.company?.name || 'Unknown Company'}</div>
              <div className="text-primary-600 dark:text-primary-300 text-sm mb-2">{company.company?.industry || 'Industry N/A'}</div>
              <div className="text-gray-500 dark:text-gray-300 text-xs">{company.company?.website && <a href={company.company.website} target="_blank" rel="noopener noreferrer" className="underline">{company.company.website}</a>}</div>
              <div className="text-gray-400 text-xs mt-2">Contact: {company.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 