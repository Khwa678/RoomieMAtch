const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('rm_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const authAPI = {
  signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  googleAuth: (googlePayload) => request('/auth/google', { method: 'POST', body: JSON.stringify(googlePayload) }),
  getMe: () => request('/auth/me'),
};

export const profileAPI = {
  createProfile: (profileData) => request('/profiles', { method: 'POST', body: JSON.stringify(profileData) }),
  getMeProfile: () => request('/profiles/me'),
  updateMeProfile: (profileData) => request('/profiles/me', { method: 'PUT', body: JSON.stringify(profileData) }),
  getProfileById: (id) => request(`/profiles/${id}`),
};

export const requirementAPI = {
  createRequirement: (reqData) => request('/requirements', { method: 'POST', body: JSON.stringify(reqData) }),
  getRequirementsMe: () => request('/requirements/me'),
  runMatch: (id) => request(`/requirements/${id}/match`, { method: 'POST' }),
  getMatches: (id) => request(`/requirements/${id}/matches`),
};

export const matchAPI = {
  connect: (matchId) => request(`/matches/${matchId}/connect`, { method: 'POST' }),
};

export const reportAPI = {
  createReport: (reportData) => request('/reports', { method: 'POST', body: JSON.stringify(reportData) }),
};

export const chatAPI = {
  getConversations: () => request('/chat/conversations'),
  getMessages: (matchId) => request(`/chat/${matchId}/messages`),
  sendMessage: (matchId, content) => request(`/chat/${matchId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
};

export const listingAPI = {
  getListings: (query = '') => request(`/listings${query}`),
  createListing: (data) => request('/listings', { method: 'POST', body: JSON.stringify(data) }),
  getListingById: (id) => request(`/listings/${id}`),
};
