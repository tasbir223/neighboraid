# 🤝 NeighborAid — Community Help Hub

> A community platform that connects people who need help with people who are willing to give it.

![NeighborAid](https://neighboraid.vercel.app)

## 🌐 Live Demo

**[https://neighboraid.vercel.app](https://neighboraid.vercel.app)**

---

## 📖 About

NeighborAid is a full-stack web application designed to strengthen local communities by making it easier for neighbors to help one another. Whether you need tutoring, food assistance, moving help, or someone to run an errand — NeighborAid connects you with people nearby who are ready to help.

---

## ✨ Features

- **User Authentication** — Sign up, log in, and reset your password securely via Supabase Auth
- **Post Help Requests** — Create posts describing what kind of help you need
- **Offer Help** — Post services you're willing to offer to your community
- **Browse & Filter** — Search posts by keyword, category, type, and location
- **Near Me** — Detect your location automatically and filter posts in your area
- **Messaging** — Contact posters directly through the platform
- **Profile Settings** — Edit your name, bio, location, avatar color, and profile photo
- **Report Posts** — Flag inappropriate content for review
- **Contact Form** — Send messages to the NeighborAid team via email

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, CSS Modules |
| Build Tool | Vite |
| Backend / Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Email | EmailJS |
| Hosting | Vercel |
| Version Control | GitHub |

---

## 📁 Project Structure

```
neighboraid/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with dropdown menu
│   │   ├── PostCard.jsx        # Reusable post card component
│   │   ├── PostDetailModal.jsx # Post detail and messaging modal
│   │   └── UI.jsx              # Shared UI components (Button, Alert, etc.)
│   ├── context/
│   │   └── AppContext.jsx      # Global state and Supabase integration
│   ├── pages/
│   │   ├── Landing.jsx         # Home page
│   │   ├── Browse.jsx          # Browse and filter posts
│   │   ├── Post.jsx            # Create a new post
│   │   ├── Login.jsx           # Login with password reset
│   │   ├── Signup.jsx          # User registration
│   │   ├── Profile.jsx         # User profile and settings
│   │   ├── Contact.jsx         # Contact form
│   │   └── ResetPassword.jsx   # Password reset page
│   ├── supabase.js             # Supabase client config
│   └── App.jsx                 # Routes and app structure
├── index.html
├── package.json
└── vite.config.js
```

---

## 🗄 Database Schema

```sql
profiles       -- User profiles (name, bio, location, avatar)
posts          -- Help requests and offers
messages       -- Messages sent between users
reports        -- Reported posts
contact_messages -- Contact form submissions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Supabase account
- An EmailJS account

### Installation

```bash
# Clone the repository
git clone https://github.com/tasbir223/neighboraid.git

# Navigate into the project
cd neighboraid

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Setup

Update `src/supabase.js` with your Supabase project URL and anon key:

```js
const SUPABASE_URL = 'your-project-url'
const SUPABASE_ANON_KEY = 'your-anon-key'
```

Update `src/pages/Contact.jsx` with your EmailJS credentials:

```js
const SERVICE_ID = 'your-service-id'
const TEMPLATE_ID = 'your-template-id'
const PUBLIC_KEY = 'your-public-key'
```

---

## 🔒 Security

- Passwords are hashed by Supabase Auth (bcrypt)
- Row Level Security (RLS) enabled on all tables
- Users can only edit or delete their own posts
- Anon key is read-only for public data

---

## 👥 Authors

- **Tasbir Ahammed**
- **Soowlih Compaore**

---

## 📄 License

This project was created as a Software Engineering course project.

---

## 🙏 Acknowledgements

- [Supabase](https://supabase.com) — Backend and authentication
- [EmailJS](https://emailjs.com) — Contact form email service
- [Vercel](https://vercel.com) — Hosting and deployment
- [Vite](https://vitejs.dev) — Build tool
- [React](https://react.dev) — Frontend framework
