/**
 * Rich Text Editor Component (Stub)
 * TODO: Implement actual rich text editor (e.g., TipTap, Slate, etc.)
 */

import React from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  [key: string]: any;
}

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white">
      <p className="text-gray-600">Rich text editor placeholder</p>
    </div>
  );
};

export default RichTextEditor;
