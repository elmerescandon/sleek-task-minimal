
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskListProps {
  userEmail: string;
  onLogout: () => void;
}

const TaskList = ({ userEmail, onLogout }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const cancelAdd = () => {
    setNewTaskText('');
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">{userEmail}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign out
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
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskList;
