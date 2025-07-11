import React from 'react';

const LoadingState: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Loading tasks...</p>
            </div>
        </div>
    );
};

export default LoadingState; 