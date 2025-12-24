import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import { projectsAPI } from '../services/api';

const ProjectModal = ({ isOpen, onClose, project }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'planning',
        color: '#6366f1',
    });
    const [loading, setLoading] = useState(false);

    const colorOptions = [
        { value: '#6366f1', label: 'Indigo' },
        { value: '#8b5cf6', label: 'Purple' },
        { value: '#ec4899', label: 'Pink' },
        { value: '#ef4444', label: 'Red' },
        { value: '#f59e0b', label: 'Orange' },
        { value: '#10b981', label: 'Green' },
        { value: '#3b82f6', label: 'Blue' },
        { value: '#06b6d4', label: 'Cyan' },
    ];

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                status: project.status || 'planning',
                color: project.color || '#6366f1',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                status: 'planning',
                color: '#6366f1',
            });
        }
    }, [project, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (project) {
                await projectsAPI.update(project._id, formData);
            } else {
                await projectsAPI.create(formData);
            }

            onClose(true);
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose(false)}
            title={project ? 'Edit Project' : 'Create New Project'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Project Name"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <Textarea
                    label="Description"
                    placeholder="Enter project description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Status
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Color
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                        {colorOptions.map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, color: color.value })}
                                className={`
                  h-12 rounded-lg border-2 transition-all
                  ${formData.color === color.value
                                        ? 'border-gray-900 scale-105'
                                        : 'border-gray-200 hover:border-gray-400'
                                    }
                `}
                                style={{ backgroundColor: color.value }}
                                title={color.label}
                            />
                        ))}
                    </div>
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
                        {project ? 'Update Project' : 'Create Project'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

ProjectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    project: PropTypes.object,
};

export default ProjectModal;
