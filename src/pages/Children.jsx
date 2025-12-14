import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { childrenData } from '../utils/childrenData';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import './Children.css';

function Children() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, childId: null, childName: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const allChildren = childrenData.getAll();
    setChildren(allChildren);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const handleAddChild = () => {
    navigate('/add-child');
  };

  const handleEditChild = (e, childId) => {
    e.stopPropagation();
    navigate(`/edit-child/${childId}`);
    setOpenMenuId(null);
  };

  const handleDeleteChild = (e, childId, childName) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, childId, childName });
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (deleteModal.childId) {
      childrenData.delete(deleteModal.childId);
      const updated = childrenData.getAll();
      setChildren(updated);
      setDeleteModal({ isOpen: false, childId: null, childName: '' });
      setToastMessage('Child deleted successfully.');
      setShowToast(true);
    }
  };

  // Filter and sort children
  const filteredAndSorted = children
    .filter(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'age':
          return a.age - b.age;
        case 'grade':
          return a.grade - b.grade;
        default:
          return 0;
      }
    });

  return (
    <div className="children-page">
      {showToast && (
        <Toast 
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
      {deleteModal.isOpen && (
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          title="Delete Child"
          message={`Are you sure you want to delete ${deleteModal.childName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ isOpen: false, childId: null, childName: '' })}
        />
      )}
      <div className="children-page-header">
        <h1 className="children-page-title">Children</h1>
        <button 
          onClick={handleAddChild} 
          className="children-add-button"
        >
          Add Child
        </button>
      </div>
      <div className="children-title-divider"></div>

      {/* Search and Sort Controls */}
      <div className="children-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="age">Age</option>
            <option value="grade">Grade</option>
          </select>
        </div>
      </div>
      
      {filteredAndSorted.length === 0 ? (
        <div className="children-empty-state">
          <p className="children-placeholder-text">
            {searchQuery ? 'No children found matching your search.' : 'No children added yet.'}
          </p>
          {!searchQuery && (
            <button 
              onClick={handleAddChild} 
              className="children-add-button"
            >
              Add Child
            </button>
          )}
        </div>
      ) : (
        <div className="children-grid">
          {filteredAndSorted.map((child) => (
            <div 
              key={child.id} 
              className="child-profile-card children-card"
            >
              <div className="child-card-menu">
                <button
                  className="child-card-menu-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === child.id ? null : child.id);
                  }}
                >
                  ⋮
                </button>
                {openMenuId === child.id && (
                  <div className="child-card-menu-dropdown show">
                    <button
                      onClick={(e) => handleEditChild(e, child.id)}
                      className="menu-item"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteChild(e, child.id, child.name)}
                      className="menu-item menu-item-danger"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Children;
