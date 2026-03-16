import React from 'react';
import styles from './Input.module.css';

const Input = ({ label, error, icon, ...props }) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input className={`${styles.input} ${error ? styles.error : ''}`} {...props} />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
