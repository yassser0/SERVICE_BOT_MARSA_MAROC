import React, { useState, useEffect } from 'react';
import api from './lib/api';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { TooltipProvider } from './components/ui/Tooltip';
import Sidebar from './components/layout/Sidebar';
import BotList from './components/BotList';
import ChatView from './components/ChatView';
import SettingsView from './components/SettingsView';
import LoginPage from './components/LoginPage';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:8001'; // kept for LoginPage which uses raw axios (no auth needed)

// Global toast style config
const toastOptions = {
  duration: 4000,
  style: {
    background: 'rgba(15, 23, 42, 0.95)',
    color: '#f8fafc',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
    borderRadius: '12px',
    fontSize: '14px',
    padding: '12px 16px',
  },
  success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
  error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
};

export default function App() {
  const [currentView, setCurrentView] = useState('list');
  const [bots, setBots] = useState([]);
  const [activeBot, setActiveBot] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Auth state (persisted in localStorage) ---
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    setCurrentView('list');
    setActiveBot(null);
    setBots([]);
    toast.success('Déconnexion réussie.');
  };

  const fetchBots = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bots');
      setBots(response.data);
    } catch {
      toast.error('Impossible de récupérer les bots. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) fetchBots();
  }, [adminUser]);

  const handleCreateBot = async (botData) => {
    await api.post('/bots/', botData);
    await fetchBots();
  };

  const handleUpdateBot = async (botId, botData) => {
    await api.put(`/bots/${botId}`, botData);
    await fetchBots();
  };

  const handleDeleteBot = async (botId) => {
    const toastId = toast.loading('Suppression en cours…');
    try {
      await api.delete(`/bots/${botId}`);
      await fetchBots();
      toast.success('Bot supprimé avec succès.', { id: toastId });
    } catch {
      toast.error('Erreur lors de la suppression du bot.', { id: toastId });
    }
  };

  // --- Not authenticated → Login page ---
  if (!adminUser) {
    return (
      <>
        <Toaster position="top-right" toastOptions={toastOptions} />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  // --- Authenticated → Full admin app ---
  return (
    <TooltipProvider>
      <div className="app-shell">
        <Toaster position="top-right" toastOptions={toastOptions} />

        <Sidebar
          currentView={currentView === 'chat' ? 'list' : currentView}
          setCurrentView={(v) => {
            setActiveBot(null);
            setCurrentView(v);
          }}
          botsCount={bots.length}
          adminUser={adminUser}
          onLogout={handleLogout}
        />

        <main className="app-main">
          {currentView === 'list' && (
            <BotList
              bots={bots}
              loading={loading}
              onSelectBot={(bot) => {
                setActiveBot(bot);
                setCurrentView('chat');
              }}
              onDeleteBot={handleDeleteBot}
              onBotCreated={handleCreateBot}
              onBotUpdated={handleUpdateBot}
            />
          )}

          {currentView === 'chat' && activeBot && (
            <ChatView
              bot={activeBot}
              onBack={() => setCurrentView('list')}
            />
          )}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
    </TooltipProvider>
  );
}
