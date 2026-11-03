const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Universal fetch wrapper for Admin API requests with cookies (JWT) support.
 */
async function adminFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const defaultHeaders = {};
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    credentials: 'include', // essential for httpOnly token cookie
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type') || '';

    // If response is a file (e.g. CSV or CV download)
    if (options.responseType === 'blob') {
      if (!res.ok) {
        throw new Error('File download failed');
      }
      return { success: true, blob: await res.blob() };
    }

    let data = {};
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => ({}));
    }

    if (!res.ok) {
      const errorMsg =
        data.message ||
        (Array.isArray(data.errors)
          ? data.errors.map((e) => e.message).join(', ')
          : 'Request failed. Please try again.');
      return {
        success: false,
        status: res.status,
        message: errorMsg,
      };
    }

    return {
      success: true,
      status: res.status,
      data: data.data !== undefined ? data.data : data,
      pagination: data.pagination,
      message: data.message,
    };
  } catch (error) {
    console.error(`[adminFetch] Error calling ${endpoint}:`, error);
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection.',
    };
  }
}

/* ================= AUTHENTICATION ================= */

export async function adminLogin(email, password) {
  return adminFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function adminLogout() {
  return adminFetch('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getAdminMe() {
  return adminFetch('/api/auth/me');
}

export async function changePassword(currentPassword, newPassword) {
  return adminFetch('/api/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function resetPasswordWithToken(token, newPassword) {
  return adminFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

/* ================= DASHBOARD & STATS ================= */

export async function getAdminStats() {
  return adminFetch('/api/admin/stats');
}

/* ================= LEADS MANAGEMENT ================= */

export async function getAdminLeads(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const queryString = query.toString();
  return adminFetch(`/api/admin/leads${queryString ? `?${queryString}` : ''}`);
}

export async function getAdminLead(id) {
  return adminFetch(`/api/admin/leads/${id}`);
}

export async function updateAdminLead(id, data) {
  return adminFetch(`/api/admin/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function addLeadNote(id, text) {
  return adminFetch(`/api/admin/leads/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function exportLeadsCsv(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val) query.append(key, val);
  });
  const queryString = query.toString();
  return adminFetch(`/api/admin/leads/export${queryString ? `?${queryString}` : ''}`, {
    responseType: 'blob',
  });
}

/* ================= JOB APPLICATIONS & CVS ================= */

export async function getAdminApplications(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const queryString = query.toString();
  return adminFetch(`/api/admin/applications${queryString ? `?${queryString}` : ''}`);
}

export async function updateApplicationStatus(id, status) {
  return adminFetch(`/api/admin/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function downloadApplicantCv(id) {
  return adminFetch(`/api/admin/applications/${id}/cv`, {
    responseType: 'blob',
  });
}

/* ================= CONTENT MANAGEMENT ================= */

export async function getContentList(resource, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val) query.append(key, val);
  });
  const queryString = query.toString();
  return adminFetch(`/api/${resource}${queryString ? `?${queryString}` : ''}`);
}

export async function createContentItem(resource, data) {
  return adminFetch(`/api/admin/${resource}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateContentItem(resource, id, data) {
  return adminFetch(`/api/admin/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteContentItem(resource, id) {
  return adminFetch(`/api/admin/${resource}/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminHero() {
  return adminFetch('/api/admin/hero');
}

export async function updateAdminHero(data) {
  return adminFetch('/api/admin/hero', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getAdminAbout() {
  return adminFetch('/api/admin/about');
}

export async function updateAdminAbout(data) {
  return adminFetch('/api/admin/about', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/* ================= IMAGE UPLOAD ================= */

export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('image', file);
  return adminFetch('/api/admin/upload/image', {
    method: 'POST',
    body: formData,
  });
}

export async function deleteCloudinaryImage(publicId) {
  return adminFetch('/api/admin/upload/image', {
    method: 'DELETE',
    body: JSON.stringify({ publicId }),
  });
}

/* ================= STAFF MANAGEMENT (SUPER ADMIN) ================= */

export async function getStaffMembers() {
  return adminFetch('/api/admin/staff');
}

export async function createStaffMember(data) {
  return adminFetch('/api/admin/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateStaffMember(id, data) {
  return adminFetch(`/api/admin/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteStaffMember(id) {
  return adminFetch(`/api/admin/staff/${id}`, {
    method: 'DELETE',
  });
}

/* ================= FOOTER & SOCIALS STUDIO ================= */

export async function getAdminFooter() {
  return adminFetch('/api/settings/footer');
}

export async function updateAdminFooter(data) {
  return adminFetch('/api/admin/settings/footer', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/* ================= CONTACT & LIAISON LOUNGES STUDIO ================= */

export async function getAdminContact() {
  return adminFetch('/api/settings/contact');
}

export async function updateAdminContact(data) {
  return adminFetch('/api/admin/settings/contact', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}


