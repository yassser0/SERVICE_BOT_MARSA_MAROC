import React, { useState, useEffect, useRef } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001';

// --- Animated background particles ---
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      // Draw connecting lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const resp = await axios.post(`${API_BASE_URL}/admin/login`, {
        email: email.trim(),
        password,
      });
      if (resp.data?.token) {
        localStorage.setItem('admin_token', resp.data.token);
        localStorage.setItem('admin_user', JSON.stringify(resp.data.user));
      }
      onLoginSuccess(resp.data?.user || { email });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        'Identifiants incorrects. Veuillez réessayer.';
      setError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ParticleCanvas />

      {/* Decorative orbs */}
      <div className="login-orb login-orb--blue" />
      <div className="login-orb login-orb--violet" />

      <div className={`login-card glass-panel ${shake ? 'login-shake' : ''}`}>

        {/* Brand header */}
        <div className="login-brand">
          <div className="login-logo">
            <ShieldCheck size={26} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="login-title">Marsa Maroc</h1>
            <p className="login-subtitle">Panneau d'administration</p>
          </div>
        </div>

        <div className="login-divider" />

        <div className="login-welcome">
          <h2 className="login-welcome-title">Bienvenue 👋</h2>
          <p className="login-welcome-desc">
            Connectez-vous pour accéder à votre espace administrateur.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="login-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          <div className="form-field">
            <label className="input-label" htmlFor="login-email">
              Adresse e-mail
            </label>
            <div className="input-icon-wrapper">
              <Mail size={15} className="input-icon" />
              <input
                id="login-email"
                type="email"
                className="glass-input input-with-icon"
                placeholder="admin@marsamaroc.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="input-label" htmlFor="login-password">
              Mot de passe
            </label>
            <div className="input-icon-wrapper">
              <Lock size={15} className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="glass-input input-with-icon"
                style={{ paddingRight: '44px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Connexion en cours…
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="login-footer-text">
          Accès réservé au personnel autorisé de Marsa Maroc.
        </p>
      </div>

      {/* Bottom version badge */}
      <div className="login-version-badge">
        Bot Builder · Admin v2.0
      </div>
    </div>
  );
}
