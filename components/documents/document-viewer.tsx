/**
 * Document Viewer Component (Stub)
 * TODO: Implement actual document viewer (PDF, DOCX, etc.)
 */

import React from 'react';

interface DocumentViewerProps {
  url?: string;
  type?: string;
  [key: string]: any;
}

const DocumentViewer: React.FC<DocumentViewerProps> = (props) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <p className="text-gray-600">Document viewer placeholder</p>
    </div>
  );
};

export default DocumentViewer;
