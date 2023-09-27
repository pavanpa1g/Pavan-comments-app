// TextInput.js
import React from 'react';
import './textinput.css'

const TextInput = ({ label, id, type, value, placeholder, onChange, required }) => {
  return (
    <div className='w-full'>
      <label htmlFor={id} className="label-text">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        placeholder={placeholder}
        className="input-field text-black"
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default TextInput;
