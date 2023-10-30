import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  return (
    <header>
      <nav className="menu_list">
        <ul>
          <li>
            <Link
              to="/"
              className={activePage === '/' ? 'active' : ''}
              onClick={() => handlePageChange('/')}
            >
              Main
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className={activePage === '/tasks' ? 'active' : ''}
              onClick={() => handlePageChange('/tasks')}
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={activePage === '/about' ? 'active' : ''}
              onClick={() => handlePageChange('/about')}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={activePage === '/settings' ? 'active' : ''}
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
