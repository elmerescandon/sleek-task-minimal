import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { useTaskActions } from './useTaskActions';
import { useTaskStorage } from './useTaskStorage';

export const useTasks = (isGuest: boolean) => {
    const [isLoading, setIsLoading] = useState(false);
    const { loadTasksFromStorage, loadTasksFromSupabase } = useTaskStorage(isGuest);
    const { tasks, isAddingTask, addTask, toggleTask, deleteTask, setTasksData } = useTaskActions(isGuest);

    // Load tasks on mount
    useEffect(() => {
        loadTasks();
    }, [isGuest]);

    const loadTasks = async () => {
        setIsLoading(true);

        if (isGuest) {
            const savedTasks = loadTasksFromStorage();
            setTasksData(savedTasks);
        } else {
            const supabaseTasks = await loadTasksFromSupabase();
            setTasksData(supabaseTasks);
        }

        setIsLoading(false);
    };

    return {
        tasks,
        isLoading,
        isAddingTask,
        addTask,
        toggleTask,
        deleteTask,
        loadTasks
    };
}; 