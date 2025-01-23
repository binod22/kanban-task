import React, { useState } from 'react';
import { Column as ColumnType, Task } from '../../types/kanban';
import { TaskCard } from '../TaskCard/TaskCard';
import { X, Edit2, Save } from 'lucide-react'; 

interface ColumnProps {
  column: ColumnType;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDeleteColumn: () => void;
  onAddTask: (priority: Task['priority']) => void;
  onTaskDragStart: (taskId: string) => void;
  onUpdateColumn: (updatedColumn: ColumnType) => void;
  onUpdateTask: (columnId: string, updatedTask: Task) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onDragOver,
  onDrop,
  onDragLeave,
  onDeleteColumn,
  onAddTask,
  onTaskDragStart,
  onUpdateColumn,
  onUpdateTask,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleSaveTitle = () => {
    onUpdateColumn({ ...column, title: editedTitle });
    setIsEditingTitle(false);
  };

  return (
    <div
      className="flex-shrink-0 w-72 bg-gray-200 rounded-lg p-4"
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <div className="flex justify-between items-center mb-4">
        {isEditingTitle ? (
          <div className="flex items-center w-full">
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-grow p-1 rounded mr-2"
            />
            <button 
              onClick={handleSaveTitle}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center w-full">
            <h3 className="font-semibold text-lg flex-grow">{column.title}</h3>
            <button 
              onClick={() => setIsEditingTitle(true)}
              className="text-gray-600 hover:text-gray-800 mr-2"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDeleteColumn}
              className="p-1 hover:bg-gray-300 rounded"
              aria-label="Delete column"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={() => onTaskDragStart(task.id)}
            onUpdateTask={(updatedTask) => onUpdateTask(column.id, updatedTask)}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['low', 'medium', 'high'] as Task['priority'][]).map((priority) => (
          <button
            key={priority}
            onClick={() => onAddTask(priority)}
            className={`py-2 rounded text-xs uppercase 
              ${priority === 'low' ? 'bg-green-500' : 
                priority === 'medium' ? 'bg-yellow-500' : 
                'bg-red-500'} 
              text-white hover:opacity-90`}
          >
            Add {priority} Task 
          </button> 
        ))} 
      </div> 
    </div> 
  ); 
};