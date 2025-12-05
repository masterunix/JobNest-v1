import React from 'react';
import { Github } from 'lucide-react';

const CopyrightBar = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-gray-400 text-xs py-1 z-50 border-t border-gray-800 flex justify-center items-center space-x-4">
            <span>Copyright by vatsal goyal 2025, under MIT licence.</span>
            <a
                href="https://github.com/masterunix/jobnest-v1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-white transition-colors"
            >
                <Github className="w-3 h-3 mr-1" />
                <span>github.com/masterunix/jobnest-v1</span>
            </a>
        </div>
    );
};

export default CopyrightBar;
