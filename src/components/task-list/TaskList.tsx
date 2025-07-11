import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskListProps } from './types/task';
import { useTasks } from './hooks/useTasks';
import TaskHeader from './components/TaskHeader';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';

const TaskList: React.FC<TaskListProps> = ({ userEmail, onLogout, isGuest = false }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { tasks, isLoading, isAddingTask, addTask, toggleTask, deleteTask } = useTasks(isGuest);

    // Filtrar tareas basado en el término de búsqueda
    const filteredTasks = useMemo(() => {
        if (!searchTerm.trim()) return tasks;

        return tasks.filter(task =>
            task.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tasks, searchTerm]);

    const handleAddTask = async (text: string) => {
        const success = await addTask(text);
        if (success) {
            setIsAdding(false);
        }
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TaskHeader
                userEmail={userEmail}
                onLogout={onLogout}
                isGuest={isGuest}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <main className="max-w-2xl mx-auto px-8 py-12">
                {filteredTasks.length === 0 && !isAdding ? (
                    <EmptyState
                        onAddFirst={() => setIsAdding(true)}
                        isAddingTask={isAddingTask}
                        isSearching={searchTerm.trim().length > 0}
                    />
                ) : (
                    <div className="space-y-3">
                        {filteredTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                            />
                        ))}

                        {isAdding && (
                            <TaskForm
                                onAdd={handleAddTask}
                                onCancel={handleCancelAdd}
                                isAdding={isAddingTask}
                            />
                        )}

                        {!isAdding && filteredTasks.length > 0 && (
                            <button
                                onClick={() => setIsAdding(true)}
                                disabled={isAddingTask}
                                className="w-full mt-6 py-3 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add task</span>
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TaskList; 