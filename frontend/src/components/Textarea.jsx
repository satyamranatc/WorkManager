import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Textarea = forwardRef(({
    label,
    error,
    placeholder,
    value,
    onChange,
    disabled = false,
    required = false,
    rows = 4,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                className={`
          w-full px-4 py-2.5 rounded-lg border transition-all duration-200 resize-none
          ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-offset-0
          placeholder:text-gray-400
        `}
                {...props}
            />

            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number,
    className: PropTypes.string,
};

export default Textarea;
