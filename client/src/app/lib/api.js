const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Submits a lead to the backend Leads API.
 * 
 * @param {'consultation' | 'contact' | 'eligibility' | 'job_application' | 'employer_inquiry'} type 
 * @param {Record<string, any>} data 
 * @returns {Promise<{ success: boolean, message: string, data?: any }>}
 */
export async function submitLead(type, data = {}) {
  const sourcePage = typeof window !== 'undefined' ? window.location.pathname : '';

  // Clean data to remove undefined or empty string values for optional fields
  const cleanData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleanData[key] = value;
    }
  }

  const payload = {
    type,
    ...cleanData,
    sourcePage,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = result.message || 'Something went wrong, please try again.';
      if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
        errorMessage = result.errors.map((err) => err.message).join('. ');
      }
      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: true,
      message: result.message || 'Thank you! Your request has been received.',
      data: result.data,
    };
  } catch (error) {
    console.error('[submitLead] Network error:', error);
    return {
      success: false,
      message: 'Something went wrong, please try again.',
    };
  }
}

/**
 * Submits a recruitment job application with optional CV file upload.
 * 
 * @param {Record<string, any>} data 
 * @param {File | null} file 
 * @returns {Promise<{ success: boolean, message: string, data?: any }>}
 */
export async function submitJobApplication(data = {}, file = null) {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    if (file) {
      formData.append('cv', file);
    }

    const response = await fetch(`${BASE_URL}/api/applications`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = result.message || 'Application submission failed. Please try again.';
      if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
        errorMessage = result.errors.map((err) => err.message).join('. ');
      }
      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: true,
      message: result.message || 'Thank you! Your job application and CV have been received.',
      data: result.data,
    };
  } catch (error) {
    console.error('[submitJobApplication] Network error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Universal safe public GET fetcher with Next.js revalidation and fallback handling
 */
export async function fetchPublicData(endpoint, params = {}, options = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const qs = query.toString();
    const url = `${BASE_URL}/api/${endpoint}${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      next: { revalidate: 60, ...(options.next || {}) },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json().catch(() => null);
    return json?.data || null;
  } catch (err) {
    console.warn(`[fetchPublicData] Could not load /api/${endpoint}, using fallback:`, err.message);
    return null;
  }
}

/* ================= PUBLIC DATA FETCHERS ================= */

export async function fetchCountries() {
  return fetchPublicData('countries');
}

export async function fetchHeroContent() {
  return fetchPublicData('hero');
}

export async function fetchAboutContent() {
  return fetchPublicData('about');
}

export async function fetchCountryBySlug(slug) {
  return fetchPublicData(`countries/${slug}`);
}

export async function fetchUniversities(params = {}) {
  const data = await fetchPublicData('universities', { limit: 100, ...params });
  if (data && data.universities) return data.universities;
  return Array.isArray(data) ? data : [];
}

export async function fetchUniversityBySlug(slug) {
  return fetchPublicData(`universities/${slug}`);
}

export async function fetchJobs(params = {}) {
  const data = await fetchPublicData('jobs', { limit: 100, ...params });
  if (data && data.jobs) return data.jobs;
  return Array.isArray(data) ? data : [];
}

export async function fetchBlogs(params = {}) {
  const data = await fetchPublicData('blogs', { limit: 100, ...params });
  if (data && data.blogs) return data.blogs;
  return Array.isArray(data) ? data : [];
}

export async function fetchBlogBySlug(slug) {
  return fetchPublicData(`blogs/${slug}`);
}

export async function fetchFaqs(params = {}) {
  const data = await fetchPublicData('faqs', { limit: 100, ...params });
  if (data && data.faqs) return data.faqs;
  return Array.isArray(data) ? data : [];
}

export async function fetchServices() {
  return fetchPublicData('services');
}

export async function fetchTestimonials() {
  return fetchPublicData('testimonials');
}

export async function fetchPartners() {
  return fetchPublicData('partners');
}

/**
 * Subscribes an email to the newsletter updates.
 * @param {{ email: string, interest?: string }} payload
 */
export async function subscribeNewsletter({ email, interest = 'all' }) {
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, interest }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Subscription failed. Please check your email and try again.',
      };
    }

    return {
      success: true,
      message: result.message || 'Thank you for subscribing! Check your inbox for updates.',
      data: result.data,
    };
  } catch (error) {
    console.error('[subscribeNewsletter] Network error:', error);
    return {
      success: false,
      message: 'Unable to connect to the server. Please try again later.',
    };
  }
}

/**
 * Fetches dynamic footer and social links settings.
 */
export async function fetchFooterSettings() {
  try {
    const res = await fetch(`${BASE_URL}/api/settings/footer`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error('[fetchFooterSettings] Network error:', err);
    return null;
  }
}

/**
 * Fetches dynamic corporate headquarters and regional liaison lounges.
 */
export async function fetchContactSettings() {
  try {
    const res = await fetch(`${BASE_URL}/api/settings/contact`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error('[fetchContactSettings] Network error:', err);
    return null;
  }
}


