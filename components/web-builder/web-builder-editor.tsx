/**
 * Web Builder Editor Component (Stub)
 * 
 * Placeholder for web builder functionality.
 * TODO: Implement full web builder with Craft.js or similar
 */

import React from 'react';

interface WebBuilderEditorProps {
  initialContent?: any;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

const WebBuilderEditor: React.FC<WebBuilderEditorProps> = ({ 
  initialContent, 
  onSave, 
  onCancel 
}) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-gray-500">Web Builder Editor - Coming Soon</p>
        <p className="text-sm text-gray-400 mt-2">
          Advanced page building functionality will be available here
        </p>
      </div>
    </div>
  );
};

export default WebBuilderEditor;
