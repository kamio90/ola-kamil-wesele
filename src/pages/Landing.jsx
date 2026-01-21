import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '../utils/api';

const Landing = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // All available images in public/img
  const images = [
    '/img/IMG_1529.JPG',
    '/img/IMG_5330.JPG',
    '/img/IMG_6405.JPG',
    '/img/IMG_6563.JPG',
    '/img/IMG_6607.JPG',
  ];

  // Polaroid-style accent photos in fixed positions
  const polaroidPhotos = [
    { src: '/img/IMG_5330.JPG', position: 'top-8 left-8', rotation: -6, size: 'w-48 h-56' },
    { src: '/img/IMG_6563.JPG', position: 'top-12 right-12', rotation: 8, size: 'w-44 h-52' },
    { src: '/img/IMG_6405.JPG', position: 'bottom-20 left-12', rotation: -4, size: 'w-52 h-60' },
    { src: '/img/IMG_1529.JPG', position: 'bottom-16 right-16', rotation: 5, size: 'w-48 h-56' },
    { src: '/img/IMG_6607.JPG', position: 'top-1/2 left-4', rotation: -8, size: 'w-40 h-48' },
  ];

  // Carousel for main background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

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
        navigate('/rsvp', { state: { guest: data.guest } });
      } else {
        setError('Nieprawidłowy kod. Sprawdź zaproszenie.');
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
    setToken(e.target.value.toUpperCase());
    setError('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Full-screen background carousel */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: index === currentImageIndex ? 1 : 0,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/70"></div>
      </div>

      {/* Polaroid-style accent photos (hidden on mobile) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {polaroidPhotos.map((photo, index) => (
          <div
            key={index}
            className={`absolute ${photo.position} ${photo.size} bg-white p-3 shadow-2xl transition-transform hover:scale-105 hover:shadow-3xl`}
            style={{
              transform: `rotate(${photo.rotation}deg)`,
              zIndex: 5,
            }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photo.src})` }}
            />
          </div>
        ))}
      </div>

      {/* Decorative botanical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-botanical/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-fade-in-up">
          {/* Single floating ring icon */}
          <div className="text-6xl mb-8 animate-float">
            💍
          </div>

          {/* Names */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary-dark mb-4 drop-shadow-lg">
            Kamil & Ola
          </h1>
          <p className="text-2xl md:text-3xl text-primary mb-2 drop-shadow-md">2026</p>

          {/* Wedding details */}
          <div className="mb-8 space-y-1 text-text-dark drop-shadow-md">
            <p className="text-xl md:text-2xl font-semibold">2 lipca 2026</p>
            <p className="text-lg md:text-xl">Sielsko Anielsko, Niesadna</p>
          </div>

          {/* Token input card */}
          <div className="glass-card p-8 md:p-10 max-w-md mx-auto shadow-2xl">
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
                  className="w-full px-6 py-4 text-center text-2xl font-bold tracking-widest border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
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
