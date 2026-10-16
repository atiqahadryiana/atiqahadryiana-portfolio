import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, FolderOpen, LockKeyhole, LogOut, UserRound } from 'lucide-react';
import { adminApi } from '../utils/admin-api';
import ResumeEditor from '../components/admin/ResumeEditor';
import ProfileEditor from '../components/admin/ProfileEditor';
import ProjectsEditor from '../components/admin/ProjectsEditor';

function Login({ configured, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  async function submit(event) {
    event.preventDefault();
    if (pending.current) return;
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      const session = await adminApi('login', { body: { username: username.trim(), password } });
      setPassword('');
      await onLogin(session);
    } catch (failure) {
      setError(failure.message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="admin-login" aria-labelledby="admin-login-title">
      <LockKeyhole size={28} aria-hidden="true" />
      <p className="small-label">Your portfolio workspace</p>
      <h1 id="admin-login-title">
        Admin sign-in<span className="accent">.</span>
      </h1>
      <p>Sign in to manage your projects, profile, and resume.</p>
      {!configured && (
        <p className="admin-help">
          Create an account on this computer with <code>npm run admin:setup</code>, then reload this
          page.
        </p>
      )}
      <form aria-label="Admin sign-in" onSubmit={submit} aria-busy={busy}>
        <div className="field">
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            maxLength={80}
            disabled={busy || !configured}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            maxLength={256}
            disabled={busy || !configured}
            required
          />
        </div>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <button className="button" type="submit" disabled={busy || !configured}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [content, setContent] = useState(null);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [section, setSection] = useState('projects');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    document.title = 'Portfolio admin';
    let active = true;
    async function load() {
      try {
        const auth = await adminApi('session');
        if (!active) return;
        setConfigured(auth.configured);
        if (auth.authenticated) {
          const data = await adminApi('content');
          if (active) {
            setContent(data);
            setSession(auth);
          }
        }
      } catch (failure) {
        if (active) setError(failure.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);
  async function signIn(auth) {
    if (!content) setContent(await adminApi('content'));
    setSession(auth);
    setError('');
  }
  async function signOut() {
    setSaving(true);
    setError('');
    try {
      await adminApi('logout', { token: session.token, body: {} });
      setSession(null);
      setContent(null);
    } catch (failure) {
      if (failure.status === 401) {
        setSession(null);
        setContent(null);
      } else setError(failure.message);
    } finally {
      setSaving(false);
    }
  }
  async function save(endpoint, data) {
    setSaving(true);
    try {
      const updated = await adminApi(endpoint, {
        token: session.token,
        body: { ...data, revision: content.revision },
      });
      setContent(updated);
      return updated;
    } catch (failure) {
      if (failure.status === 401) setSession(null);
      throw failure;
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="admin-page container" aria-label="Portfolio administration">
      <div className="admin-toolbar">
        <Link to="/" className="text-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to portfolio
        </Link>
        <span className="admin-local-label">Local admin</span>
      </div>
      {loading && (
        <p className="admin-loading" role="status">
          Opening your workspace…
        </p>
      )}
      {error && (
        <div className="admin-service-error">
          <p role="alert" className="field-error">
            {error}
          </p>
          <button
            className="button button-outline"
            onClick={() => window.location.reload()}
            type="button"
          >
            Reload editor
          </button>
        </div>
      )}
      {!loading && !session && !error && <Login configured={configured} onLogin={signIn} />}
      {content && (
        <div hidden={!session}>
          <div className="admin-dashboard-heading">
            <div className="admin-heading">
              <p className="small-label">Your portfolio, kept current</p>
              <h1>
                Portfolio admin<span className="accent">.</span>
              </h1>
              <p>Update the work and details you share with the world.</p>
            </div>
            <div className="admin-account">
              <span>Signed in as {session?.username}</span>
              <button
                className="button button-outline"
                type="button"
                onClick={signOut}
                disabled={saving}
              >
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>
          <div className="admin-workspace">
            <nav className="admin-section-nav" aria-label="Admin sections">
              {[
                ['projects', 'Projects', FolderOpen],
                ['profile', 'Profile', UserRound],
                ['resume', 'Resume', FileText],
              ].map(([id, label, _Icon]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={section === id}
                  disabled={saving}
                  onClick={() => setSection(id)}
                >
                  <_Icon size={18} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </nav>
            <div className="admin-panels">
              <div hidden={section !== 'projects'}>
                <ProjectsEditor content={content} save={save} />
              </div>
              <div hidden={section !== 'profile'}>
                <ProfileEditor content={content} save={save} />
              </div>
              <div hidden={section !== 'resume'}>
                <ResumeEditor content={content} save={save} />
              </div>
              <aside className="admin-publishing" aria-label="Publishing changes">
                <h2>After saving</h2>
                <p>
                  Your local portfolio updates immediately. Rebuild and redeploy the website to make
                  your changes available to visitors.
                </p>
              </aside>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
