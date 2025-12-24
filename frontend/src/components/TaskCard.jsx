import PropTypes from 'prop-types';
import { CheckCircle2, Circle, Calendar, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import Tag from './Tag';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
    const [showMenu, setShowMenu] = useState(false);

    const priorityColors = {
        low: 'green',
        medium: 'yellow',
        high: 'red',
    };

    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    return (
        <div className={`
      bg-white rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md
      ${task.completed ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:border-primary-300'}
      ${isOverdue ? 'border-red-200' : ''}
    `}>
            <div className="flex items-start gap-3">
                <button
                    onClick={() => onToggleComplete(task._id)}
                    className="flex-shrink-0 mt-0.5"
                >
                    {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary-600" />
                    ) : (
                        <Circle className="h-5 w-5 text-gray-400 hover:text-primary-600 transition-colors" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-gray-900 mb-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                    </h3>

                    {task.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {task.priority && (
                            <Tag color={priorityColors[task.priority]} size="sm">
                                {task.priority}
                            </Tag>
                        )}

                        {task.tags && task.tags.map((tag, index) => (
                            <Tag key={index} color="blue" size="sm">
                                {tag}
                            </Tag>
                        ))}

                        {task.dueDate && (
                            <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                                <Calendar className="h-3 w-3" />
                                {formatDate(task.dueDate)}
                            </span>
                        )}
                    </div>

                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
                                <button
                                    onClick={() => {
                                        onEdit(task);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(task._id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

TaskCard.propTypes = {
    task: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onToggleComplete: PropTypes.func.isRequired,
};

export default TaskCard;
