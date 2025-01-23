import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';

interface ControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onUndo}
      disabled={!canUndo}
      className="p-2 bg-white rounded-lg shadow disabled:opacity-50"
      aria-label="Undo"
    >
      <RotateCcw className="w-5 h-5" />
    </button>
    <button
      onClick={onRedo}
      disabled={!canRedo}
      className="p-2 bg-white rounded-lg shadow disabled:opacity-50"
      aria-label="Redo"
    >
      <RotateCw className="w-5 h-5" />
    </button>
  </div>
);