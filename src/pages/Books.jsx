import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { childProfile } from '../utils/childProfile';
import './Books.css';

// Mock books data
const mockBooks = [
  {
    id: 1,
    title: 'Mathematics Fundamentals',
    publisher: 'Cambridge',
    gradeRange: '1–5',
    subject: 'Math',
    preview: 'A comprehensive introduction to basic mathematical concepts including addition, subtraction, and number recognition.'
  },
  {
    id: 2,
    title: 'Advanced Algebra',
    publisher: 'Pearson',
    gradeRange: '9–12',
    subject: 'Math',
    preview: 'Deep dive into algebraic expressions, equations, and problem-solving techniques for high school students.'
  },
  {
    id: 3,
    title: 'English Grammar Basics',
    publisher: 'Oxford',
    gradeRange: '1–5',
    subject: 'English',
    preview: 'Essential grammar rules and exercises designed for elementary school students to build strong language foundations.'
  },
  {
    id: 4,
    title: 'Literature and Composition',
    publisher: 'Cambridge',
    gradeRange: '6–8',
    subject: 'English',
    preview: 'Explore classic and contemporary literature while developing writing and analytical skills.'
  },
  {
    id: 5,
    title: 'Introduction to Science',
    publisher: 'Pearson',
    gradeRange: '1–5',
    subject: 'Science',
    preview: 'Discover the wonders of the natural world through hands-on experiments and engaging activities.'
  },
  {
    id: 6,
    title: 'Biology for Middle School',
    publisher: 'Oxford',
    gradeRange: '6–8',
    subject: 'Science',
    preview: 'Comprehensive coverage of cell biology, ecosystems, and human anatomy tailored for middle school learners.'
  },
  {
    id: 7,
    title: 'Chemistry Principles',
    publisher: 'Cambridge',
    gradeRange: '9–12',
    subject: 'Science',
    preview: 'Advanced chemistry concepts including atomic structure, chemical reactions, and laboratory techniques.'
  },
  {
    id: 8,
    title: 'World History',
    publisher: 'Pearson',
    gradeRange: '6–8',
    subject: 'History',
    preview: 'Journey through major historical events and civilizations from ancient times to the modern era.'
  },
  {
    id: 9,
    title: 'Geography Essentials',
    publisher: 'Oxford',
    gradeRange: '1–5',
    subject: 'Geography',
    preview: 'Learn about continents, countries, climates, and geographical features through interactive maps and activities.'
  },
  {
    id: 10,
    title: 'Physics Fundamentals',
    publisher: 'Cambridge',
    gradeRange: '9–12',
    subject: 'Science',
    preview: 'Master the principles of mechanics, thermodynamics, and electromagnetism with clear explanations and examples.'
  }
];

function Books() {
  const navigate = useNavigate();
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGradeRange, setSelectedGradeRange] = useState('');

  // Get unique values for filters
  const publishers = ['Cambridge', 'Pearson', 'Oxford'];
  const subjects = [...new Set(mockBooks.map(book => book.subject))];
  const gradeRanges = [...new Set(mockBooks.map(book => book.gradeRange))];

  // Filter books based on selected filters
  const filteredBooks = mockBooks.filter(book => {
    const matchesPublisher = !selectedPublisher || book.publisher === selectedPublisher;
    const matchesSubject = !selectedSubject || book.subject === selectedSubject;
    const matchesGradeRange = !selectedGradeRange || book.gradeRange === selectedGradeRange;
    return matchesPublisher && matchesSubject && matchesGradeRange;
  });

  const handleAssignBook = (book) => {
    const profile = childProfile.get();
    if (!profile) {
      alert('Please add a child profile first');
      navigate('/add-child');
      return;
    }

    // Save the assigned book to the profile
    const updatedProfile = {
      ...profile,
      assignedBook: {
        title: book.title,
        publisher: book.publisher
      }
    };
    
    childProfile.save(updatedProfile);
    navigate('/dashboard');
  };

  return (
    <div className="books-container">
      <div className="books-header">
        <h1 className="books-title">Books Catalogue</h1>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="publisher-filter">Publisher:</label>
          <select
            id="publisher-filter"
            value={selectedPublisher}
            onChange={(e) => setSelectedPublisher(e.target.value)}
            className="filter-select"
          >
            <option value="">All Publishers</option>
            {publishers.map(publisher => (
              <option key={publisher} value={publisher}>{publisher}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="subject-filter">Subject:</label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="grade-filter">Grade Range:</label>
          <select
            id="grade-filter"
            value={selectedGradeRange}
            onChange={(e) => setSelectedGradeRange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Grades</option>
            {gradeRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="books-grid">
        {filteredBooks.length === 0 ? (
          <p className="no-books-message">No books found matching your filters.</p>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <h3 className="book-title">{book.title}</h3>
              <div className="book-details">
                <div className="book-detail-item">
                  <span className="detail-label">Publisher:</span>
                  <span className="detail-value">{book.publisher}</span>
                </div>
                <div className="book-detail-item">
                  <span className="detail-label">Grade Range:</span>
                  <span className="detail-value">{book.gradeRange}</span>
                </div>
                <div className="book-detail-item">
                  <span className="detail-label">Subject:</span>
                  <span className="detail-value">{book.subject}</span>
                </div>
              </div>
              <p className="book-preview">{book.preview}</p>
              <button
                onClick={() => handleAssignBook(book)}
                className="assign-button"
              >
                Assign Book to Child
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Books;

