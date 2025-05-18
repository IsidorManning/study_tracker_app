import React from 'react';

const UnderlineLink = ({
  href,
  children,
  className = '',
}) => {
  const baseStyles = `
    relative inline-block
    after:content-['']
    after:absolute
    after:w-full
    after:h-[2px]
    after:bottom-0
    after:left-0
    after:bg-current
    after:origin-bottom-right
    after:scale-x-0
    after:transition-transform
    after:duration-300
    after:ease-out
    hover:after:origin-bottom-left
    hover:after:scale-x-100
  `;

  const Component = href ? 'a' : 'span';
  
  return (
    <Component
      href={href}
      className={`${baseStyles}  ${className}`}
    >
      {children}
    </Component>
  );
};

export default UnderlineLink; 