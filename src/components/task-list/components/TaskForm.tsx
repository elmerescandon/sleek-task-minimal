import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskFormProps } from '../types/task';

const TaskForm: React.FC<TaskFormProps> = ({ onAdd, onCancel, isAdding }) => {
    const [newTaskText, setNewTaskText] = useState('');

    const handleAdd = () => {
        if (newTaskText.trim()) {
            onAdd(newTaskText);
            setNewTaskText('');
        }
    };

    const handleCancel = () => {
        setNewTaskText('');
        onCancel();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
        if (e.key === 'Escape') handleCancel();
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <Input
                type="text"
                placeholder="Enter task description"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="w-full mb-4 px-3 py-2 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyDown={handleKeyDown}
            />
            <div className="flex space-x-3">
                <Button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleAdd}
                    disabled={!newTaskText.trim() || isAdding}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-all duration-200"
                >
                    {isAdding ? 'Adding...' : 'Add Task'}
                </Button>
            </div>
        </div>
    );
};

export default TaskForm; 