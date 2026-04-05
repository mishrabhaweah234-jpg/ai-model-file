import { useState } from 'react';
import { useStore } from '@/store/useStore';

const AuthModal = () => {
  const { authOpen, setAuthOpen, authMode, setAuthMode } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState({ msg: 'Use demo details or any valid email format to preview the flow.', type: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || password.length < 6) {
      setFeedback({ msg: 'Please enter a valid email and a password with at least 6 characters.', type: 'error' });
      return;
    }
    if (authMode === 'signup' && password !== confirmPassword) {
      setFeedback({ msg: 'Passwords do not match yet.', type: 'error' });
      return;
    }
    setFeedback({ msg: authMode === 'login' ? 'Login preview successful.' : 'Sign-up preview successful.', type: 'success' });
  };

  if (!authOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 z-40" onClick={() => setAuthOpen(false)} />
      <div className="fixed inset-0 z-50 grid place-items-center p-4">
        <div className="glass-surface !rounded-3xl w-full max-w-[460px] p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="eyebrow">Welcome to ModeMuse</p>
              <h3 className="font-display text-xl">{authMode === 'login' ? 'Login' : 'Sign Up'}</h3>
            </div>
            <button onClick={() => setAuthOpen(false)} className="btn-secondary !py-2 !px-3 text-sm">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required
                className="w-full mt-1 border border-border bg-card/80 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required
                className="w-full mt-1 border border-border bg-card/80 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </label>
            {authMode === 'signup' && (
              <label className="block">
                <span className="text-sm font-semibold">Confirm Password</span>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required
                  className="w-full mt-1 border border-border bg-card/80 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </label>
            )}
            <p className={`text-sm min-h-[1.4rem] ${feedback.type === 'error' ? 'text-destructive' : feedback.type === 'success' ? 'text-teal' : 'text-muted-foreground'}`}>
              {feedback.msg}
            </p>
            <button type="submit" className="btn-primary w-full text-sm">
              {authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="btn-secondary w-full mt-3 text-sm"
          >
            {authMode === 'login' ? 'Need an account? Switch to Sign Up' : 'Already have an account? Switch to Login'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
