import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ProtectedRoute';
import { supabase } from '../lib/supabase';
import { getRecoveryErrorMessage } from '../lib/passwordRecovery';
import '../styles/auth.css';

export default function ResetPasswordPage() {
  const { user, loading: authLoading } = useAuth();
  const [linkError] = useState(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    return hash.has('error') || hash.has('error_code') || query.has('error') || query.has('error_code');
  });
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading || !user || linkError) return;
    setError('');
    if (password.length < 8) {
      setError('Slaptažodį turi sudaryti bent 8 simboliai.');
      return;
    }
    if (password !== confirmation) {
      setError('Slaptažodžiai nesutampa.');
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword('');
      setConfirmation('');
      setSuccess(true);
    } catch (err) {
      setError(getRecoveryErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return <PageLoader />;

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-brand">Habit Tracker</h1>
        <h2 className="auth-title">Naujas slaptažodis</h2>
        {success ? (
          <>
            <div className="alert alert-success" role="status">Slaptažodis sėkmingai pakeistas.</div>
            <Link className="btn btn-primary btn-block" to="/">Tęsti į programą</Link>
          </>
        ) : linkError || !user ? (
          <>
            <div className="alert alert-error" role="alert">
              Atkūrimo nuoroda netinkama arba nebegalioja. Paprašykite naujos nuorodos.
            </div>
            <Link to="/forgot-password">Gauti naują atkūrimo nuorodą</Link>
          </>
        ) : (
          <>
            <p className="auth-subtitle">Įveskite ir pakartokite naują slaptažodį (bent 8 simboliai).</p>
            {error && <div className="alert alert-error" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="new-password">Naujas slaptažodis</label>
                <input id="new-password" type="password" autoComplete="new-password" minLength={8} required
                  value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} />
              </div>
              <div className="form-field">
                <label htmlFor="confirm-password">Pakartokite slaptažodį</label>
                <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required
                  value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={loading} />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? 'Išsaugoma…' : 'Išsaugoti slaptažodį'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
