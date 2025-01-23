export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface DragItem {
  columnId: string;
  taskId: string;
}