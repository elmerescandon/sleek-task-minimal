import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Task } from '../types/task';

export const useTaskStorage = (isGuest: boolean) => {
    const { toast } = useToast();

    const loadTasksFromStorage = (): Task[] => {
        if (isGuest) {
            const savedTasks = localStorage.getItem('guest_tasks');
            if (savedTasks) {
                try {
                    return JSON.parse(savedTasks).map((task: any) => ({
                        ...task,
                        createdAt: new Date(task.createdAt)
                    }));
                } catch (error) {
                    console.error('Error parsing saved tasks:', error);
                }
            }
            return [];
        }
        return [];
    };

    const saveTasksToStorage = (tasks: Task[]) => {
        if (isGuest) {
            localStorage.setItem('guest_tasks', JSON.stringify(tasks));
        }
    };

    const loadTasksFromSupabase = async (): Promise<Task[]> => {
        if (isGuest) return [];

        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                toast({
                    title: "Error loading tasks",
                    description: error.message,
                    variant: "destructive",
                });
                return [];
            }

            return data.map(task => ({
                id: task.id,
                text: task.text,
                completed: task.completed,
                createdAt: new Date(task.created_at)
            }));
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load tasks",
                variant: "destructive",
            });
            return [];
        }
    };

    const addTaskToSupabase = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<string | null> => {
        if (isGuest) return null;

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Error",
                    description: "User not authenticated",
                    variant: "destructive",
                });
                return null;
            }

            const { data, error } = await supabase
                .from('tasks')
                .insert({
                    text: task.text,
                    completed: task.completed,
                    user_id: user.id
                })
                .select()
                .single();

            if (error) {
                toast({
                    title: "Error adding task",
                    description: error.message,
                    variant: "destructive",
                });
                return null;
            }

            return data.id;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add task",
                variant: "destructive",
            });
            return null;
        }
    };

    const updateTaskInSupabase = async (id: string, completed: boolean): Promise<boolean> => {
        if (isGuest) return true;

        try {
            const { error } = await supabase
                .from('tasks')
                .update({ completed })
                .eq('id', id);

            if (error) {
                toast({
                    title: "Error updating task",
                    description: error.message,
                    variant: "destructive",
                });
                return false;
            }

            return true;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task",
                variant: "destructive",
            });
            return false;
        }
    };

    const deleteTaskFromSupabase = async (id: string): Promise<boolean> => {
        if (isGuest) return true;

        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) {
                toast({
                    title: "Error deleting task",
                    description: error.message,
                    variant: "destructive",
                });
                return false;
            }

            return true;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete task",
                variant: "destructive",
            });
            return false;
        }
    };

    return {
        loadTasksFromStorage,
        saveTasksToStorage,
        loadTasksFromSupabase,
        addTaskToSupabase,
        updateTaskInSupabase,
        deleteTaskFromSupabase
    };
}; 