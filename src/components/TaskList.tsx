
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskListProps {
  userEmail: string;
  onLogout: () => void;
  isGuest?: boolean;
}

const TaskList = ({ userEmail, onLogout, isGuest = false }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load tasks on component mount
  useEffect(() => {
    if (isGuest) {
      // Load from localStorage for guest users
      const savedTasks = localStorage.getItem('guest_tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt)
          }));
          setTasks(parsedTasks);
        } catch (error) {
          console.error('Error parsing saved tasks:', error);
        }
      }
    } else {
      // Load from Supabase for authenticated users
      loadTasks();
    }
  }, [isGuest]);

  // Save to localStorage whenever tasks change (for guest users)
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem('guest_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isGuest]);

  const loadTasks = async () => {
    if (isGuest) return;
    
    setIsLoading(true);
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
      } else {
        const formattedTasks = data.map(task => ({
          id: task.id,
          text: task.text,
          completed: task.completed,
          createdAt: new Date(task.created_at)
        }));
        setTasks(formattedTasks);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date()
    };

    if (isGuest) {
      // Add to local state for guest users
      setTasks([newTask, ...tasks]);
    } else {
      // Add to Supabase for authenticated users
      try {
        const { error } = await supabase
          .from('tasks')
          .insert([{
            text: newTask.text,
            completed: newTask.completed
          }]);

        if (error) {
          toast({
            title: "Error adding task",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Reload tasks to get the correct ID from database
        await loadTasks();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add task",
          variant: "destructive",
        });
        return;
      }
    }
    
    setNewTaskText('');
    setIsAdding(false);
  };

  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    if (isGuest) {
      // Update local state for guest users
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
    } else {
      // Update in Supabase for authenticated users
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ completed: updatedTask.completed })
          .eq('id', id);

        if (error) {
          toast({
            title: "Error updating task",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        setTasks(tasks.map(task => 
          task.id === id ? updatedTask : task
        ));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
      }
    }
  };

  const deleteTask = async (id: string) => {
    if (isGuest) {
      // Remove from local state for guest users
      setTasks(tasks.filter(task => task.id !== id));
    } else {
      // Delete from Supabase for authenticated users
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
          return;
        }

        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
      }
    }
  };

  const cancelAdd = () => {
    setNewTaskText('');
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">
              {userEmail} {isGuest && '(Guest - not saved)'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isGuest ? 'Exit Guest Mode' : 'Sign out'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-12">
        {tasks.length === 0 && !isAdding ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-light text-gray-900 mb-2">No tasks yet</h2>
            <p className="text-gray-500 text-sm mb-8">Start by adding your first task</p>
            <Button
              onClick={() => setIsAdding(true)}
              className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              Add first task
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className={`flex-1 text-base ${
                      task.completed 
                        ? 'text-gray-400 line-through' 
                        : 'text-gray-900'
                    } transition-colors`}>
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {isAdding && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <Input
                  type="text"
                  placeholder="Enter task description"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="w-full mb-4 px-3 py-2 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addTask();
                    if (e.key === 'Escape') cancelAdd();
                  }}
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={cancelAdd}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addTask}
                    disabled={!newTaskText.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-all duration-200"
                  >
                    Add Task
                  </Button>
                </div>
              </div>
            )}

            {!isAdding && tasks.length > 0 && (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full mt-6 py-3 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add task</span>
              </span>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskList;
