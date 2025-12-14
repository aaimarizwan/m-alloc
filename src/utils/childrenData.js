// Mock data storage for multiple children
// In a real app, this would be an API call or database

let childrenList = [
  {
    id: '1',
    name: 'Emma',
    age: 8,
    grade: 10,
    goals: ['Conceptual Learning'],
    curriculum: {
      name: 'Oxford General Curriculum',
      description: 'A balanced curriculum suitable for all learning styles and academic levels.'
    },
    books: [
      {
        title: 'Advanced Algebra',
        publisher: 'Pearson',
        subject: 'Mathematics'
      }
    ],
    subjects: [
      {
        name: 'Mathematics',
        description: 'Advanced algebra and geometry',
        book: {
          title: 'Advanced Algebra',
          publisher: 'Pearson'
        }
      }
    ],
    timetable: [
      {
        subject: 'Advance Maths',
        day: 'Monday',
        time: '10am',
        notes: 'Chapter 1 Review'
      }
    ]
  },
  {
    id: '2',
    name: 'Alex',
    age: 10,
    grade: 12,
    goals: ['Critical Thinking', 'Problem Solving'],
    curriculum: null,
    books: [],
    subjects: [],
    timetable: []
  },
  {
    id: '3',
    name: 'Sophia',
    age: 7,
    grade: 8,
    goals: ['Creative Expression'],
    curriculum: null,
    books: [],
    subjects: [],
    timetable: []
  }
];

export const childrenData = {
  // Get all children
  getAll: () => {
    const stored = localStorage.getItem('childrenList');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return childrenList;
      }
    }
    return childrenList;
  },

  // Get a single child by ID
  getById: (id) => {
    const children = childrenData.getAll();
    return children.find(child => child.id === id) || null;
  },

  // Save all children
  saveAll: (children) => {
    localStorage.setItem('childrenList', JSON.stringify(children));
    childrenList = children;
  },

  // Add a new child
  add: (childData) => {
    const children = childrenData.getAll();
    const newId = String(Math.max(...children.map(c => parseInt(c.id) || 0), 0) + 1);
    const newChild = {
      ...childData,
      id: newId,
      curriculum: childData.curriculum || null,
      books: childData.books || [],
      subjects: childData.subjects || [],
      timetable: childData.timetable || []
    };
    children.push(newChild);
    childrenData.saveAll(children);
    return newChild;
  },

  // Update an existing child
  update: (id, childData) => {
    const children = childrenData.getAll();
    const index = children.findIndex(c => c.id === id);
    if (index !== -1) {
      children[index] = { ...children[index], ...childData };
      childrenData.saveAll(children);
      return children[index];
    }
    return null;
  },

  // Delete a child
  delete: (id) => {
    const children = childrenData.getAll();
    const filtered = children.filter(c => c.id !== id);
    childrenData.saveAll(filtered);
    return filtered;
  },

  // Initialize with default data if empty
  initialize: () => {
    const existing = localStorage.getItem('childrenList');
    if (!existing) {
      childrenData.saveAll(childrenList);
    } else {
      // Migrate existing data to new structure
      const children = JSON.parse(existing);
      const migrated = children.map(child => {
        // Migrate assignedBook to books array
        if (child.assignedBook && (!child.books || child.books.length === 0)) {
          child.books = [child.assignedBook];
        }
        // Ensure arrays exist
        if (!child.books) child.books = [];
        if (!child.subjects) child.subjects = [];
        if (!child.timetable) child.timetable = [];
        // Migrate subjects structure
        if (child.subjects && child.subjects.length > 0) {
          child.subjects = child.subjects.map(subj => {
            if (subj.subjectName) {
              return {
                name: subj.subjectName,
                description: subj.description || '',
                book: subj.book || null
              };
            }
            return subj;
          });
        }
        // Migrate timetable structure
        if (child.timetable && child.timetable.length > 0) {
          child.timetable = child.timetable.map(lesson => ({
            subject: lesson.subject,
            day: lesson.day,
            time: lesson.time,
            notes: lesson.note || lesson.notes || ''
          }));
        }
        return child;
      });
      childrenData.saveAll(migrated);
    }
  }
};

// Initialize on import
childrenData.initialize();
