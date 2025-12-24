import { useEffect, useState } from 'react';
import { Plus, Trash2, Flame } from 'lucide-react';
import { habitsAPI } from '../services/api';
import Button from '../components/Button';
import HabitModal from '../components/HabitModal';

const Habits = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState(null);

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            setLoading(true);
            const response = await habitsAPI.getAll({ active: true });
            setHabits(response.data);
        } catch (error) {
            console.error('Error fetching habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHabit = () => {
        setSelectedHabit(null);
        setIsModalOpen(true);
    };

    const handleEditHabit = (habit) => {
        setSelectedHabit(habit);
        setIsModalOpen(true);
    };

    const handleDeleteHabit = async (habitId) => {
        if (window.confirm('Are you sure you want to delete this habit?')) {
            try {
                await habitsAPI.delete(habitId);
                fetchHabits();
            } catch (error) {
                console.error('Error deleting habit:', error);
            }
        }
    };

    const handleCheckIn = async (habitId) => {
        try {
            await habitsAPI.checkIn(habitId);
            fetchHabits();
        } catch (error) {
            console.error('Error checking in habit:', error);
            alert(error.response?.data?.message || 'Failed to check in habit');
        }
    };

    const handleModalClose = (shouldRefresh) => {
        setIsModalOpen(false);
        setSelectedHabit(null);
        if (shouldRefresh) {
            fetchHabits();
        }
    };

    const isCompletedToday = (habit) => {
        if (!habit.completionHistory) return false;
        const today = new Date().toISOString().split('T')[0];
        return habit.completionHistory.some(c => {
            const completionDate = new Date(c.date).toISOString().split('T')[0];
            return completionDate === today && c.completed;
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Habits</h1>
                    <p className="text-gray-600 mt-1">Build consistency and track your progress</p>
                </div>

                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={handleCreateHabit}
                >
                    New Habit
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : habits.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
                    <p className="text-gray-600 mb-6">Start building good habits today!</p>
                    <Button variant="primary" icon={Plus} onClick={handleCreateHabit}>
                        Create Your First Habit
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {habits.map((habit) => {
                        const completed = isCompletedToday(habit);

                        return (
                            <div
                                key={habit._id}
                                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                style={{ borderTopColor: habit.color, borderTopWidth: '4px' }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{habit.name}</h3>
                                        {habit.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{habit.description}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleDeleteHabit(habit._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Flame className="h-5 w-5 text-orange-500" />
                                            <span className="text-2xl font-bold text-gray-900">{habit.currentStreak}</span>
                                            <span className="text-sm text-gray-500">day streak</span>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Best</p>
                                            <p className="text-sm font-semibold text-gray-700">{habit.longestStreak} days</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant={completed ? 'success' : 'primary'}
                                        size="md"
                                        fullWidth
                                        onClick={() => !completed && handleCheckIn(habit._id)}
                                        disabled={completed}
                                    >
                                        {completed ? '✓ Completed Today' : 'Check In'}
                                    </Button>

                                    <div className="pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 capitalize">{habit.frequency}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <HabitModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                habit={selectedHabit}
            />
        </div>
    );
};

export default Habits;
