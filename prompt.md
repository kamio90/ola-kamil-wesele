# 💍 WEDDING RSVP WEBSITE - KAMIL & OLA

## 🎯 PROJECT OVERVIEW

Create a beautiful, fully responsive wedding RSVP website using:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Netlify Functions + Netlify Blobs (key-value storage)
- **Deployment**: Netlify (100% free)

The website has 3 main sections:
1. **Landing page** - guest enters unique token
2. **Personalized RSVP form** - guest confirms attendance and fills details
3. **Admin panel** - live editable table for bride & groom

---

## 📁 PROJECT STRUCTURE

```
wedding-website/
├── public/
│   └── img/                    # Background images (placeholder for now)
├── src/
│   ├── pages/
│   │   ├── Landing.jsx         # Main landing page
│   │   ├── RSVP.jsx           # Personalized RSVP form
│   │   └── Admin.jsx          # Admin panel
│   ├── components/
│   │   ├── BackgroundSlider.jsx
│   │   ├── TokenInput.jsx
│   │   ├── GuestForm.jsx
│   │   └── AdminTable.jsx
│   ├── utils/
│   │   └── api.js             # API helper functions
│   ├── App.jsx
│   └── main.jsx
├── netlify/
│   └── functions/
│       ├── check-token.js     # Verify token & get guest info
│       ├── submit-rsvp.js     # Save guest response
│       ├── admin-view.js      # Get all guests (admin only)
│       ├── admin-update.js    # Update guest data (admin only)
│       └── init-data.js       # Initialize Blobs with guest data
├── guests_data.json           # Initial guest data (see below)
├── netlify.toml
├── package.json
└── README.md
```

---

## 🗄️ INITIAL GUEST DATA

The `guests_data.json` file contains all guest information. This will be uploaded to Netlify Blobs on first deploy.

**Structure:**
```json
{
  "version": "1.0",
  "lastUpdated": "2026-01-21T12:00:00Z",
  "guests": [
    {
      "id": 1,
      "name": "Jan Kowalski",
      "token": "ABC123XY",
      "informed": "",
      "location": "Warszawa",
      "invitedBy": "Kamil",
      "category": "Rodzina",
      "status": "OCZEKUJE",
      "companion": "",
      "accommodation": "",
      "transport": "",
      "dietary": "",
      "additionalInfo": "",
      "email": "",
      "phone": "",
      "notes": "",
      "updatedAt": null
    }
  ],
  "metadata": {
    "totalGuests": 89,
    "adminToken": "admin_kamil_ola_2026"
  }
}
```

**I will provide the complete `guests_data.json` file separately with real guest data.**

---

## 🎨 DESIGN REQUIREMENTS

### General Style
- **Color Scheme**: 
  - Primary: Elegant purple/pink gradient (`#667eea` to `#764ba2`)
  - Accent: Gold/champagne (`#D4AF37`)
  - Background: White with soft gradients
  - Text: Dark gray (`#333`) and white
- **Typography**: 
  - Headers: "Playfair Display" (elegant serif)
  - Body: "Montserrat" (clean sans-serif)
- **Effects**:
  - Smooth animations (fade-in, slide-up)
  - Glass-morphism effects on cards
  - Floating animations for decorative elements
  - Responsive, mobile-first design

### Mobile-First
- 90% of guests will use mobile
- Touch-friendly buttons (min 44px height)
- Large, readable text
- Simple navigation

---

## 📄 PAGE 1: LANDING PAGE

### Layout
```
┌─────────────────────────────────────────┐
│                                         │
│     [Background: Animated images]       │
│                                         │
│            💍 (floating)                │
│                                         │
│         Kamil & Ola 2026                │
│                                         │
│      15 sierpnia 2026                   │
│      Dwór Czarownica, Oszczywilk        │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  Wpisz swój kod z zaproszenia│     │
│    │  ┌───────────────────────┐  │     │
│    │  │  [INPUT TOKEN]        │  │     │
│    │  └───────────────────────┘  │     │
│    │                             │     │
│    │      [ DALEJ → ]            │     │
│    └─────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

### Features
- **Background Slider**: 
  - Use placeholder images from `/public/img/` folder
  - Smooth fade transitions every 5 seconds
  - Ken Burns effect (slow zoom)
  - Dark overlay for text readability
  
- **Token Input**:
  - Large, centered input (auto-uppercase)
  - Format: 8 characters (e.g., "ABC123XY")
  - Real-time validation (show checkmark if valid format)
  - On submit → call `/api/check-token`
  
- **Error Handling**:
  - Invalid token → shake animation + "Nieprawidłowy kod. Sprawdź zaproszenie."
  - Empty input → "Wpisz kod z zaproszenia"
  
- **Loading State**:
  - Show spinner while checking token
  - Smooth transition to RSVP page

### Code Example (Token Input)
```jsx
const [token, setToken] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    const response = await fetch('/api/check-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.toUpperCase() })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Navigate to RSVP page with guest data
      navigate('/rsvp', { state: { guest: data.guest } });
    } else {
      setError('Nieprawidłowy kod. Sprawdź zaproszenie.');
    }
  } catch (err) {
    setError('Błąd połączenia. Spróbuj ponownie.');
  } finally {
    setLoading(false);
  }
};
```

---

## 📄 PAGE 2: PERSONALIZED RSVP FORM

### Layout
```
┌─────────────────────────────────────────┐
│  ← Powrót                               │
│                                         │
│       Cześć, [IMIĘ]! 👋                 │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  💍 INFORMACJE O ŚLUBIE           │  │
│  │                                   │  │
│  │  📅 Ślub: 15.08.2026, 14:00      │  │
│  │  🎉 Wesele: 15.08.2026, 17:00    │  │
│  │  📍 Dwór Czarownica               │  │
│  │      ul. Główna 1, Oszczywilk    │  │
│  │  🗺️  [Link do mapy]              │  │
│  │                                   │  │
│  │  👔 Dress Code: Elegancki         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  POTWIERDZENIE OBECNOŚCI          │  │
│  │                                   │  │
│  │  Będziesz z nami?                 │  │
│  │  ○ Tak, będę! ✅                  │  │
│  │  ○ Niestety nie mogę 😢           │  │
│  │  ○ Jeszcze nie wiem 🤔            │  │
│  │                                   │  │
│  │  [IF companion field not empty]   │  │
│  │  Osoba towarzysząca:              │  │
│  │  [COMPANION NAME or input]        │  │
│  │                                   │  │
│  │  Potrzebujesz noclegu?            │  │
│  │  ○ Tak ○ Nie ○ Sami ○ Wracam      │  │
│  │                                   │  │
│  │  Potrzebujesz transportu?         │  │
│  │  ○ Tak ○ Własny                   │  │
│  │                                   │  │
│  │  Dieta / Alergie:                 │  │
│  │  [textarea]                       │  │
│  │                                   │  │
│  │  Email (do potwierdzenia):        │  │
│  │  [input email]                    │  │
│  │                                   │  │
│  │  Telefon:                         │  │
│  │  [input tel]                      │  │
│  │                                   │  │
│  │  Dodatkowe informacje:            │  │
│  │  [textarea]                       │  │
│  │                                   │  │
│  │  [ WYŚLIJ POTWIERDZENIE 💌 ]      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [SUCCESS MESSAGE - after submit]       │
│  🎉 Dziękujemy! Do zobaczenia! ❤️       │
└─────────────────────────────────────────┘
```

### Features
- **Pre-filled Data**: 
  - Guest name shown in greeting
  - If companion name exists in DB, show it (read-only)
  - If companion = "TAK", show input field to add companion name
  
- **Conditional Fields**:
  - If status = "NIE" → hide accommodation/transport/dietary fields
  
- **Validation**:
  - Email format check
  - Phone format check (optional)
  - Required fields: status, email
  
- **Submit**:
  - Call `/api/submit-rsvp` with all data
  - Show success animation
  - Disable form after submission (can resubmit to update)

### API Call Example
```jsx
const handleSubmit = async (formData) => {
  try {
    const response = await fetch('/api/submit-rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: guest.token,
        status: formData.status,
        companion: formData.companion,
        accommodation: formData.accommodation,
        transport: formData.transport,
        dietary: formData.dietary,
        email: formData.email,
        phone: formData.phone,
        additionalInfo: formData.additionalInfo
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setSubmitted(true);
      // Show success message
    }
  } catch (err) {
    setError('Błąd zapisu. Spróbuj ponownie.');
  }
};
```

---

## 📄 PAGE 3: ADMIN PANEL

### Access
- URL: `/admin`
- Requires admin token: `admin_kamil_ola_2026`
- Same token input mechanism as landing page

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  💍 Admin Panel - Kamil & Ola                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📊 STATYSTYKI                                  │   │
│  │  👥 Zaproszeni: 89  ✅ TAK: 0  ❌ NIE: 0       │   │
│  │  🛏️  Noclegi: 0    🚗 Transport: 0             │   │
│  │  ⏰ Ostatnia aktualizacja: 12:30                │   │
│  │  [ ↻ Odśwież ]  [ ⬇ Eksport CSV ]              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🔍 [SEARCH: wpisz imię...]  [ Filter: Wszyscy ▼ ]     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ # │ Imię        │ Token   │ Status │ Nocleg │...│   │
│  ├───┼─────────────┼─────────┼────────┼────────┼───┤   │
│  │ 1 │ Jan Kowalski│ ABC123XY│ TAK ✅ │ TAK    │...│   │
│  │ 2 │ Anna Nowak  │ DEF456ZW│OCZEKUJE│        │...│   │
│  │ 3 │ ...         │ ...     │ ...    │ ...    │...│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [PAGINATION: ← 1 2 3 ... →]                           │
└─────────────────────────────────────────────────────────┘
```

### Features

**1. Statistics Card**
- Auto-calculate from guest data:
  - Total guests invited
  - Status breakdown (TAK/NIE/NIE WIEM/OCZEKUJE)
  - Accommodation needs (TAK/NIE/SAMI/WRACAM)
  - Transport needs (TAK/WŁASNY)
  - Companions count (total and known vs unknown)
- Real-time updates
- Visual charts/graphs (optional but nice)

**2. Search & Filter**
- **Search**: Real-time filter by name
- **Filter Dropdown**:
  - Wszyscy (All)
  - Status: TAK / NIE / NIE WIEM / OCZEKUJE
  - Kategoria: Rodzina / Przyjaciele / Praca / etc.
  - Nocleg: TAK / NIE / SAMI / WRACAM
  - Poinformowani: TAK / NIE

**3. Editable Table**
- Click cell → inline edit
- Save on blur or Enter key
- Visual feedback (flash green on save)
- Columns:
  - # (ID)
  - Imię i Nazwisko
  - Token (read-only)
  - 📞 Poinformowany (dropdown: TAK/NIE)
  - Kategoria (dropdown)
  - Status (dropdown: TAK/NIE/NIE WIEM/OCZEKUJE)
  - Osoba Tow. (text input)
  - Nocleg (dropdown)
  - Transport (dropdown)
  - Email
  - Telefon
  - Dieta
  - Dodatkowe Info
  - Uwagi (organizer notes)
  - ... (expand to show all)
- Sortable columns (click header to sort)
- Responsive: horizontal scroll on mobile

**4. Actions**
- **Refresh Button**: Reload data from Blobs
- **Export CSV**: Download all data as CSV file
- **Logout**: Clear admin token, return to landing

**5. Real-time Updates**
- Auto-refresh every 30 seconds (optional)
- Or manual refresh button
- Show "Last updated: [time]" timestamp

### API Integration
```jsx
// Load all guests
const loadGuests = async () => {
  try {
    const response = await fetch('/api/admin-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminToken: 'admin_kamil_ola_2026' })
    });
    
    const data = await response.json();
    if (data.success) {
      setGuests(data.guests);
      setStats(calculateStats(data.guests));
    }
  } catch (err) {
    console.error('Failed to load guests:', err);
  }
};

// Update guest
const updateGuest = async (guestId, field, value) => {
  try {
    const response = await fetch('/api/admin-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminToken: 'admin_kamil_ola_2026',
        guestId,
        updates: { [field]: value }
      })
    });
    
    const data = await response.json();
    if (data.success) {
      // Flash green animation
      flashCell(guestId, field);
    }
  } catch (err) {
    console.error('Update failed:', err);
  }
};
```

---

## 🔧 NETLIFY FUNCTIONS (Backend)

### Function 1: `check-token.js`
**Purpose**: Verify token and return guest information

**Request:**
```json
{
  "token": "ABC123XY"
}
```

**Response:**
```json
{
  "success": true,
  "guest": {
    "id": 1,
    "name": "Jan Kowalski",
    "token": "ABC123XY",
    "location": "Warszawa",
    "invitedBy": "Kamil",
    "category": "Rodzina",
    "status": "OCZEKUJE",
    "companion": "",
    "accommodation": "",
    "transport": "",
    "dietary": "",
    "email": "",
    "phone": "",
    "additionalInfo": "",
    "notes": ""
  }
}
```

**Logic:**
1. Get all guests from Blobs: `await getBlob('wedding-guests')`
2. Find guest by token: `guests.find(g => g.token === token)`
3. If found, return guest data
4. If not found, return `{ success: false, error: "Invalid token" }`

---

### Function 2: `submit-rsvp.js`
**Purpose**: Save guest's RSVP response

**Request:**
```json
{
  "token": "ABC123XY",
  "status": "TAK",
  "companion": "Anna Kowalska",
  "accommodation": "TAK",
  "transport": "WŁASNY",
  "dietary": "Wegetariańska",
  "email": "jan@example.com",
  "phone": "+48 123 456 789",
  "additionalInfo": "Przyjadę ok. 15:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Dziękujemy! Twoje potwierdzenie zostało zapisane."
}
```

**Logic:**
1. Get all guests from Blobs
2. Find guest by token
3. Update guest fields:
   ```javascript
   guest.status = status;
   guest.companion = companion;
   guest.accommodation = accommodation;
   guest.transport = transport;
   guest.dietary = dietary;
   guest.email = email;
   guest.phone = phone;
   guest.additionalInfo = additionalInfo;
   guest.updatedAt = new Date().toISOString();
   ```
4. Save back to Blobs: `await setBlob('wedding-guests', { ...data, lastUpdated: new Date().toISOString() })`
5. Return success

---

### Function 3: `admin-view.js`
**Purpose**: Get all guests (admin only)

**Request:**
```json
{
  "adminToken": "admin_kamil_ola_2026"
}
```

**Response:**
```json
{
  "success": true,
  "guests": [
    { /* guest 1 */ },
    { /* guest 2 */ },
    { /* ... */ }
  ],
  "metadata": {
    "totalGuests": 89,
    "lastUpdated": "2026-01-21T12:30:00Z"
  }
}
```

**Logic:**
1. Verify admin token: `if (adminToken !== 'admin_kamil_ola_2026') return 403`
2. Get all data from Blobs
3. Return everything

---

### Function 4: `admin-update.js`
**Purpose**: Update guest data (admin only)

**Request:**
```json
{
  "adminToken": "admin_kamil_ola_2026",
  "guestId": 1,
  "updates": {
    "status": "TAK",
    "informed": "TAK",
    "notes": "Potwierdzony telefonicznie"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Guest updated successfully"
}
```

**Logic:**
1. Verify admin token
2. Get all guests from Blobs
3. Find guest by ID
4. Apply updates: `Object.assign(guest, updates)`
5. Save back to Blobs
6. Return success

---

### Function 5: `init-data.js` (one-time setup)
**Purpose**: Initialize Blobs with guest data from `guests_data.json`

**Usage**: Call once after deploy to populate Blobs

**Logic:**
```javascript
import { getStore } from '@netlify/blobs';
import guestsData from '../../guests_data.json';

export default async (req, context) => {
  const store = getStore('wedding');
  
  // Check if data already exists
  const existing = await store.get('wedding-guests');
  if (existing) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Data already initialized' 
    }), { status: 400 });
  }
  
  // Set initial data
  await store.set('wedding-guests', JSON.stringify(guestsData));
  
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Data initialized successfully' 
  }), { status: 200 });
};
```

---

## 📦 NETLIFY BLOBS SETUP

### Installation
```bash
npm install @netlify/blobs
```

### Usage in Functions
```javascript
import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore('wedding');
  
  // Get data
  const data = await store.get('wedding-guests');
  const guestsData = JSON.parse(data);
  
  // Update data
  await store.set('wedding-guests', JSON.stringify(guestsData));
  
  return new Response(JSON.stringify({ success: true }));
};
```

### Key Points
- Store name: `'wedding'`
- Blob key: `'wedding-guests'`
- Data format: JSON string (must stringify/parse)
- Atomic writes: safe for concurrent updates

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```css
/* Mobile first */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Mobile Optimizations
- Large touch targets (min 44px)
- Simplified layouts
- Stack forms vertically
- Hide less important columns in admin table
- Swipe gestures for image slider

---

## 🎭 ANIMATIONS & EFFECTS

### Landing Page
```css
/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Button Hover
```css
button {
  @apply transform transition-all duration-300 hover:scale-105 hover:shadow-xl;
}
```

### Success Animation
```css
@keyframes checkmark {
  0% { transform: scale(0) rotate(45deg); }
  50% { transform: scale(1.2) rotate(45deg); }
  100% { transform: scale(1) rotate(45deg); }
}
```

---

## 🚀 DEPLOYMENT

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables (Netlify Dashboard)
None needed! Everything is in Blobs.

### Deployment Steps
1. Push code to GitHub
2. Connect repo to Netlify
3. Deploy
4. Call `/api/init-data` once to initialize Blobs
5. Done! 🎉

---

## 📋 CHECKLIST

### Frontend
- [ ] Landing page with background slider
- [ ] Token input with validation
- [ ] RSVP form with conditional fields
- [ ] Admin panel with editable table
- [ ] Search & filter functionality
- [ ] Statistics dashboard
- [ ] CSV export
- [ ] Mobile-responsive design
- [ ] Animations & transitions
- [ ] Error handling & loading states

### Backend
- [ ] `check-token.js` function
- [ ] `submit-rsvp.js` function
- [ ] `admin-view.js` function
- [ ] `admin-update.js` function
- [ ] `init-data.js` function
- [ ] Netlify Blobs integration
- [ ] CORS headers
- [ ] Input validation
- [ ] Error handling

### Data
- [ ] `guests_data.json` with 89 guests
- [ ] Proper JSON structure
- [ ] All fields populated

### Testing
- [ ] Test token validation
- [ ] Test RSVP submission
- [ ] Test admin login
- [ ] Test admin table editing
- [ ] Test on mobile devices
- [ ] Test with invalid inputs

---

## 🎨 ADDITIONAL NOTES

### Color Palette
```css
:root {
  --primary: #667eea;
  --primary-dark: #764ba2;
  --accent: #D4AF37;
  --success: #10B981;
  --error: #EF4444;
  --warning: #F59E0B;
  --text-dark: #1F2937;
  --text-light: #6B7280;
  --bg-light: #F9FAFB;
}
```

### Wedding Information (for RSVP page)
```javascript
const weddingInfo = {
  ceremony: {
    date: "15 sierpnia 2026",
    time: "14:00",
    location: "Kościół pw. Św. Anny, Oszczywilk"
  },
  reception: {
    date: "15 sierpnia 2026",
    time: "17:00",
    location: "Dwór Czarownica",
    address: "ul. Główna 1, 07-410 Oszczywilk",
    mapLink: "https://maps.google.com/?q=Dwór+Czarownica+Oszczywilk"
  },
  dressCode: "Elegancki (garnitur / sukienka wieczorowa)",
  parking: "Dostępny parking na miejscu",
  accommodation: "Lista noclegów w okolicy na stronie"
};
```

### Fonts (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
```

---

## 💡 EXTRA FEATURES (Optional)

If you have time, consider adding:
- **Photo Gallery**: Grid of wedding preparation photos
- **Gift Registry**: Link to registry or info about gifts
- **Countdown Timer**: Days until wedding
- **Music Requests**: Guest can request songs
- **Dietary Restrictions Info**: Common allergens list
- **FAQ Section**: Common questions answered
- **Weather Widget**: Forecast for wedding day
- **Guestbook**: Leave a message for the couple

---

## 🐛 ERROR HANDLING

### Frontend
- Show friendly error messages
- Retry failed requests
- Validate inputs before submission
- Handle network errors gracefully

### Backend
- Try-catch all async operations
- Return proper HTTP status codes
- Log errors for debugging
- Validate all inputs

### Example Error Response
```json
{
  "success": false,
  "error": "Invalid token",
  "message": "Nieprawidłowy kod. Sprawdź zaproszenie."
}
```

---

## 📚 TECH STACK

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Netlify Functions (Node.js)
- **Database**: Netlify Blobs (key-value store)
- **Hosting**: Netlify (free tier)
- **Styling**: Tailwind CSS + custom CSS
- **Icons**: Lucide React or Heroicons
- **Animations**: Framer Motion (optional)

---

## 🎯 SUCCESS CRITERIA

The website should:
1. ✅ Be beautiful and elegant
2. ✅ Work perfectly on mobile
3. ✅ Load fast (< 2 seconds)
4. ✅ Be intuitive to use
5. ✅ Handle 100+ guests without issues
6. ✅ Allow easy admin management
7. ✅ Be 100% free to host
8. ✅ Work reliably 24/7

---

## 🚀 LET'S BUILD THIS!

This is a complete specification. Follow it step by step, and you'll create a beautiful, professional wedding RSVP website that will impress all guests!

**Remember**: Mobile-first, beautiful design, smooth animations, and bulletproof functionality. This is a once-in-a-lifetime event! 💍✨

---

**Good luck, and may your code be bug-free! 🎉**
