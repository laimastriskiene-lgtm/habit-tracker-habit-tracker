import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getRecoveryErrorMessage } from '../lib/passwordRecovery';
import '../styles/auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setError('');
    setSuccess(false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Įveskite galiojantį el. pašto adresą.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err) {
      setError(getRecoveryErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-brand">Habit Tracker</h1>
        <h2 className="auth-title">Slaptažodžio atkūrimas</h2>
        <p className="auth-subtitle">Įveskite savo paskyros el. pašto adresą.</p>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="status">
          Jei paskyra su šiuo el. paštu egzistuoja, išsiuntėme slaptažodžio atkūrimo nuorodą.
          Patikrinkite pašto dėžutę ir šlamšto aplanką.
        </div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="recovery-email">El. paštas</label>
            <input id="recovery-email" type="email" autoComplete="email" required
              value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Siunčiama…' : 'Siųsti atkūrimo nuorodą'}
          </button>
        </form>
        <p className="auth-footer"><Link to="/login">Grįžti į prisijungimą</Link></p>
      </div>
    </main>
  );
}
