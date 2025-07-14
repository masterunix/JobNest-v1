import React from 'react';
export default function SalaryGuide() {
  return <div className="max-w-2xl mx-auto py-20 text-center">
    <h1 className="text-3xl font-bold mb-4">Salary Guide</h1>
    <p className="text-gray-600 mb-4">Understanding salary trends is crucial for both job seekers and employers. Our salary guide provides up-to-date information on compensation for top roles in tech and business, helping you make informed decisions whether you're negotiating a new offer or planning your next hire.</p>
    <p className="text-gray-600 mb-4">Salaries can vary based on experience, location, and company size. Use this guide as a starting point, and always consider your unique skills and market demand.</p>
    <table className="mx-auto my-8 w-full max-w-md text-left border rounded-lg overflow-hidden">
      <thead className="bg-primary-100 dark:bg-primary-900">
        <tr>
          <th className="py-2 px-4">Role</th>
          <th className="py-2 px-4">Avg. Salary (USD)</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800">
        <tr><td className="py-2 px-4">Software Engineer</td><td className="py-2 px-4">$110,000</td></tr>
        <tr><td className="py-2 px-4">Product Manager</td><td className="py-2 px-4">$120,000</td></tr>
        <tr><td className="py-2 px-4">Data Scientist</td><td className="py-2 px-4">$115,000</td></tr>
        <tr><td className="py-2 px-4">Designer</td><td className="py-2 px-4">$90,000</td></tr>
        <tr><td className="py-2 px-4">Marketing Manager</td><td className="py-2 px-4">$95,000</td></tr>
      </tbody>
    </table>
    <p className="text-gray-500 text-sm">*Data based on US averages. For more detailed insights, check out our upcoming salary reports.</p>
  </div>;
} 