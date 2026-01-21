import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuests, updateGuest } from '../utils/api';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [stats, setStats] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Wszyscy');
  const [editingCell, setEditingCell] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadGuests();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterGuestsList();
  }, [guests, searchTerm, filterStatus]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (tokenInput === 'admin_kamil_ola_2026') {
      setAdminToken(tokenInput);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Nieprawidłowy token administratora');
    }
  };

  const loadGuests = async () => {
    setLoading(true);
    try {
      const data = await getGuests(adminToken || tokenInput);

      if (data.success) {
        setGuests(data.guests);
        setLastUpdated(data.metadata.lastUpdated);
        calculateStats(data.guests);
      } else {
        setError(data.error || 'Błąd pobierania danych');
      }
    } catch (err) {
      setError('Błąd połączenia');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (guestsList) => {
    const total = guestsList.length;
    const statusCounts = {
      TAK: guestsList.filter(g => g.status === 'TAK').length,
      NIE: guestsList.filter(g => g.status === 'NIE').length,
      OCZEKUJE: guestsList.filter(g => g.status === 'OCZEKUJE').length,
    };
    const accommodation = guestsList.filter(g => g.accommodation === 'TAK').length;
    const companions = guestsList.filter(g => g.companion && g.companion !== '' && g.companion !== 'TAK' && g.companion !== 'Tak').length;
    const totalAttending = statusCounts.TAK + companions;

    setStats({
      total,
      ...statusCounts,
      accommodation,
      companions,
      totalAttending,
    });
  };

  const filterGuestsList = () => {
    let filtered = [...guests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'Wszyscy') {
      filtered = filtered.filter(g => g.status === filterStatus);
    }

    setFilteredGuests(filtered);
  };

  const handleCellEdit = async (guestId, field, value) => {
    try {
      const data = await updateGuest(adminToken, guestId, { [field]: value });

      if (data.success) {
        // Update local state
        setGuests(prev => prev.map(g =>
          g.id === guestId ? { ...g, [field]: value } : g
        ));

        // Flash green animation
        flashCell(guestId, field);
      } else {
        alert('Błąd aktualizacji: ' + data.error);
      }
    } catch (err) {
      alert('Błąd połączenia');
    }

    setEditingCell(null);
  };

  const flashCell = (guestId, field) => {
    const cell = document.getElementById(`cell-${guestId}-${field}`);
    if (cell) {
      cell.classList.add('bg-success', 'bg-opacity-20');
      setTimeout(() => {
        cell.classList.remove('bg-success', 'bg-opacity-20');
      }, 1000);
    }
  };

  const exportCSV = () => {
    const headers = [
      'ID', 'Imię', 'Token', 'Poinformowany', 'Lokalizacja', 'Zaproszony przez',
      'Kategoria', 'Status', 'Osoba Tow.', 'Nocleg', 'Transport',
      'Email', 'Telefon', 'Dieta', 'Dodatkowe Info', 'Uwagi', 'Zaktualizowano'
    ];

    const rows = guests.map(g => [
      g.id, g.name, g.token, g.informed, g.location, g.invitedBy,
      g.category, g.status, g.companion, g.accommodation, g.transport,
      g.email, g.phone, g.dietary, g.additionalInfo, g.notes, g.updatedAt
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-botanical-light to-white flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-primary hover:text-primary-dark transition-colors flex items-center gap-2"
          >
            <span>←</span> Powrót
          </button>

          <h2 className="text-2xl font-heading font-bold text-primary-dark mb-6">
            Panel Administratora
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Token administratora"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {error && (
                <p className="mt-2 text-error text-sm">{error}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full">
              Zaloguj
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-botanical-light to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-dark">
              💍 Admin Panel - Kamil & Ola
            </h1>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAdminToken('');
                navigate('/');
              }}
              className="text-sm text-text-light hover:text-error transition-colors"
            >
              Wyloguj
            </button>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-heading font-bold text-primary-dark mb-4">
            📊 Statystyki
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-text-light">Zaproszeni</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-success">{stats.TAK || 0}</div>
              <div className="text-xs text-text-light">TAK ✅</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-error">{stats.NIE || 0}</div>
              <div className="text-xs text-text-light">NIE ❌</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border-2 border-primary">
              <div className="text-2xl font-bold text-primary">{stats.totalAttending || 0}</div>
              <div className="text-xs text-text-light font-semibold">Łącznie 🎉</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-text-dark">{stats.accommodation || 0}</div>
              <div className="text-xs text-text-light">Noclegi 🛏️</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-text-dark">{stats.companions || 0}</div>
              <div className="text-xs text-text-light">Towarzysze 👥</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="text-sm text-text-light">
              Ostatnia aktualizacja: {lastUpdated ? new Date(lastUpdated).toLocaleString('pl-PL') : 'Nigdy'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadGuests}
                disabled={loading}
                className="px-4 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all disabled:opacity-50"
              >
                ↻ Odśwież
              </button>
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                ⬇ Eksport CSV
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Wpisz imię..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option>Wszyscy</option>
                <option>TAK</option>
                <option>NIE</option>
                <option>OCZEKUJE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Imię</th>
                  <th className="px-4 py-3 text-left font-semibold">Token</th>
                  <th className="px-4 py-3 text-left font-semibold">Kategoria</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Osoba Tow.</th>
                  <th className="px-4 py-3 text-left font-semibold">Nocleg</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Telefon</th>
                  <th className="px-4 py-3 text-left font-semibold">Dieta</th>
                  <th className="px-4 py-3 text-left font-semibold">Dodatkowe Info</th>
                  <th className="px-4 py-3 text-left font-semibold">Uwagi</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3">{guest.id}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{guest.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{guest.token}</td>

                    {/* Category - editable */}
                    <td
                      id={`cell-${guest.id}-category`}
                      className="px-4 py-3 transition-colors cursor-pointer hover:bg-botanical-light/30"
                      onClick={() => setEditingCell({ id: guest.id, field: 'category' })}
                    >
                      {editingCell?.id === guest.id && editingCell?.field === 'category' ? (
                        <select
                          autoFocus
                          value={guest.category || ''}
                          onChange={(e) => handleCellEdit(guest.id, 'category', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          className="w-full px-2 py-1 border rounded text-xs"
                        >
                          <option value="">-</option>
                          <option>Rodzina</option>
                          <option>Znajomi</option>
                          <option>Konie</option>
                          <option>Praca</option>
                        </select>
                      ) : (
                        <span className="text-xs">{guest.category || '-'}</span>
                      )}
                    </td>

                    {/* Status - editable */}
                    <td
                      id={`cell-${guest.id}-status`}
                      className="px-4 py-3 transition-colors cursor-pointer hover:bg-botanical-light/30"
                      onClick={() => setEditingCell({ id: guest.id, field: 'status' })}
                    >
                      {editingCell?.id === guest.id && editingCell?.field === 'status' ? (
                        <select
                          autoFocus
                          value={guest.status}
                          onChange={(e) => handleCellEdit(guest.id, 'status', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option>OCZEKUJE</option>
                          <option>TAK</option>
                          <option>NIE</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          guest.status === 'TAK' ? 'bg-success/20 text-success' :
                          guest.status === 'NIE' ? 'bg-error/20 text-error' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {guest.status}
                        </span>
                      )}
                    </td>

                    {/* Companion - editable */}
                    <td
                      id={`cell-${guest.id}-companion`}
                      className="px-4 py-3 transition-colors cursor-pointer hover:bg-botanical-light/30"
                      onClick={() => setEditingCell({ id: guest.id, field: 'companion' })}
                      title={guest.companion || 'Brak'}
                    >
                      {editingCell?.id === guest.id && editingCell?.field === 'companion' ? (
                        <input
                          type="text"
                          autoFocus
                          value={guest.companion || ''}
                          onChange={(e) => handleCellEdit(guest.id, 'companion', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          placeholder="Imię i nazwisko"
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      ) : (
                        <span className="text-xs truncate block max-w-[150px]">
                          {guest.companion || '-'}
                        </span>
                      )}
                    </td>

                    {/* Accommodation - editable */}
                    <td
                      id={`cell-${guest.id}-accommodation`}
                      className="px-4 py-3 transition-colors cursor-pointer hover:bg-botanical-light/30"
                      onClick={() => setEditingCell({ id: guest.id, field: 'accommodation' })}
                    >
                      {editingCell?.id === guest.id && editingCell?.field === 'accommodation' ? (
                        <select
                          autoFocus
                          value={guest.accommodation || ''}
                          onChange={(e) => handleCellEdit(guest.id, 'accommodation', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          className="w-full px-2 py-1 border rounded text-xs"
                        >
                          <option value="">-</option>
                          <option>TAK</option>
                          <option>NIE</option>
                        </select>
                      ) : (
                        <span className="text-xs">{guest.accommodation || '-'}</span>
                      )}
                    </td>

                    {/* Email - read only */}
                    <td className="px-4 py-3 text-xs" title={guest.email}>
                      <span className="truncate block max-w-[150px]">
                        {guest.email || '-'}
                      </span>
                    </td>

                    {/* Phone - read only */}
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {guest.phone || '-'}
                    </td>

                    {/* Dietary - editable */}
                    <td
                      id={`cell-${guest.id}-dietary`}
                      className="px-4 py-3 transition-colors cursor-pointer hover:bg-botanical-light/30"
                      onClick={() => setEditingCell({ id: guest.id, field: 'dietary' })}
                      title={guest.dietary || 'Brak'}
                    >
                      {editingCell?.id === guest.id && editingCell?.field === 'dietary' ? (
                        <input
                          type="text"
                          autoFocus
                          value={guest.dietary || ''}
                          onChange={(e) => handleCellEdit(guest.id, 'dietary', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          placeholder="Dieta/alergie"
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      ) : (
                        <span className="text-xs truncate block max-w-[120px]">
                          {guest.dietary || '-'}
                        </span>
                      )}
                    </td>

                    {/* Additional Info - editable */}
                    <td
                      id={`cell-${guest.id}-additionalInfo`}
                      className="px-4 py-3 transition-colors cursor-pointer hover:bg-botanical-light/30"
                      onClick={() => setEditingCell({ id: guest.id, field: 'additionalInfo' })}
                      title={guest.additionalInfo || 'Brak'}
                    >
                      {editingCell?.id === guest.id && editingCell?.field === 'additionalInfo' ? (
                        <input
                          type="text"
                          autoFocus
                          value={guest.additionalInfo || ''}
                          onChange={(e) => handleCellEdit(guest.id, 'additionalInfo', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          placeholder="Dodatkowe info"
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      ) : (
                        <span className="text-xs truncate block max-w-[120px]">
                          {guest.additionalInfo || '-'}
                        </span>
                      )}
                    </td>

                    {/* Notes - editable */}
                    <td
                      id={`cell-${guest.id}-notes`}
                      className="px-4 py-3 transition-colors cursor-pointer hover:bg-botanical-light/30"
                      onClick={() => setEditingCell({ id: guest.id, field: 'notes' })}
                      title={guest.notes || 'Brak'}
                    >
                      {editingCell?.id === guest.id && editingCell?.field === 'notes' ? (
                        <input
                          type="text"
                          autoFocus
                          value={guest.notes || ''}
                          onChange={(e) => handleCellEdit(guest.id, 'notes', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          placeholder="Uwagi organizatora"
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      ) : (
                        <span className="text-xs truncate block max-w-[120px]">
                          {guest.notes || '-'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredGuests.length === 0 && (
              <div className="text-center py-12 text-text-light">
                Brak gości spełniających kryteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
