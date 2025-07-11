import React from 'react';
import { X } from 'lucide-react';
import { TaskItemProps } from '../types/task';

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className={`flex-1 text-base ${task.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-900'
                        } transition-colors`}>
                        {task.text}
                    </span>
                </div>
                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TaskItem; 