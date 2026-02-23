const API_URL = process.env.NEXT_PUBLIC_API_URL


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter';
}

export interface Resume {
  id?: string;
  name: string;
  email: string;
  role: string;
  experience: 'Fresher' | 'Experienced';
  skills: string[];
  projects: string;
  resume_text: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface SearchResponse {
  page: number;
  page_size: number;
  total: number;
  items: Resume[];
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    // Build headers object - always include Content-Type for JSON requests
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      // @ts-ignore
      headers['Authorization'] = `Bearer ${token}` as string;
    }

    // Build fetch options - always include body if provided
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
    };

    // Include body if provided (for POST, PUT, PATCH requests)
    if (options.body) {
      fetchOptions.body = options.body;
    }

    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async signup(data: { name: string; email: string; password: string; role: 'candidate' | 'recruiter' }): Promise<{ user: User }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Candidate endpoints
  async getResume(): Promise<Resume | null> {
    return this.request('/candidate/resume');
  }

  async createResume(data: Omit<Resume, 'id'>): Promise<{ id: string }> {
    return this.request('/candidate/resume', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResume(id: string, data: Partial<Resume>): Promise<{ message: string }> {
    return this.request(`/candidate/resume/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResume(id: string): Promise<{ message: string }> {
    return this.request(`/candidate/resume/${id}`, {
      method: 'DELETE',
    });
  }

  // Recruiter endpoints
  async searchResumes(params: {
    q?: string;
    skills?: string;
    role?: string;
    experience?: string;
    page?: number;
    page_size?: number;
  }): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append('q', params.q);
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.role) queryParams.append('role', params.role);
    if (params.experience) queryParams.append('experience', params.experience);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.page_size) queryParams.append('page_size', params.page_size.toString());

    return this.request(`/recruiter/search?${queryParams.toString()}`);
  }
}

export const api = new ApiClient();

