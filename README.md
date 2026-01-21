# 💍 Wedding RSVP Website - Kamil & Ola 2026

A beautiful, fully responsive wedding RSVP website built with React, Vite, Tailwind CSS, and Netlify Functions.

## 🌟 Features

- **Landing Page**: Token-based guest authentication
- **Personalized RSVP Form**: Custom form for each guest with conditional fields
- **Admin Panel**: Live editable table with statistics, search, and CSV export
- **Mobile-First Design**: Optimized for 90% mobile usage
- **Elegant Animations**: Smooth transitions and glass-morphism effects
- **Serverless Backend**: Netlify Functions with Netlify Blobs storage
- **100% Free Hosting**: Deploys to Netlify's free tier

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Netlify Functions (Node.js)
- **Database**: Netlify Blobs (key-value storage)
- **Hosting**: Netlify
- **Styling**: Tailwind CSS + custom CSS animations
- **Fonts**: Google Fonts (Playfair Display + Montserrat)

## 📁 Project Structure

```
wedding-rsvp/
├── public/
│   └── img/                    # Background images (placeholder)
├── src/
│   ├── pages/
│   │   ├── Landing.jsx         # Main landing page
│   │   ├── RSVP.jsx           # Personalized RSVP form
│   │   └── Admin.jsx          # Admin panel
│   ├── utils/
│   │   └── api.js             # API helper functions
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles + Tailwind
├── netlify/
│   └── functions/
│       ├── check-token.js     # Verify token & get guest info
│       ├── submit-rsvp.js     # Save guest response
│       ├── admin-view.js      # Get all guests (admin only)
│       ├── admin-update.js    # Update guest data (admin only)
│       └── init-data.js       # Initialize Blobs with guest data
├── guests_data.json           # Initial guest data (89 guests)
├── netlify.toml               # Netlify configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── package.json
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kamio90/ola-kamil-wesele.git
cd ola-kamil-wesele
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Local Development with Netlify Functions

To test Netlify Functions locally:

```bash
npm install -g netlify-cli
netlify dev
```

This will start both the Vite dev server and the Netlify Functions emulator.

## 📦 Deployment to Netlify

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit: Wedding RSVP website"
git push origin main
```

### Step 2: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select this repository
4. Configure build settings (should auto-detect):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. Click "Deploy site"

### Step 3: Initialize Guest Data

After deployment, you need to initialize the Netlify Blobs with guest data:

1. Visit: `https://your-site.netlify.app/api/init-data`
2. You should see: `{"success": true, "message": "Data initialized successfully"}`

If you need to reinitialize (careful - this will overwrite data):
- Manually delete the blob from Netlify dashboard, then call the endpoint again

### Step 4: Test the Website

1. Go to your site: `https://your-site.netlify.app`
2. Test with a token from `guests_data.json` (e.g., `2GEWX2VM`)
3. Test admin panel: `/admin` with token `admin_kamil_ola_2026`

## 🎨 Design System

### Colors

- **Primary**: `#667eea` (Purple)
- **Primary Dark**: `#764ba2` (Dark Purple)
- **Accent**: `#D4AF37` (Gold/Champagne)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Orange)

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Montserrat (sans-serif)

### Animations

- Floating animation for decorative elements
- Fade-in-up for page transitions
- Shake animation for error states
- Glass-morphism effects on cards

## 🔐 Admin Panel

Access the admin panel at `/admin` with the admin token:

```
admin_kamil_ola_2026
```

### Admin Features

- **Statistics Dashboard**: Real-time overview of RSVPs
- **Editable Table**: Click any cell to edit guest information
- **Search & Filter**: Find guests quickly
- **CSV Export**: Download all guest data
- **Live Updates**: See changes immediately

## 📱 Mobile Optimization

- Large touch targets (min 44px height)
- Simplified layouts on small screens
- Stack forms vertically
- Horizontal scroll for admin table
- Large, readable text

## 🔧 API Endpoints

All API endpoints are prefixed with `/api/`:

- `POST /api/check-token` - Verify guest token
- `POST /api/submit-rsvp` - Submit RSVP form
- `POST /api/admin-view` - Get all guests (admin only)
- `POST /api/admin-update` - Update guest data (admin only)
- `GET /api/init-data` - Initialize data (one-time setup)

## 📊 Guest Data Structure

```json
{
  "id": 1,
  "name": "Kamil Musiał",
  "token": "2GEWX2VM",
  "informed": "",
  "location": "Oszczywilk",
  "invitedBy": "Kamil",
  "category": "Rodzina",
  "status": "TAK",
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
```

## 🐛 Troubleshooting

### Functions not working locally

- Make sure you're using `netlify dev` instead of `npm run dev`
- Check that `@netlify/blobs` is installed

### Tailwind styles not applying

- Make sure `tailwind.config.js` and `postcss.config.js` are in the root
- Check that `@tailwind` directives are in `src/index.css`

### Data not persisting

- Make sure you've called `/api/init-data` after deployment
- Check Netlify Blobs in the Netlify dashboard

### CORS errors

- Netlify Functions handle CORS automatically
- Make sure you're using the deployed URL, not localhost

## 📝 License

This is a private wedding website. All rights reserved.

## 💖 Credits

Built with love for Kamil & Ola's wedding on August 15, 2026.

---

**Wedding Details:**
- Date: 15 sierpnia 2026
- Ceremony: 14:00
- Reception: 17:00
- Venue: Dwór Czarownica, Oszczywilk

**Total Guests**: 89

🎉 Do zobaczenia na weselu! 💍
