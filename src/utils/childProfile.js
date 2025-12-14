// Child profile utilities using localStorage
export const childProfile = {
  save: (profile) => {
    localStorage.setItem('childProfile', JSON.stringify(profile));
  },
  
  get: () => {
    const stored = localStorage.getItem('childProfile');
    return stored ? JSON.parse(stored) : null;
  },
  
  exists: () => {
    return localStorage.getItem('childProfile') !== null;
  },
  
  clear: () => {
    localStorage.removeItem('childProfile');
  }
};

