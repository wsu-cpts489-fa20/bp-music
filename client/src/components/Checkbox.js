// All Checkbox was inherited from http://react.tips/checkboxes-in-react-16/
import React, { Component, PropTypes } from 'react';

const Checkbox = ({ label, isSelected, onCheckboxChange }) => (
  <div className="form-check">
    <label>
      <input
        id="checkbox"
        type="checkbox"
        name={label}
        checked={isSelected}
        onChange={onCheckboxChange}
        className="form-check-input"
      />
      {label}
    </label>
  </div>
);
export default Checkbox;
