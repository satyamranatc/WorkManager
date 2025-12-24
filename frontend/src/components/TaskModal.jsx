import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import Modal from './Modal';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import Tag from './Tag';
import { tasksAPI } from '../services/api';

const TaskModal = ({ isOpen, onClose, task }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        tags: [],
    });
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                status: task.status || 'todo',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                tags: task.tags || [],
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                dueDate: '',
                tags: [],
            });
        }
    }, [task, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const taskData = {
                ...formData,
                dueDate: formData.dueDate || null,
            };

            if (task) {
                await tasksAPI.update(task._id, taskData);
            } else {
                await tasksAPI.create(taskData);
            }

            onClose(true);
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()],
            });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove),
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose(false)}
            title={task ? 'Edit Task' : 'Create New Task'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <Textarea
                    label="Description"
                    placeholder="Enter task description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Priority
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                <Input
                    label="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Add a tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            icon={Plus}
                            onClick={handleAddTag}
                        >
                            Add
                        </Button>
                    </div>

                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <Tag
                                    key={index}
                                    color="blue"
                                    onRemove={() => handleRemoveTag(tag)}
                                >
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onClose(false)}
                        fullWidth
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        fullWidth
                    >
                        {task ? 'Update Task' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

TaskModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    task: PropTypes.object,
};

export default TaskModal;
