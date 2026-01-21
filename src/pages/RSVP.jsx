import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitRSVP } from '../utils/api';

const RSVP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const guest = location.state?.guest;

  const [formData, setFormData] = useState({
    status: '',
    companion: '',
    accommodation: '',
    transport: '',
    dietary: '',
    email: '',
    phone: '',
    additionalInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If no guest data, redirect to landing
    if (!guest) {
      navigate('/');
      return;
    }

    // Pre-fill form with existing data
    setFormData({
      status: guest.status || '',
      companion: guest.companion || '',
      accommodation: guest.accommodation || '',
      transport: guest.transport || '',
      dietary: guest.dietary || '',
      email: guest.email || '',
      phone: guest.phone || '',
      additionalInfo: guest.additionalInfo || '',
    });
  }, [guest, navigate]);

  if (!guest) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.status) {
      setError('Proszę wybrać, czy będziesz z nami.');
      return;
    }

    if (!formData.email) {
      setError('Proszę podać adres email.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Proszę podać poprawny adres email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await submitRSVP({
        token: guest.token,
        ...formData,
      });

      if (data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.error || 'Błąd zapisu. Spróbuj ponownie.');
      }
    } catch (err) {
      setError('Błąd połączenia. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const firstName = guest.name.split(' ')[0];
  const showExtraFields = formData.status === 'TAK';
  // Show companion input only if guest has 'TAK' - means they can bring someone
  const needsCompanionInput = guest.companion === 'TAK';
  // Show companion name if already specified (not empty and not 'TAK')
  const hasCompanionName = guest.companion && guest.companion !== 'TAK';

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 flex items-center justify-center p-4">
        <div className="glass-card p-8 md:p-12 max-w-md mx-auto text-center animate-fade-in-up">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-heading font-bold text-primary-dark mb-4">
            Dziękujemy!
          </h2>
          <p className="text-lg text-text-dark mb-6">
            Twoje potwierdzenie zostało zapisane.
          </p>
          <p className="text-text-light mb-8">
            Do zobaczenia! ❤️
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Powrót do strony głównej
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-primary hover:text-primary-dark transition-colors flex items-center gap-2"
        >
          <span>←</span> Powrót
        </button>

        {/* Greeting */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-dark mb-2">
            Cześć, {firstName}! 👋
          </h1>
        </div>

        {/* Wedding Info Card */}
        <div className="glass-card p-6 md:p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-heading font-bold text-primary-dark mb-6 flex items-center gap-2">
            💍 Informacje o ślubie
          </h2>

          <div className="space-y-4 text-text-dark">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-semibold">Ślub</p>
                <p>12 lipca 2026, 15:00</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold">Wesele</p>
                <p>12 lipca 2026, 18:00</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold">Miejsce</p>
                <p>Sielsko Anielsko - Szklana Stodoła Weselna</p>
                <p className="text-sm text-text-light">Niesadna-Przecinka 33, 08-440 Niesadna</p>
                <a
                  href="https://www.google.com/maps/place/Sielsko+Anielsko+-+Szklana+Stodo%C5%82a+Weselna/@52.2278125,21.7603125,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary-dark underline"
                >
                  Zobacz na mapie →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">👔</span>
              <div>
                <p className="font-semibold">Dress Code</p>
                <p>Elegancki</p>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form */}
        <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-heading font-bold text-primary-dark mb-6">
            Potwierdzenie obecności
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-text-dark font-semibold mb-3">
                Będziesz z nami? *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'TAK', label: 'Tak, będę! ✅', emoji: '✅' },
                  { value: 'NIE', label: 'Niestety nie mogę 😢', emoji: '😢' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary"
                    style={{
                      borderColor: formData.status === option.value ? 'var(--primary)' : '#e5e7eb',
                      backgroundColor: formData.status === option.value ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary"
                    />
                    <span className="text-lg">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional fields for "TAK" */}
            {showExtraFields && (
              <>
                {/* Companion - only show if guest has companion field set */}
                {needsCompanionInput && (
                  <div>
                    <label htmlFor="companion" className="block text-text-dark font-semibold mb-2">
                      Osoba towarzysząca
                    </label>
                    <input
                      type="text"
                      id="companion"
                      name="companion"
                      value={formData.companion === 'TAK' ? '' : formData.companion}
                      onChange={handleChange}
                      placeholder="Imię i nazwisko"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}

                {hasCompanionName && (
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-text-dark">
                      <span className="font-semibold">Osoba towarzysząca:</span> {guest.companion}
                    </p>
                  </div>
                )}

                {/* Accommodation */}
                <div>
                  <label className="block text-text-dark font-semibold mb-3">
                    Potrzebujesz noclegu?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['TAK', 'NIE'].map((option) => (
                      <label
                        key={option}
                        className="flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-primary text-center"
                        style={{
                          borderColor: formData.accommodation === option ? 'var(--primary)' : '#e5e7eb',
                          backgroundColor: formData.accommodation === option ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
                        }}
                      >
                        <input
                          type="radio"
                          name="accommodation"
                          value={option}
                          checked={formData.accommodation === option}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dietary */}
                <div>
                  <label htmlFor="dietary" className="block text-text-dark font-semibold mb-2">
                    Dieta / Alergie
                  </label>
                  <textarea
                    id="dietary"
                    name="dietary"
                    value={formData.dietary}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Np. wegetariańska, alergia na orzechy..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
              </>
            )}

            {/* Email (always shown) */}
            <div>
              <label htmlFor="email" className="block text-text-dark font-semibold mb-2">
                Email (do potwierdzenia) *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="twoj@email.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-text-dark font-semibold mb-2">
                Telefon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+48 123 456 789"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Additional Info */}
            <div>
              <label htmlFor="additionalInfo" className="block text-text-dark font-semibold mb-2">
                Dodatkowe informacje
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="3"
                placeholder="Coś, o czym powinniśmy wiedzieć..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-error/10 border border-error rounded-xl">
                <p className="text-error text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit button */}
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
                  Wysyłam...
                </span>
              ) : (
                'Wyślij potwierdzenie 💌'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RSVP;
