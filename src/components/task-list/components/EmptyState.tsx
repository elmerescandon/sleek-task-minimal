import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    onAddFirst: () => void;
    isAddingTask: boolean;
    isSearching?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddFirst, isAddingTask, isSearching = false }) => {
    if (isSearching) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h2 className="text-xl font-light text-gray-900 mb-2">No tasks found</h2>
                <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
            </div>
        );
    }

    return (
        <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-light text-gray-900 mb-2">No tasks yet</h2>
            <p className="text-gray-500 text-sm mb-8">Start by adding your first task</p>
            <Button
                onClick={onAddFirst}
                disabled={isAddingTask}
                className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
            >
                Add first task
            </Button>
        </div>
    );
};

export default EmptyState; 