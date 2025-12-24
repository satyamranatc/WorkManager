import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import { habitsAPI } from '../services/api';

const HabitModal = ({ isOpen, onClose, habit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        frequency: 'daily',
        color: '#10b981',
    });
    const [loading, setLoading] = useState(false);

    const colorOptions = [
        { value: '#10b981', label: 'Green' },
        { value: '#3b82f6', label: 'Blue' },
        { value: '#8b5cf6', label: 'Purple' },
        { value: '#f59e0b', label: 'Orange' },
        { value: '#ef4444', label: 'Red' },
        { value: '#ec4899', label: 'Pink' },
        { value: '#06b6d4', label: 'Cyan' },
        { value: '#6366f1', label: 'Indigo' },
    ];

    useEffect(() => {
        if (habit) {
            setFormData({
                name: habit.name || '',
                description: habit.description || '',
                frequency: habit.frequency || 'daily',
                color: habit.color || '#10b981',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                frequency: 'daily',
                color: '#10b981',
            });
        }
    }, [habit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (habit) {
                await habitsAPI.update(habit._id, formData);
            } else {
                await habitsAPI.create(formData);
            }

            onClose(true);
        } catch (error) {
            console.error('Error saving habit:', error);
            alert('Failed to save habit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose(false)}
            title={habit ? 'Edit Habit' : 'Create New Habit'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Habit Name"
                    placeholder="e.g., Morning Exercise, Read for 30 minutes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <Textarea
                    label="Description"
                    placeholder="Why is this habit important to you? (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Frequency
                    </label>
                    <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
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
                        {habit ? 'Update Habit' : 'Create Habit'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

HabitModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    habit: PropTypes.object,
};

export default HabitModal;
