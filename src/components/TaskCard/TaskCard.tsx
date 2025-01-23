import React, { useState } from 'react';
import { Task } from '../../types/kanban';
import { Edit2, Save } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
  onUpdateTask: (updatedTask: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onDragStart, 
  onUpdateTask 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);

  const priorityColors = {
    low: 'bg-green-100',
    medium: 'bg-yellow-100',
    high: 'bg-red-100',
  };

  const handleSave = () => {
    onUpdateTask(editedTask);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded shadow">
        <input
          value={editedTask.title}
          onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
          className="w-full mb-2 p-1 border rounded"
          placeholder="Task Title"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
          className="w-full mb-2 p-1 border rounded"
          placeholder="Task Description"
        />
        <select
          value={editedTask.priority}
          onChange={(e) => setEditedTask({
            ...editedTask, 
            priority: e.target.value as Task['priority']
          })}
          className="w-full mb-2 p-1 border rounded"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <div className="flex justify-between">
          <button 
            onClick={handleSave}
            className="bg-blue-500 text-white px-2 py-1 rounded flex items-center"
          >
            <Save className="mr-2 w-4 h-4" /> Save
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`${priorityColors[task.priority]} p-3 rounded shadow cursor-move relative`}
      tabIndex={0}
      role="article"
    >
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        aria-label="Edit task"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <h4 className="font-medium">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
        <span className={`text-xs capitalize px-2 py-1 rounded ${
          task.priority === 'high' ? 'bg-red-200' : 
          task.priority === 'medium' ? 'bg-yellow-200' : 
          'bg-green-200'
        }`}>
          {task.priority} Priority
        </span>
      </div>
    </div>
  );
};
