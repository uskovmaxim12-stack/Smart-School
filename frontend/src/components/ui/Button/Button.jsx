import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', ...props }) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
  ].filter(Boolean).join(' ');

  return (
    <button className={classNames} onClick={onClick} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  );
};

export default Button;
