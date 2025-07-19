import React from 'react';

const FormInput = ({
  type = 'text',
  name,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  options = [],
  minRows = 1,
  ...props
}) => {
  const baseInputClasses = "w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors";
  const baseLabelClasses = "block font-medium mb-1 text-gray-700";

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={minRows}
            className={`${baseInputClasses} min-h-[80px] resize-vertical ${className}`}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`${baseInputClasses} ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value || option} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`${baseInputClasses} ${className}`}
            {...props}
          />
        );
    }
  };

  return (
    <div>
      {label && (
        <label className={baseLabelClasses}>
          {label}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default FormInput; 