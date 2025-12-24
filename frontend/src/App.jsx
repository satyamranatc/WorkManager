import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import FocusMode from './pages/FocusMode';
import QuickCapture from './pages/QuickCapture';
import Workspaces from './pages/Workspaces';
import Habits from './pages/Habits';
import Progress from './pages/Progress';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="projects" element={<Projects />} />
          <Route path="focus" element={<FocusMode />} />
          <Route path="quick-capture" element={<QuickCapture />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="habits" element={<Habits />} />
          <Route path="progress" element={<Progress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;