import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const Tag = ({
    children,
    color = 'gray',
    size = 'md',
    onRemove,
    className = '',
}) => {
    const colors = {
        gray: 'bg-gray-100 text-gray-700 border-gray-200',
        blue: 'bg-blue-100 text-blue-700 border-blue-200',
        green: 'bg-green-100 text-green-700 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        red: 'bg-red-100 text-red-700 border-red-200',
        purple: 'bg-purple-100 text-purple-700 border-purple-200',
        pink: 'bg-pink-100 text-pink-700 border-pink-200',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${colors[color]} ${sizes[size]} ${className}`}>
            {children}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    );
};

Tag.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.oneOf(['gray', 'blue', 'green', 'yellow', 'red', 'purple', 'pink']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    onRemove: PropTypes.func,
    className: PropTypes.string,
};

export default Tag;
