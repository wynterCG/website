import React from 'react';

// Simple Card component
export const Card = ({ className, ...props }) => (
  <div className={className} {...props} />
);

// Simple CardContent component
export const CardContent = ({ className, ...props }) => (
  <div className={className} {...props} />
);
