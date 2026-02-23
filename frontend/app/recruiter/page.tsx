'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, Resume } from '@/lib/api';

export default function RecruiterDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search filters
  const [query, setQuery] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'recruiter') {
      router.push('/candidate');
      return;
    }
    if (user) {
      searchResumes();
    }
  }, [user, authLoading, router, page]);

  const searchResumes = async () => {
    try {
      setLoading(true);
      setError('');
      const params: any = {
        page,
        page_size: pageSize,
      };
      if (query) params.q = query;
      if (skillsFilter) params.skills = skillsFilter;
      if (roleFilter) params.role = roleFilter;
      if (experienceFilter) params.experience = experienceFilter;

      const result = await api.searchResumes(params);
      setResumes(result.items);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'Failed to search resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    searchResumes();
  };

  const handleClearFilters = () => {
    setQuery('');
    setSkillsFilter('');
    setRoleFilter('');
    setExperienceFilter('');
    setPage(1);
  };

  useEffect(() => {
    if (user) {
      searchResumes();
    }
  }, [page]);

  if (authLoading) {
    return (
      <div className="min-h-screen pixel-bg flex items-center justify-center">
        <div className="brutal-card p-8 text-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black animate-spin-slow" />
            <span className="text-sm font-bold uppercase tracking-widest">
              Loading<span className="animate-blink">_</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <header className="bg-black px-6 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-3xl text-white tracking-tight">RECRUITER</h1>
          <div className="hidden sm:block w-px h-6 bg-gray-600" />
          <span className="hidden sm:block text-xs text-gray-400 uppercase tracking-widest">Dashboard</span>
        </div>
        <div className="flex gap-3 items-center">
          <div className="px-3 py-1 border border-gray-600 text-gray-300 text-xs uppercase tracking-widest">
            {user.name}
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest border-2 border-white hover:bg-gray-200 transition-colors"
          >
            Logout →
          </button>
        </div>
      </header>

      {/* ── Decorative Bar ── */}
      <div className="h-1 bg-black" />
      <div className="h-8 pixel-bg border-b-2 border-black relative">
        <div className="crosshair" style={{ top: '4px', left: '20px' }} />
        <div className="crosshair" style={{ top: '4px', right: '20px' }} />
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto p-8 md:p-10">
        {/* Error */}
        {error && (
          <div className="brutal-alert brutal-alert-error mb-6">
            ✕ {error}
          </div>
        )}

        {/* ── Search Card ── */}
        <div className="brutal-card p-8 md:p-10 mb-8">
          <div className="mb-6 pb-6 border-b-2 border-black">
            <h2 className="font-display text-4xl tracking-tight">Search Resumes</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
              Find the perfect candidates<span className="animate-blink">_</span>
            </p>
          </div>

          <form onSubmit={handleSearch}>
            <div className="mb-6">
              <label htmlFor="query" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                Search Query
              </label>
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, role, projects, or resume text..."
                className="brutal-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="skills" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                  Skills
                </label>
                <input
                  id="skills"
                  type="text"
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  placeholder="e.g., JavaScript, Python"
                  className="brutal-input"
                />
              </div>

              <div>
                <label htmlFor="role" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="brutal-input"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                  Experience
                </label>
                <select
                  id="experience"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="brutal-select"
                >
                  <option value="">All</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="brutal-btn-primary px-6 py-3 text-sm"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent animate-spin inline-block" />
                    Searching...
                  </span>
                ) : (
                  '→ Search'
                )}
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="brutal-btn px-6 py-3 text-sm"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* ── Results ── */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-2 h-2 bg-black" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Found {total} resume{total !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="brutal-card p-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-black animate-spin-slow" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Searching<span className="animate-blink">_</span>
              </span>
            </div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="brutal-card p-8 text-center">
            <p className="font-display text-2xl mb-2">No Results</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <>
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="brutal-card brutal-card-hover p-7 md:p-8 mb-5 cursor-default"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                  <div>
                    <div className="font-display text-2xl tracking-tight">{resume.name}</div>
                    <div className="text-xs card-subtitle text-gray-500 mt-1">{resume.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="card-tag skill-tag bg-black text-white border-black">
                      {resume.role}
                    </span>
                    <span className="card-tag skill-tag">
                      {resume.experience}
                    </span>
                  </div>
                </div>

                {resume.skills && resume.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-current" style={{ borderColor: 'inherit' }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill, idx) => (
                        <span key={idx} className="card-tag skill-tag text-[10px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resume.projects && (
                  <div className="mt-4 pt-4 border-t-2 border-current" style={{ borderColor: 'inherit' }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Projects</h4>
                    <p className="text-sm leading-relaxed">{resume.projects}</p>
                  </div>
                )}

                {resume.resume_text && (
                  <div className="mt-4 pt-4 border-t-2 border-current" style={{ borderColor: 'inherit' }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Resume Text</h4>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{resume.resume_text}</p>
                  </div>
                )}
              </div>
            ))}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-8 flex-wrap">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="brutal-btn px-4 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 border-2 border-black text-xs font-bold uppercase transition-all duration-100 ${p === page
                      ? 'bg-black text-white'
                      : 'bg-white text-black shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="brutal-btn px-4 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
