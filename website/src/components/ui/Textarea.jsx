import React from 'react';

// Simple Textarea component
export const Textarea = ({ className, ...props }) => (
  <textarea className={className} {...props} />
);
