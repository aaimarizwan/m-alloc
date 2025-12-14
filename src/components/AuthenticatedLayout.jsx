import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../utils/auth';
import './AuthenticatedLayout.css';

function AuthenticatedLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/children', label: 'Children' },
    { path: '/settings', label: 'Settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="authenticated-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">m-alloc</h2>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  disabled={item.path === '/settings'}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="layout-main">
        <header className="navbar">
          <div className="navbar-left">
            <span className="navbar-logo">m-alloc</span>
          </div>
          <div className="navbar-right">
            <div className="profile-icon" title="Parent Profile">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z" fill="currentColor"/>
              </svg>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        <main className="layout-content">
          <div className="dashboard-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AuthenticatedLayout;

