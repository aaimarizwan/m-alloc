import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { childrenData } from '../utils/childrenData';
import './Dashboard.css';

function Dashboard() {
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Refresh children list whenever location changes
  useEffect(() => {
    const allChildren = childrenData.getAll();
    setChildren(allChildren);
  }, [location]);

  const handleViewProfile = (childId) => {
    navigate(`/child/${childId}`);
  };

  if (children.length === 0) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-title-wrapper">
          <h1 className="dashboard-page-title">Dashboard</h1>
          <div className="dashboard-title-divider"></div>
        </div>
        <div className="dashboard-empty-state">
          <p className="empty-message">No children added yet</p>
          <button 
            onClick={() => navigate('/children')} 
            className="dashboard-primary-button"
          >
            Go to Children
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-title-wrapper">
        <h1 className="dashboard-page-title">Dashboard</h1>
        <div className="dashboard-title-divider"></div>
      </div>
      
      <div className="dashboard-children-grid">
        {children.map((child) => (
          <div 
            key={child.id}
            className="child-profile-card" 
            onClick={() => handleViewProfile(child.id)}
          >
            {/* Header Section */}
            <div className="child-card-header">
              <div className="child-avatar">
                <span>{child.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="child-card-info">
                <h2 className="child-card-name">{child.name}</h2>
                <div className="child-card-meta">
                  <span className="child-meta-item">Age: {child.age}</span>
                  <span className="child-meta-divider">•</span>
                  <span className="child-meta-item">Grade: {child.grade}</span>
                </div>
              </div>
            </div>

            {/* Progress Preview Section */}
            <div className="child-card-progress">
              <div className="progress-stats">
                <div className="progress-stat-item">
                  <div className="progress-stat-label">Weekly Progress</div>
                  <div className="progress-stat-value">75%</div>
                </div>
                <div className="progress-stat-item">
                  <div className="progress-stat-label">Lessons Completed</div>
                  <div className="progress-stat-value">4 this week</div>
                </div>
              </div>
              {child.goals && child.goals.length > 0 && (
                <div className="child-goals-section">
                  <div className="child-goals-list">
                    {child.goals.map((goal, index) => (
                      <span key={index} className="child-goal-badge">{goal}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile(child.id);
              }} 
              className="child-view-profile-button"
            >
              View Child Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
