export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
}

export interface TaskListProps {
    userEmail: string;
    onLogout: () => void;
    isGuest?: boolean;
}

export interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export interface TaskFormProps {
    onAdd: (text: string) => void;
    onCancel: () => void;
    isAdding: boolean;
}

export interface TaskHeaderProps {
    userEmail: string;
    onLogout: () => void;
    isGuest: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
} 