import React from 'react';

// Simple Input component
export const Input = ({ className, ...props }) => (
  <input className={className} {...props} />
);
