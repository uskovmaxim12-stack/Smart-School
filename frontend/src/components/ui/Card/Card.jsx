import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, className, onClick, ...props }) => {
  return (
    <div className={`${styles.card} ${className || ''}`} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
