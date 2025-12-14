import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { childProfile } from '../utils/childProfile';
import './Subjects.css';

function Subjects() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: '',
    book: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedProfile = childProfile.get();
    if (!savedProfile) {
      navigate('/add-child');
      return;
    }
    setProfile(savedProfile);
    setSubjects(savedProfile.subjects || []);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBookChange = (e) => {
    const bookTitle = e.target.value;
    if (bookTitle && profile.assignedBook) {
      setFormData(prev => ({
        ...prev,
        book: {
          title: profile.assignedBook.title,
          publisher: profile.assignedBook.publisher
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        book: null
      }));
    }
    // Clear error
    if (errors.book) {
      setErrors(prev => ({
        ...prev,
        book: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.subjectName.trim()) {
      newErrors.subjectName = 'Subject name is required';
    }

    if (!formData.book) {
      newErrors.book = 'Please select a book';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const updatedSubjects = [...subjects];
      const newSubject = {
        subjectName: formData.subjectName.trim(),
        book: formData.book
      };

      if (editingIndex !== null) {
        // Update existing subject
        updatedSubjects[editingIndex] = newSubject;
      } else {
        // Add new subject
        updatedSubjects.push(newSubject);
      }

      // Update profile
      const updatedProfile = {
        ...profile,
        subjects: updatedSubjects
      };
      
      childProfile.save(updatedProfile);
      setProfile(updatedProfile);
      setSubjects(updatedSubjects);
      
      // Reset form
      setFormData({
        subjectName: '',
        book: null
      });
      setShowForm(false);
      setEditingIndex(null);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData({
      subjectName: '',
      book: null
    });
    setShowForm(false);
    setEditingIndex(null);
    setErrors({});
  };

  const handleEdit = (index) => {
    const subject = subjects[index];
    setFormData({
      subjectName: subject.subjectName,
      book: subject.book
    });
    setEditingIndex(index);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      const updatedSubjects = subjects.filter((_, i) => i !== index);
      const updatedProfile = {
        ...profile,
        subjects: updatedSubjects
      };
      
      childProfile.save(updatedProfile);
      setProfile(updatedProfile);
      setSubjects(updatedSubjects);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="subjects-container">
      <div className="subjects-card">
        <div className="subjects-header">
          <h1 className="subjects-title">Subjects</h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-button"
          >
            Back to Dashboard
          </button>
        </div>

        {!showForm ? (
          <>
            {subjects.length === 0 ? (
              <div className="empty-state">
                <p className="empty-message">No subjects yet</p>
                <button 
                  onClick={() => setShowForm(true)} 
                  className="primary-button"
                >
                  Add Subject
                </button>
              </div>
            ) : (
              <>
                <div className="subjects-list">
                  {subjects.map((subject, index) => (
                    <div key={index} className="subject-card">
                      <div className="subject-info">
                        <h3 className="subject-name">{subject.subjectName}</h3>
                        {subject.book && (
                          <div className="subject-book">
                            <span className="book-label">Book:</span>
                            <span className="book-title">{subject.book.title}</span>
                            <span className="book-publisher">({subject.book.publisher})</span>
                          </div>
                        )}
                      </div>
                      <div className="subject-actions">
                        <button 
                          onClick={() => handleEdit(index)} 
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(index)} 
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="add-subject-section">
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="primary-button"
                  >
                    Add Subject
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="subject-form-container">
            <h2 className="form-title">
              {editingIndex !== null ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <form onSubmit={handleSubmit} className="subject-form">
              <div className="form-group">
                <label htmlFor="subjectName">Subject Name *</label>
                <input
                  type="text"
                  id="subjectName"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleInputChange}
                  placeholder="Enter subject name"
                  className={errors.subjectName ? 'error' : ''}
                />
                {errors.subjectName && (
                  <span className="error-message">{errors.subjectName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="book">Assigned Book *</label>
                {profile.assignedBook ? (
                  <select
                    id="book"
                    name="book"
                    value={formData.book?.title || ''}
                    onChange={handleBookChange}
                    className={errors.book ? 'error' : ''}
                  >
                    <option value="">Select a book</option>
                    <option value={profile.assignedBook.title}>
                      {profile.assignedBook.title} ({profile.assignedBook.publisher})
                    </option>
                  </select>
                ) : (
                  <div className="no-book-message">
                    <p>No book assigned to child yet. Please assign a book first.</p>
                    <button 
                      type="button"
                      onClick={() => navigate('/books')} 
                      className="secondary-button"
                    >
                      Go to Books
                    </button>
                  </div>
                )}
                {errors.book && (
                  <span className="error-message">{errors.book}</span>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="secondary-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subjects;

