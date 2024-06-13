import React, { useState, useEffect } from "react";
import "./Dropdown.css";
const Dropdown = ({ options, defaultVal, disabled = false, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultVal);

  useEffect(() => {
    setSelected(defaultVal);
  }, [defaultVal]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setSelected(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className="dropdown">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle"
        disabled={disabled}
        type="button"
      >
        {selected}
        <span className="chevron-down"></span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => selectOption(option)}
              className={selected === option ? "active" : ""}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
