import React from 'react';
import { Search } from 'lucide-react';
import { TaskHeaderProps } from '../types/task';

const TaskHeader: React.FC<TaskHeaderProps> = ({ userEmail, onLogout, isGuest, searchTerm, onSearchChange }) => {
    return (
        <header className="bg-white border-b border-gray-100 px-8 py-6">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
                <div className="flex-1">
                    <h1 className="text-2xl font-light text-gray-900">Tasks</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {userEmail} {isGuest && '(Guest - not saved)'}
                    </p>
                </div>

                {/* Barra de búsqueda */}
                <div className="flex-1 max-w-md mx-4 relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    {isGuest ? 'Exit Guest Mode' : 'Sign out'}
                </button>
            </div>
        </header>
    );
};

export default TaskHeader; 