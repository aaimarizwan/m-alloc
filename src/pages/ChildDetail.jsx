import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { childrenData } from '../utils/childrenData';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import './ChildDetail.css';

function ChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Small delay to ensure data is updated
    setTimeout(() => {
      const child = childrenData.getById(id);
      if (!child) {
        navigate('/children');
        return;
      }
      setProfile(child);
      setLoading(false);
    }, 100);
  }, [id, navigate, location]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    childrenData.delete(id);
    setShowDeleteModal(false);
    setShowToast(true);
    setTimeout(() => {
      navigate('/children');
    }, 1500);
  };

  const handleEdit = () => {
    navigate(`/edit-child/${id}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'books', label: 'Books' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'timetable', label: 'Timetable' },
  ];

  if (loading || !profile) {
    return (
      <div className="child-detail-page">
        <div className="child-detail-card">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading child profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="child-detail-page">
      {showToast && (
        <Toast 
          message="Child deleted successfully."
          onClose={() => setShowToast(false)}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Child"
          message={`Are you sure you want to delete ${profile?.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      <div className="child-detail-card">
        {/* Back Button */}
        <div className="child-detail-back-section">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-button"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Unified Header Section */}
        <div className="child-detail-header">
          <div className="child-detail-avatar-section">
            <div className="child-avatar-large">
              <span>{profile.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="child-detail-header-info">
              <h1 className="child-detail-title">{profile.name}</h1>
              <div className="child-detail-meta">
                <span className="child-meta-item">Grade: {profile.grade}</span>
                <span className="child-meta-divider">•</span>
                <span className="child-meta-item">Age: {profile.age}</span>
              </div>
              {profile.goals && profile.goals.length > 0 && (
                <div className="child-detail-goals-header">
                  {profile.goals.map((goal, index) => (
                    <span key={index} className="detail-goal-badge">{goal}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="child-detail-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`child-detail-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="child-detail-tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-panel">
              <div className="overview-section">
                <h2 className="overview-section-title">Profile Information</h2>
                <div className="child-detail-info-grid">
                  <div className="detail-info-card">
                    <div className="detail-info-label">Age</div>
                    <div className="detail-info-value">{profile.age}</div>
                  </div>
                  <div className="detail-info-card">
                    <div className="detail-info-label">Grade</div>
                    <div className="detail-info-value">{profile.grade}</div>
                  </div>
                </div>
              </div>

              <div className="detail-actions">
                <button 
                  onClick={() => navigate(`/edit-child/${id}`)} 
                  className="detail-edit-button"
                >
                  Edit Child Profile
                </button>
                <button 
                  onClick={handleDelete} 
                  className="detail-edit-button detail-delete-button"
                >
                  Delete Child
                </button>
              </div>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="tab-panel">
              {profile.curriculum ? (
                <div className="detail-section">
                  <h3 className="detail-section-title">Curriculum</h3>
                  <div className="detail-section-content">
                    <div className="detail-section-item">
                      <span className="detail-section-label">Name:</span>
                      <span className="detail-section-value">{profile.curriculum.name}</span>
                    </div>
                    <div className="detail-section-item">
                      <span className="detail-section-label">Description:</span>
                      <span className="detail-section-value">{profile.curriculum.description}</span>
                    </div>
                  </div>
                  <div className="detail-actions">
                    <button 
                      onClick={() => navigate('/curriculum')} 
                      className="detail-edit-button"
                    >
                      Edit Curriculum
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-tab-state">
                  <p>No curriculum selected</p>
                  <button 
                    onClick={() => navigate('/curriculum')} 
                    className="detail-edit-button"
                  >
                    Choose Curriculum
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Books Tab */}
          {activeTab === 'books' && (
            <div className="tab-panel">
              {profile.assignedBook ? (
                <div className="detail-section">
                  <h3 className="detail-section-title">Assigned Book</h3>
                  <div className="detail-section-content">
                    <div className="detail-section-item">
                      <span className="detail-section-label">Title:</span>
                      <span className="detail-section-value">{profile.assignedBook.title}</span>
                    </div>
                    <div className="detail-section-item">
                      <span className="detail-section-label">Publisher:</span>
                      <span className="detail-section-value">{profile.assignedBook.publisher}</span>
                    </div>
                  </div>
                  <div className="detail-actions">
                    <button 
                      onClick={() => navigate('/books')} 
                      className="detail-edit-button"
                    >
                      Browse Books
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-tab-state">
                  <p>No book assigned</p>
                  <button 
                    onClick={() => navigate('/books')} 
                    className="detail-edit-button"
                  >
                    Assign Book
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div className="tab-panel">
              {profile.subjects && profile.subjects.length > 0 ? (
                <div className="detail-section">
                  <h3 className="detail-section-title">Subjects</h3>
                  <div className="detail-section-content">
                    <div className="detail-subjects-list">
                      {profile.subjects.map((subject, index) => (
                        <div key={index} className="detail-subject-item">
                          <span className="detail-subject-name">{subject.subjectName}</span>
                          {subject.book && (
                            <span className="detail-subject-book">
                              {subject.book.title} ({subject.book.publisher})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="detail-actions">
                    <button 
                      onClick={() => navigate('/subjects')} 
                      className="detail-edit-button"
                    >
                      Manage Subjects
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-tab-state">
                  <p>No subjects added</p>
                  <button 
                    onClick={() => navigate('/subjects')} 
                    className="detail-edit-button"
                  >
                    Add Subjects
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Timetable Tab */}
          {activeTab === 'timetable' && (
            <div className="tab-panel">
              {profile.timetable && profile.timetable.length > 0 ? (
                <div className="detail-section">
                  <h3 className="detail-section-title">Timetable</h3>
                  <div className="detail-section-content">
                    <div className="detail-timetable-list">
                      {profile.timetable.map((lesson, index) => (
                        <div key={index} className="detail-timetable-item">
                          <span className="detail-lesson-subject">{lesson.subject}</span>
                          <span className="detail-lesson-time">{lesson.day} at {lesson.time}</span>
                          {lesson.note && (
                            <span className="detail-lesson-note">{lesson.note}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="detail-actions">
                    <button 
                      onClick={() => navigate('/timetable')} 
                      className="detail-edit-button"
                    >
                      Manage Timetable
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-tab-state">
                  <p>No lessons scheduled</p>
                  <button 
                    onClick={() => navigate('/timetable')} 
                    className="detail-edit-button"
                  >
                    Add Lessons
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChildDetail;
