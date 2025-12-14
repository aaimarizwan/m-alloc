// Mock authentication utilities using localStorage
export const auth = {
  login: (email) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
  },
  
  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  
  getUserEmail: () => {
    return localStorage.getItem('userEmail') || '';
  }
};

