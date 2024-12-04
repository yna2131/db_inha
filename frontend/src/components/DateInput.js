import * as React from "react";

export function DateInput({ type, width }) {
  return (
    <div className={`date-input-wrapper ${width}-input`}>
      <label htmlFor={`${type}-input`} className="visually-hidden">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </label>
      <input
        type="text"
        id={`${type}-input`}
        className="date-input"
        placeholder={type.charAt(0).toUpperCase() + type.slice(1)}
        aria-label={type}
      />
    </div>
  );
}