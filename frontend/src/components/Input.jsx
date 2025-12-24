import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    type = 'text',
    placeholder,
    value,
    onChange,
    disabled = false,
    required = false,
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

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="h-5 w-5" />
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            ${Icon ? 'pl-11' : ''}
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
            </div>

            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    icon: PropTypes.elementType,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
};

export default Input;
