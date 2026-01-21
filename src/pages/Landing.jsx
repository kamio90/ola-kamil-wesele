import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '../utils/api';

const Landing = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      setError('Wpisz kod z zaproszenia');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await checkToken(token);

      if (data.success) {
        // Navigate to RSVP page with guest data
        navigate('/rsvp', { state: { guest: data.guest } });
      } else {
        setError('Nieprawidłowy kod. Sprawdź zaproszenie.');
        // Add shake animation
        const input = document.getElementById('token-input');
        if (input) {
          input.classList.add('shake');
          setTimeout(() => input.classList.remove('shake'), 500);
        }
      }
    } catch (err) {
      setError('Błąd połączenia. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenChange = (e) => {
    // Convert to uppercase automatically
    setToken(e.target.value.toUpperCase());
    setError('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-dark/20"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-fade-in-up">
          {/* Floating ring icon */}
          <div className="text-6xl mb-8 animate-float">
            💍
          </div>

          {/* Names */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary-dark mb-4">
            Kamil & Ola
          </h1>
          <p className="text-2xl md:text-3xl text-primary mb-2">2026</p>

          {/* Wedding details */}
          <div className="mb-8 space-y-1 text-text-dark">
            <p className="text-xl md:text-2xl">15 sierpnia 2026</p>
            <p className="text-lg md:text-xl">Dwór Czarownica, Oszczywilk</p>
          </div>

          {/* Token input card */}
          <div className="glass-card p-8 md:p-10 max-w-md mx-auto">
            <h2 className="text-xl md:text-2xl font-heading mb-6 text-text-dark">
              Wpisz swój kod z zaproszenia
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  id="token-input"
                  type="text"
                  value={token}
                  onChange={handleTokenChange}
                  placeholder="ABC123XY"
                  maxLength={8}
                  className="w-full px-6 py-4 text-center text-2xl font-bold tracking-widest border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={loading}
                />
                {error && (
                  <p className="mt-3 text-error text-sm font-medium">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sprawdzam...
                  </span>
                ) : (
                  'Dalej →'
                )}
              </button>
            </form>

            {/* Admin link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/admin')}
                className="text-sm text-text-light hover:text-primary transition-colors"
              >
                Panel administratora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
