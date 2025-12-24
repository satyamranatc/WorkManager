import { TrendingUp } from 'lucide-react';

const Progress = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Progress & Achievements</h1>
                <p className="text-gray-600 mt-1">Track your accomplishments and milestones</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Timeline Coming Soon</h3>
                <p className="text-gray-600">View your completed tasks, achievements, and progress over time.</p>
            </div>
        </div>
    );
};

export default Progress;
