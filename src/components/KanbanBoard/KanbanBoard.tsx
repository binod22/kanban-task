import React, { useState } from 'react';
import { Column as ColumnComponent } from '../Column/Column';
import { SearchBar } from '../SearchBar/SearchBar';
import { Controls } from '../Controls/Controls';
import { useHistory } from '../../hooks/useHistory';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Column, DragItem, Task } from '../../types/kanban';
import { Plus } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useLocalStorage<Column[]>('kanbanColumns', [
    { id: '1', title: 'To Do', tasks: [] },
    { id: '2', title: 'In Progress', tasks: [] },
    { id: '3', title: 'Done', tasks: [] }
  ]);
  const { state, push, undo, redo, canUndo, canRedo } = useHistory(columns);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  const addNewTask = (columnId: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Click to edit task details',
      createdAt: new Date(),
      priority,
    };

    const updatedColumns = columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    );

    setColumns(updatedColumns);
    push(updatedColumns);
  };

  const handleUpdateTask = (columnId: string, updatedTask: Task) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId 
        ? { 
            ...col, 
            tasks: col.tasks.map(task => 
              task.id === updatedTask.id ? updatedTask : task
            ) 
          }
        : col
    );

    setColumns(updatedColumns);
    push(updatedColumns);
  };

  const handleUpdateColumn = (updatedColumn: Column) => {
    const updatedColumns = columns.map(col => 
      col.id === updatedColumn.id ? updatedColumn : col
    );

    setColumns(updatedColumns);
    push(updatedColumns);
  };

  const addNewColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      title: 'New Column',
      tasks: [],
    };

    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    push(updatedColumns);
  };

  const deleteColumn = (columnId: string) => {
    const updatedColumns = columns.filter(col => col.id !== columnId);
    setColumns(updatedColumns);
    push(updatedColumns);
  };

  const handleDragStart = (columnId: string, taskId: string) => {
    setDraggedItem({ columnId, taskId });
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'; 
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = '';
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = '';
    }

    if (!draggedItem) return;

    const updatedColumns = columns.map(col => ({...col, tasks: [...col.tasks]}));
    
    const sourceColumn = updatedColumns.find(col => col.id === draggedItem.columnId);
    const targetColumn = updatedColumns.find(col => col.id === targetColumnId);

    if (!sourceColumn || !targetColumn) return;

    const taskIndex = sourceColumn.tasks.findIndex(task => task.id === draggedItem.taskId);
    const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
    targetColumn.tasks.push(movedTask);

    setColumns(updatedColumns);
    push(updatedColumns);
    setDraggedItem(null);
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-4 flex items-center justify-between">
        <Controls
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {filteredColumns.map(column => (
          <ColumnComponent 
            key={column.id}
            column={column}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragLeave={handleDragLeave}
            onAddTask={(priority) => addNewTask(column.id, priority)}
            onDeleteColumn={() => deleteColumn(column.id)}
            onTaskDragStart={(taskId) => handleDragStart(column.id, taskId)}
            onUpdateColumn={handleUpdateColumn}
            onUpdateTask={handleUpdateTask}
          />
        ))}
        
        <button
          onClick={addNewColumn}
          className="flex-shrink-0 w-72 h-full min-h-[200px] bg-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300"
        >
          <Plus className="w-6 h-6" /> 
          Add Column
        </button>
      </div>
    </div>
  );
};