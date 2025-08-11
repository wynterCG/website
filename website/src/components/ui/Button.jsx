import React from 'react';
import { cloneElement } from 'react';

// This is a more robust version of the Button component that correctly
// handles the 'asChild' prop, which was causing the crash.
export const Button = ({ asChild = false, className, children, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    // If 'asChild' is true, we clone the child element (like an <a> tag)
    // and merge the button's props and className onto it.
    return cloneElement(children, {
      className: `${children.props.className || ''} ${className}`.trim(),
      ...props,
    });
  }

  // If 'asChild' is false, we render a normal button.
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
