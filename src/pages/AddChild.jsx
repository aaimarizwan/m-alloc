import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { childrenData } from '../utils/childrenData';
import Toast from '../components/Toast';
import './AddChild.css';

function AddChild() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    goals: []
  });

  const [showToast, setShowToast] = useState(false);
  
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      const child = childrenData.getById(id);
      if (!child) {
        navigate('/children');
        return;
      }
      setFormData({
        name: child.name || '',
        age: child.age || '',
        grade: child.grade || '',
        goals: child.goals || []
      });
      setLoading(false);
    }
  }, [isEditMode, id, navigate]);

  const [errors, setErrors] = useState({});

  const learningGoals = [
    'Exam Prep',
    'Conceptual Learning',
    'Mixed',
    'Critical Thinking',
    'Problem Solving',
    'Creative Expression'
  ];

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

  const handleGoalChange = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
    // Clear error when user selects a goal
    if (errors.goals) {
      setErrors(prev => ({
        ...prev,
        goals: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Child name is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 18) {
      newErrors.age = 'Please enter a valid age (1-18)';
    }

    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    } else if (isNaN(formData.grade) || formData.grade < 1 || formData.grade > 12) {
      newErrors.grade = 'Please enter a valid grade (1-12)';
    }

    if (formData.goals.length === 0) {
      newErrors.goals = 'Please select at least one learning goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const profileData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        grade: parseInt(formData.grade),
        goals: formData.goals
      };
      
      if (isEditMode) {
        // Preserve existing data that isn't in the form
        const existingChild = childrenData.getById(id);
        if (existingChild) {
          const updated = childrenData.update(id, {
            ...existingChild,
            ...profileData
          });
          if (updated) {
            setShowToast(true);
            setTimeout(() => {
              navigate(`/child/${id}`);
            }, 1500);
          }
        }
      } else {
        childrenData.add(profileData);
        setShowToast(true);
        setTimeout(() => {
          navigate('/children');
        }, 1500);
      }
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading child data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {showToast && (
        <Toast 
          message={isEditMode ? 'Child profile updated successfully.' : 'Child added successfully.'}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="auth-card">
        <h1 className="auth-title">{isEditMode ? 'Edit Child Profile' : 'Add Child Profile'}</h1>
        <p className="auth-subtitle">{isEditMode ? 'Update your child\'s information' : 'Enter your child\'s information'}</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Child Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter child's name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter age"
              min="1"
              max="18"
              className={errors.age ? 'error' : ''}
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="grade">Grade</label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className={errors.grade ? 'error' : ''}
            >
              <option value="">Select grade</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            {errors.grade && <span className="error-message">{errors.grade}</span>}
          </div>
          
          <div className="form-group">
            <label>Learning Goals</label>
            <div className="checkbox-group">
              {learningGoals.map(goal => (
                <label key={goal} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.goals.includes(goal)}
                    onChange={() => handleGoalChange(goal)}
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
            {errors.goals && <span className="error-message">{errors.goals}</span>}
          </div>
          
          <button type="submit" className="auth-button">
            {isEditMode ? 'Update Child Profile' : 'Save Child Profile'}
          </button>
          
          <button 
            type="button" 
            onClick={() => isEditMode ? navigate(`/child/${id}`) : navigate('/children')} 
            className="cancel-button"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddChild;

