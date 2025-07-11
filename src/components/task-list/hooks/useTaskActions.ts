import { useState } from 'react';
import { Task } from '../types/task';
import { useTaskStorage } from './useTaskStorage';

export const useTaskActions = (isGuest: boolean) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isAddingTask, setIsAddingTask] = useState(false);

    const {
        saveTasksToStorage,
        addTaskToSupabase,
        updateTaskInSupabase,
        deleteTaskFromSupabase
    } = useTaskStorage(isGuest);

    const addTask = async (text: string): Promise<boolean> => {
        if (!text.trim() || isAddingTask) return false;

        setIsAddingTask(true);

        const newTask: Task = {
            id: Date.now().toString(),
            text: text.trim(),
            completed: false,
            createdAt: new Date()
        };

        if (isGuest) {
            setTasks([newTask, ...tasks]);
            saveTasksToStorage([newTask, ...tasks]);
        } else {
            const supabaseId = await addTaskToSupabase({
                text: newTask.text,
                completed: newTask.completed
            });

            if (supabaseId) {
                const taskWithId = { ...newTask, id: supabaseId };
                setTasks([taskWithId, ...tasks]);
            } else {
                setIsAddingTask(false);
                return false;
            }
        }

        setIsAddingTask(false);
        return true;
    };

    const toggleTask = async (id: string): Promise<void> => {
        const taskToUpdate = tasks.find(task => task.id === id);
        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

        if (isGuest) {
            const updatedTasks = tasks.map(task =>
                task.id === id ? updatedTask : task
            );
            setTasks(updatedTasks);
            saveTasksToStorage(updatedTasks);
        } else {
            const success = await updateTaskInSupabase(id, updatedTask.completed);
            if (success) {
                setTasks(tasks.map(task =>
                    task.id === id ? updatedTask : task
                ));
            }
        }
    };

    const deleteTask = async (id: string): Promise<void> => {
        if (isGuest) {
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            saveTasksToStorage(updatedTasks);
        } else {
            const success = await deleteTaskFromSupabase(id);
            if (success) {
                setTasks(tasks.filter(task => task.id !== id));
            }
        }
    };

    const setTasksData = (newTasks: Task[]) => {
        setTasks(newTasks);
    };

    return {
        tasks,
        isAddingTask,
        addTask,
        toggleTask,
        deleteTask,
        setTasksData
    };
}; 