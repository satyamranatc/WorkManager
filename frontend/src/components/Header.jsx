import PropTypes from 'prop-types';
import { Menu, Search, Plus, Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Header = ({ onMenuClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleQuickAdd = () => {
        // Navigate to tasks page which will trigger the task modal
        navigate('/tasks');
        // Dispatch a custom event to open the task modal
        window.dispatchEvent(new CustomEvent('openTaskModal'));
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks, projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-64 lg:w-96 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={handleQuickAdd}
                >
                    <span className="hidden sm:inline">Quick Add</span>
                    <span className="sm:hidden">Add</span>
                </Button>

                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow">
                    U
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    onMenuClick: PropTypes.func.isRequired,
};

export default Header;
