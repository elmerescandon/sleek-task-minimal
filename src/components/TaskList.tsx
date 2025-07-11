
import TaskList from './task-list';

interface TaskListProps {
  userEmail: string;
  onLogout: () => void;
  isGuest?: boolean;
}

const TaskListComponent = ({ userEmail, onLogout, isGuest = false }: TaskListProps) => {
  return <TaskList userEmail={userEmail} onLogout={onLogout} isGuest={isGuest} />;
};

export default TaskListComponent;
