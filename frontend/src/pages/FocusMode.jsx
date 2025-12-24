import { Target } from 'lucide-react';

const FocusMode = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Focus Mode</h1>
                <p className="text-gray-600 mt-1">Deep work sessions with Pomodoro timer</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Focus Mode Coming Soon</h3>
                <p className="text-gray-600">Pomodoro timer and distraction-free work sessions will be available here.</p>
            </div>
        </div>
    );
};

export default FocusMode;
