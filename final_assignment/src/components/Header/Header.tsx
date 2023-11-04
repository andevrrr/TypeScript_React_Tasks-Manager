import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  return (
    <header className="bg-gray-800 text-white p-4 text-center">
      <nav className="menu_list">
        <ul className="flex justify-center p-0 list-none">
          <li className="mx-2">
            <Link
              to="/"
              className={`font-mono font-bold text-lg ${activePage === '/' ? 'text-blue-400' : 'text-white'} hover:text-blue-400`}
              onClick={() => handlePageChange('/')}
            >
              Main
            </Link>
          </li>
          <li className="mx-2">
            <Link
              to="/tasks"
              className={`font-mono font-bold text-lg ${activePage === '/tasks' ? 'text-blue-400' : 'text-white'} hover:text-blue-400`}
              onClick={() => handlePageChange('/tasks')}
            >
              Tasks
            </Link>
          </li>
          <li className="mx-2">
            <Link
              to="/about"
              className={`font-mono font-bold text-lg ${activePage === '/about' ? 'text-blue-400' : 'text-white'} hover:text-blue-400`}
              onClick={() => handlePageChange('/about')}
            >
              About
            </Link>
          </li>
          <li className="mx-2">
            <Link
              to="/settings"
              className={`font-mono font-bold text-lg ${activePage === '/settings' ? 'text-blue-400' : 'text-white'} hover:text-blue-400`}
              onClick={() => handlePageChange('/settings')}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
