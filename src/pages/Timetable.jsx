import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { childProfile } from '../utils/childProfile';
import './Timetable.css';

function Timetable() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    day: '',
    time: '',
    note: ''
  });
  const [errors, setErrors] = useState({});

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeOptions = [
    '8am', '9am', '10am', '11am', '12pm', 
    '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'
  ];

  useEffect(() => {
    const savedProfile = childProfile.get();
    if (!savedProfile) {
      navigate('/add-child');
      return;
    }
    setProfile(savedProfile);
    setLessons(savedProfile.timetable || []);
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

  const validate = () => {
    const newErrors = {};

    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.day) {
      newErrors.day = 'Day is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const updatedLessons = [...lessons];
      const newLesson = {
        subject: formData.subject,
        day: formData.day,
        time: formData.time,
        note: formData.note || ''
      };

      if (editingIndex !== null) {
        // Update existing lesson
        updatedLessons[editingIndex] = newLesson;
      } else {
        // Add new lesson
        updatedLessons.push(newLesson);
      }

      // Update profile
      const updatedProfile = {
        ...profile,
        timetable: updatedLessons
      };
      
      childProfile.save(updatedProfile);
      setProfile(updatedProfile);
      setLessons(updatedLessons);
      
      // Reset form
      setFormData({
        subject: '',
        day: '',
        time: '',
        note: ''
      });
      setShowForm(false);
      setEditingIndex(null);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData({
      subject: '',
      day: '',
      time: '',
      note: ''
    });
    setShowForm(false);
    setEditingIndex(null);
    setErrors({});
  };

  const handleEdit = (index) => {
    const lesson = lessons[index];
    setFormData({
      subject: lesson.subject,
      day: lesson.day,
      time: lesson.time,
      note: lesson.note || ''
    });
    setEditingIndex(index);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedLessons = lessons.filter((_, i) => i !== index);
      const updatedProfile = {
        ...profile,
        timetable: updatedLessons
      };
      
      childProfile.save(updatedProfile);
      setProfile(updatedProfile);
      setLessons(updatedLessons);
    }
  };

  if (!profile) {
    return null;
  }

  const subjects = profile.subjects || [];

  return (
    <div className="timetable-container">
      <div className="timetable-card">
        <div className="timetable-header">
          <h1 className="timetable-title">Weekly Timetable</h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-button"
          >
            Back to Dashboard
          </button>
        </div>

        {!showForm ? (
          <>
            <div className="timetable-days">
              <h2 className="days-title">Days of the Week</h2>
              <div className="days-list">
                {days.map((day) => (
                  <div key={day} className="day-item">{day}</div>
                ))}
              </div>
            </div>

            {lessons.length === 0 ? (
              <div className="empty-state">
                <p className="empty-message">No lessons scheduled yet</p>
                <button 
                  onClick={() => setShowForm(true)} 
                  className="primary-button"
                >
                  Add Lesson
                </button>
              </div>
            ) : (
              <>
                <div className="lessons-section">
                  <h2 className="lessons-title">Scheduled Lessons</h2>
                  <div className="lessons-list">
                    {lessons.map((lesson, index) => (
                      <div key={index} className="lesson-card">
                        <div className="lesson-info">
                          <h3 className="lesson-subject">{lesson.subject}</h3>
                          <div className="lesson-details">
                            <span className="lesson-day">{lesson.day}</span>
                            <span className="lesson-time">{lesson.time}</span>
                            {lesson.note && (
                              <span className="lesson-note">{lesson.note}</span>
                            )}
                          </div>
                        </div>
                        <div className="lesson-actions">
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
                </div>
                <div className="add-lesson-section">
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="primary-button"
                  >
                    Add Lesson
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="lesson-form-container">
            <h2 className="form-title">
              {editingIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}
            </h2>
            <form onSubmit={handleSubmit} className="lesson-form">
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                {subjects.length > 0 ? (
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={errors.subject ? 'error' : ''}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject.subjectName}>
                        {subject.subjectName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="no-subjects-message">
                    <p>No subjects added yet. Please add subjects first.</p>
                    <button 
                      type="button"
                      onClick={() => navigate('/subjects')} 
                      className="secondary-button"
                    >
                      Go to Subjects
                    </button>
                  </div>
                )}
                {errors.subject && (
                  <span className="error-message">{errors.subject}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="day">Day *</label>
                <select
                  id="day"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className={errors.day ? 'error' : ''}
                >
                  <option value="">Select a day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {errors.day && (
                  <span className="error-message">{errors.day}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="time">Time *</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={errors.time ? 'error' : ''}
                >
                  <option value="">Select a time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <span className="error-message">{errors.time}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="note">Note (Optional)</label>
                <input
                  type="text"
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Add a note about this lesson"
                />
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

export default Timetable;

