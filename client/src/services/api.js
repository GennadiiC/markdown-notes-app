const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to make API requests
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: async (username, email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (username, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

// Notes API
export const notesAPI = {
  getAll: async (token) => {
    return request('/notes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getById: async (id, token) => {
    return request(`/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  create: async (noteData, token) => {
    return request('/notes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });
  },

  update: async (id, noteData, token) => {
    return request(`/notes/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });
  },

  delete: async (id, token) => {
    return request(`/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
