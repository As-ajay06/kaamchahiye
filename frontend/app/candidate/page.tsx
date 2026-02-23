'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, Resume } from '@/lib/api';

export default function CandidateDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Omit<Resume, 'id'>>({
    name: '',
    email: '',
    role: '',
    experience: 'Fresher',
    skills: [],
    projects: '',
    resume_text: '',
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'candidate') {
      router.push('/recruiter');
      return;
    }
    if (user) {
      loadResume();
    }
  }, [user, authLoading, router]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const data = await api.getResume();
      if (data) {
        setResume(data);
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
          experience: data.experience,
          skills: data.skills || [],
          projects: data.projects || '',
          resume_text: data.resume_text || '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (resume) {
        await api.updateResume(resume.id!, formData);
        setSuccess('Resume updated successfully!');
      } else {
        const result = await api.createResume(formData);
        setResume({ ...formData, id: result.id });
        setSuccess('Resume created successfully!');
      }
      setIsEditing(false);
      await loadResume();
    } catch (err: any) {
      setError(err.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!resume || !confirm('Are you sure you want to delete your resume?')) return;

    try {
      await api.deleteResume(resume.id!);
      setResume(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        experience: 'Fresher',
        skills: [],
        projects: '',
        resume_text: '',
      });
      setSuccess('Resume deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete resume');
    }
  };

  if (authLoading || loading) {
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

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <header className="bg-black px-6 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-3xl text-white tracking-tight">CANDIDATE</h1>
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
      <div className="max-w-4xl mx-auto p-8 md:p-10">
        {/* Alerts */}
        {error && (
          <div className="brutal-alert brutal-alert-error mb-6">
            ✕ {error}
          </div>
        )}
        {success && (
          <div className="brutal-alert brutal-alert-success mb-6">
            ✓ {success}
          </div>
        )}

        {/* Resume Card */}
        <div className="brutal-card p-8 md:p-10">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-black">
            <div>
              <h2 className="font-display text-4xl tracking-tight">
                {resume ? 'My Resume' : 'Create Resume'}
              </h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                {resume ? 'Manage your profile' : 'Build your profile'}
                <span className="animate-blink">_</span>
              </p>
            </div>
            {resume && !isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="brutal-btn px-4 py-2 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="brutal-btn px-4 py-2 text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* ── View Mode ── */}
          {!isEditing && resume ? (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <div className="font-display text-3xl tracking-tight">{resume.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{resume.email}</div>
                </div>
                <div className="flex gap-2">
                  <span className="skill-tag bg-black text-white border-black">
                    {resume.role}
                  </span>
                  <span className="skill-tag">
                    {resume.experience}
                  </span>
                </div>
              </div>

              {resume.skills && resume.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t-2 border-black">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resume.projects && (
                <div className="mt-6 pt-6 border-t-2 border-black">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Projects</h3>
                  <p className="text-sm leading-relaxed">{resume.projects}</p>
                </div>
              )}

              {resume.resume_text && (
                <div className="mt-6 pt-6 border-t-2 border-black">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Resume Text</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{resume.resume_text}</p>
                </div>
              )}
            </div>
          ) : (
            /* ── Edit / Create Mode ── */
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="brutal-input"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="brutal-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="role" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                    Role *
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="e.g., Software Engineer"
                    className="brutal-input"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                    Experience *
                  </label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value as 'Fresher' | 'Experienced' })}
                    required
                    className="brutal-select"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="Experienced">Experienced</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="skills" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                  Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    id="skills"
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Type a skill, press Enter"
                    className="brutal-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="brutal-btn px-4 py-2 text-xs whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag inline-flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="font-bold hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="projects" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                  Projects
                </label>
                <textarea
                  id="projects"
                  value={formData.projects}
                  onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                  placeholder="Describe your projects..."
                  className="brutal-input min-h-[120px] resize-y"
                />
              </div>

              <div className="mb-8">
                <label htmlFor="resume_text" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                  Resume Text
                </label>
                <textarea
                  id="resume_text"
                  value={formData.resume_text}
                  onChange={(e) => setFormData({ ...formData, resume_text: e.target.value })}
                  placeholder="Paste or type your resume text here..."
                  className="brutal-input min-h-[120px] resize-y"
                />
              </div>

              <div className="flex gap-3 pt-6 border-t-2 border-black">
                <button
                  type="submit"
                  className="brutal-btn-primary px-6 py-3 text-sm"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent animate-spin inline-block" />
                      Saving...
                    </span>
                  ) : resume ? (
                    '→ Update Resume'
                  ) : (
                    '→ Create Resume'
                  )}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); loadResume(); }}
                    className="brutal-btn px-6 py-3 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
