import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JN</span>
              </div>
              <span className="text-xl font-bold">JobNest</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-6 max-w-md">
              Where startups and job seekers connect. Find your next opportunity or hire the perfect candidate.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
              <button className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                <Github className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Candidates</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link to="/salary-guide" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Salary Guide
                </Link>
              </li>
              <li>
                <Link to="/career-advice" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Companies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/recruiting-tools" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Recruiting Tools
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Feedback/Testimonies Link */}
        <div className="flex justify-center mt-8">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdpRTNkcubaqAYAQg0jhBFceO-degC_hDtMV04c7BqppsgNwg/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-300 hover:text-primary-100 underline transition-colors duration-200 opacity-80 hover:opacity-100"
            style={{ letterSpacing: '0.01em' }}
          >
            💬 Share Feedback & Testimony
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              © {new Date().getFullYear()} JobNest. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 