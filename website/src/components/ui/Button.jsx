import React from 'react';

// A simple functional component that mimics the Shadcn Button
// It passes through any classes and props, so it's very flexible.
export const Button = ({ asChild = false, className, ...props }) => {
  const Comp = asChild ? React.Fragment : 'button';
  return <Comp className={className} {...props} />;
};
