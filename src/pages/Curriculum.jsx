import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { childProfile } from '../utils/childProfile';
import './Curriculum.css';

function Curriculum() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [recommendedCurriculum, setRecommendedCurriculum] = useState(null);

  useEffect(() => {
    const savedProfile = childProfile.get();
    if (!savedProfile) {
      // If no profile exists, redirect to add-child
      navigate('/add-child');
      return;
    }
    setProfile(savedProfile);
  }, [navigate]);

  const learningGoals = [
    'Exam Prep',
    'Conceptual Learning',
    'Mixed'
  ];

  const handleGoalChange = (goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (selectedGoals.length === 0) {
        alert('Please select at least one learning goal');
        return;
      }
      // Calculate recommended curriculum
      const curriculum = getRecommendedCurriculum(profile.grade, selectedGoals);
      setRecommendedCurriculum(curriculum);
      setStep(3);
    }
  };

  const getRecommendedCurriculum = (grade, goals) => {
    const hasConceptualLearning = goals.includes('Conceptual Learning');
    const hasExamPrep = goals.includes('Exam Prep');

    if (grade <= 5 && hasConceptualLearning) {
      return {
        name: 'Cambridge Primary',
        description: 'A comprehensive primary curriculum focused on conceptual understanding and inquiry-based learning.'
      };
    } else if (grade >= 9 && hasExamPrep) {
      return {
        name: 'Pearson Secondary',
        description: 'A rigorous secondary curriculum designed for exam preparation and academic excellence.'
      };
    } else {
      return {
        name: 'Oxford General Curriculum',
        description: 'A balanced curriculum suitable for all learning styles and academic levels.'
      };
    }
  };

  const handleSave = () => {
    if (!profile || !recommendedCurriculum) return;

    // Update profile with curriculum
    const updatedProfile = {
      ...profile,
      curriculum: recommendedCurriculum
    };

    childProfile.save(updatedProfile);
    navigate('/dashboard');
  };

  if (!profile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="auth-container">
      <div className="auth-card curriculum-card">
        <h1 className="auth-title">Curriculum Decider</h1>
        
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Child Info</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Goals</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Recommendation</span>
          </div>
        </div>

        {/* Step 1: Show child's name and grade */}
        {step === 1 && (
          <div className="wizard-step">
            <p className="auth-subtitle">Review your child's information</p>
            <div className="child-review">
              <div className="review-item">
                <span className="review-label">Name:</span>
                <span className="review-value">{profile.name}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Grade:</span>
                <span className="review-value">Grade {profile.grade}</span>
              </div>
            </div>
            <button onClick={handleNext} className="auth-button">
              Next
            </button>
          </div>
        )}

        {/* Step 2: Select learning goals */}
        {step === 2 && (
          <div className="wizard-step">
            <p className="auth-subtitle">Select learning goals for curriculum selection</p>
            <div className="form-group">
              <label>Learning Goals</label>
              <div className="checkbox-group">
                {learningGoals.map(goal => (
                  <label key={goal} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedGoals.includes(goal)}
                      onChange={() => handleGoalChange(goal)}
                    />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="wizard-buttons">
              <button onClick={() => setStep(1)} className="cancel-button">
                Back
              </button>
              <button onClick={handleNext} className="auth-button">
                Get Recommendation
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Show recommended curriculum */}
        {step === 3 && recommendedCurriculum && (
          <div className="wizard-step">
            <p className="auth-subtitle">Recommended curriculum for {profile.name}</p>
            <div className="curriculum-card-display">
              <h2 className="curriculum-name">{recommendedCurriculum.name}</h2>
              <p className="curriculum-description">{recommendedCurriculum.description}</p>
            </div>
            <div className="wizard-buttons">
              <button onClick={() => setStep(2)} className="cancel-button">
                Back
              </button>
              <button onClick={handleSave} className="auth-button">
                Save Curriculum
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Curriculum;

