import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Tasks from './views/Tasks';
import About from './views/About';
import Settings from './views/Settings';
import Header from './components/Header/Header';


const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="mx-15p my-70px" >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
