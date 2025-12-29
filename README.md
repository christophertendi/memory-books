# Memory Books - Couples' Digital Scrapbook

A beautiful, minimalist web application for couples to store and cherish their precious memories. Inspired by Studio Yord's aesthetic and Crossin's concept, built with React + Vite and Firebase.

## ✨ Features

### 🔐 Authentication & Security
- **Email/Password Authentication** with Firebase
- **Google Sign-In** for quick access
- **Email Verification** required for security
- **Secure Cloud Storage** - all data protected by Firebase rules
- **Input Validation** - XSS and injection attack prevention
- **Session Management** - stay signed in across devices

### 📚 Book Library
- Create multiple memory books (unlimited)
- Name books by year, location, or any special occasion
- **Custom Book Cover Designer**:
  - 12 preset colors + custom color picker
  - 6 pattern options (solid, gradient, dots, stripes, grid, diagonal)
  - 3 text colors (white, black, gold)
  - Live preview while designing
- Each book can hold up to 10 memories
- Visual book spine design with memory counter
- **Desktop hover actions**: Edit, Design, Delete
- **Mobile-optimized** touch interface

### 📸 Memory Management (CRUD)
- **Create**: Add memories with photos and captions
- **Read**: View memories in interactive polaroid-style cards
- **Update**: Edit photos, captions, and categories anytime
- **Delete**: Remove memories with confirmation
- **Drag & Drop**: Reposition polaroids on the page (desktop & mobile)
- **Rotation**: Random tilt for authentic polaroid feel
- **Z-index**: Click to bring photos to front
- **Categories**: Organize memories with custom tags
- **Filter by Category**: Quick access to specific memories
- **Inner & Outer Captions**: Add text inside and outside polaroids

### 🎨 Design Features
- **Minimal Beige/Monochrome Aesthetic**
- Polaroid-style photo presentation with realistic shadows
- Book spine design inspired by Studio Yord
- **Fully Responsive**: Mobile, tablet, desktop optimized
- Smooth animations and transitions
- **Book stacking effect** with drop animations
- **Binder ring aesthetic** (optional)
- Mobile burger menu with logout

### 💾 Data Storage
- **Firebase Firestore** - secure cloud database
- **Real-time sync** across all devices
- **Automatic saving** - changes persist immediately
- **User isolation** - each user's data is private
- **Email verification required** before database access
- Images stored as base64 (up to 5MB per image)
- **1MB document size limit** per user (enforced)

### 🛡️ Security Features
- **Firebase Security Rules** - database access restricted to owners
- **Input Sanitization** - all user input validated and cleaned
- **Image Validation** - file type, size, and content verified
- **Rate Limiting** - protection against abuse
- **Security Headers** - XSS, clickjacking, CSRF protection
- **Environment Variables** - API keys protected
- **Content Security Policy** - prevent malicious scripts
- **Error Handling** - safe, user-friendly error messages

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- Vercel account (for deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/memory-books.git
cd memory-books

# Install dependencies
npm install

# Create environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable **Email/Password** and **Google** authentication
   - Create **Firestore Database**

2. **Configure Firebase**
   - Copy your Firebase config from Project Settings
   - Add to `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Deploy Security Rules**
   - Go to Firestore Database → Rules
   - Copy contents from `firestore.rules`
   - Publish rules

4. **Enable Google Sign-In**
   - Authentication → Sign-in method → Google → Enable
   - Add authorized domains (localhost, your Vercel domain)

## 📖 How to Use

### Getting Started

1. **Sign Up**
   - Enter email and password (min 8 chars, 1 uppercase, 1 symbol)
   - Verify email via link sent to inbox
   - Or use "Continue with Google" for instant access

2. **Sign In**
   - Enter credentials or use Google
   - Stay signed in across devices

### Creating a Book

1. Click "New Book" on the library page
2. Enter a name (e.g., "Summer 2024", "Paris Trip", "Our First Year")
3. Choose a color for the book spine
4. Click "Create Book"

### Designing Book Covers

1. Click the palette icon (desktop) or Edit button (mobile)
2. Select "Design Book Cover"
3. **Choose background color** (12 presets + custom)
4. **Select pattern** (solid, gradient, dots, stripes, grid, diagonal)
5. **Pick text color** (white, black, or gold)
6. Watch live preview update
7. Click "Save Design"

### Adding Memories

1. Click on a book to open it
2. Click the floating "+" button
3. Upload a photo (max 5MB, JPG/PNG/WebP)
4. Write captions:
   - **Inner caption**: Text inside the polaroid
   - **Outer caption**: Text below the polaroid
5. Assign a category (optional)
6. Click "Add Memory"

### Interacting with Polaroids

**Desktop:**
- **Drag**: Click and hold to reposition
- **Bring to Front**: Click any polaroid
- **Edit**: Click edit icon
- **Delete**: Click trash icon

**Mobile:**
- **Drag**: Touch and hold to move
- **Tap**: Bring to front
- **Edit**: Tap edit icon
- **Delete**: Tap trash icon

### Filtering Memories

1. Click "Category" button (with tag icon)
2. Select category to filter
3. Click "All" to show everything

### Navigating Memories

- Use arrow buttons to flip through pages
- Edit icon: Modify current memory or page title
- Back button: Return to library
- Logout: Burger menu → Logout

### Editing Books

**Desktop:**
- Hover over book → Click Edit icon
- Choose: Edit Title, Design Cover, or Delete

**Mobile:**
- Tap book → Click Edit button
- Choose action from modal

## 🎨 Book Cover Options

### Background Colors (12 Presets + Custom)
- Black, Navy, Forest Green, Burgundy
- Charcoal, Slate, Purple, Brown
- Teal, Blue, Orange, Dark Purple
- **+ Custom Color Picker**

### Patterns
- **Solid** - Clean, single color
- **Gradient** - Subtle depth
- **Dots** - Playful texture
- **Stripes** - Classic diagonal
- **Grid** - Structured pattern
- **Diagonal** - Modern geometric

### Text Colors
- **White** - High contrast
- **Black** - Professional
- **Gold** - Elegant accent

## 💡 Tips

### Image Guidelines

**Supported formats:**
- JPG, JPEG, PNG, WebP
- Maximum size: 5MB per image
- Automatic compression to optimize storage

**Best practices:**
1. Use high-quality photos (not blurry)
2. Compress before upload for faster loading
3. Portrait orientation works best for polaroids
4. Keep meaningful captions concise

### Storage Limits

- **Books**: Unlimited
- **Memories per book**: 10
- **Total data per user**: ~1MB (Firestore limit)
- **Images**: 5MB each, automatically validated

### Organization Tips

1. **Create themed books** (vacations, holidays, daily life)
2. **Use categories** to filter memories within books
3. **Write meaningful captions** for context
4. **Design covers** to match book themes
5. **Regular cleanup** - remove unwanted memories

## 🔐 Security Best Practices

### For Users
- ✅ Use strong, unique passwords
- ✅ Verify your email before using
- ✅ Don't share login credentials
- ✅ Log out on shared devices
- ✅ Keep browser updated

### For Developers
- ✅ Never commit `.env` to git
- ✅ Use environment variables for secrets
- ✅ Keep dependencies updated
- ✅ Regular security audits
- ✅ Monitor Firebase logs

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **CSS3** - Custom styling (no frameworks)

### Backend & Services
- **Firebase Authentication** - User management
- **Firebase Firestore** - Cloud database
- **Firebase Security Rules** - Access control

### Security
- **Input Validation** - XSS prevention
- **Image Validation** - Malicious file protection
- **CSP Headers** - Content security
- **Environment Variables** - Secret management

### Deployment
- **Vercel** - Hosting and CI/CD
- **GitHub** - Version control

## 📱 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Minimum requirements:**
- Modern browser with ES6+ support
- JavaScript enabled
- Cookies enabled (for authentication)

## 🎯 Design Philosophy

Inspired by:
- **Studio Yord**: Minimalist aesthetic, book spine design
- **Crossin**: Digital memory preservation concept
- **Polaroid**: Instant photo nostalgia

Principles:
- **Minimal & clean** interface
- **Focus on content** (memories over UI)
- **Intuitive** navigation
- **Emotional design** (warmth, nostalgia, intimacy)
- **Mobile-first** responsive design
- **Security-first** architecture

## 📂 Project Structure

```
memory-books/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── vercel.json             # Security headers
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── firestore.rules         # Firebase security rules
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main app component
    ├── App.css             # Global styles
    ├── components/
    │   ├── Auth.jsx        # Authentication UI
    │   ├── Auth.css        # Auth styles
    │   ├── BookLibrary.jsx # Library view
    │   ├── BookLibrary.css # Library styles
    │   ├── ScrapbookPage.jsx   # Memory page
    │   ├── ScrapbookPage.css   # Page styles
    │   ├── BookCoverDesigner.jsx   # Cover designer
    │   └── BookCoverDesigner.css   # Designer styles
    ├── services/
    │   ├── authService.js      # Authentication logic
    │   └── firestoreService.js # Database operations
    ├── firebase/
    │   └── config.js           # Firebase setup
    └── utils/
        ├── validation.js       # Input validation
        ├── imageValidator.js   # Image security
        └── errorHandler.js     # Error management
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub**
   - Push code to GitHub repository
   - Connect to Vercel
   - Vercel auto-detects Vite config

2. **Add Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Add all `VITE_*` variables from `.env`

3. **Deploy**
   - Vercel automatically builds and deploys
   - Get your production URL

4. **Update Firebase**
   - Add Vercel domain to Firebase authorized domains
   - Update Google Sign-In authorized origins

### Manual Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy dist/ folder to any static host
```

## 🤝 For Couples

### Sharing Memories

**Real-time Cloud Sync:**
- Both partners create accounts
- Each has their own books and memories
- Data syncs across all devices automatically

**Collaborative Options:**

**Option 1: Shared Account**
- Create one account for both partners
- Share login credentials
- Both can add/edit memories
- ⚠️ Less secure, not recommended

**Option 2: Individual Accounts**
- Each partner has their own account
- Share photos via other means
- Duplicate favorite memories in both accounts
- ✅ More secure, recommended

**Option 3: Future Enhancement**
- Shared books feature (planned)
- Invite partner to contribute
- Real-time collaboration
- Requires additional development

### Privacy & Security

- All data is **end-to-end encrypted** in transit (HTTPS)
- **Firebase Security Rules** prevent unauthorized access
- Only you can see your memories
- **Email verification** required
- **Strong password** enforcement

## 📈 Future Enhancements

Planned features:
- [ ] Shared books between partners
- [ ] PDF export for printing
- [ ] Date-based timeline view
- [ ] Search functionality
- [ ] Video support (short clips)
- [ ] Location tagging
- [ ] Advanced filtering (date range, multiple categories)
- [ ] Bulk upload
- [ ] Dark mode
- [ ] Custom themes
- [ ] Mobile app (React Native)
- [ ] Reminders to add memories

## 🐛 Troubleshooting

### Authentication Issues
- **"Email not verified"**: Check spam folder for verification email
- **"Invalid credentials"**: Reset password via "Forgot Password"
- **Google Sign-In fails**: Check popup blockers

### Data Not Saving
- **Check internet connection**
- **Verify email is verified**
- **Check Firebase console for errors**
- **Clear browser cache and retry**

### Images Not Uploading
- **File too large**: Max 5MB per image
- **Wrong format**: Use JPG, PNG, or WebP
- **Total data limit**: Delete old memories to free space

### Performance Issues
- **Too many large images**: Compress before upload
- **Browser storage full**: Clear old data
- **Slow connection**: Wait for sync to complete

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by Studio Yord's minimalist design
- Crossin's memory preservation concept
- Polaroid's instant photography nostalgia
- Firebase for secure cloud infrastructure
- Lucide for beautiful icons

## 💖 Made With Love

Perfect for:
- Anniversary gifts
- Memory preservation
- Couples' journaling
- Travel documentation
- Special occasions
- Daily moments
- Long-distance relationships
- Wedding memories

---

Built with ❤️ for preserving precious moments, one memory at a time.

**Start creating your memory books today!** 📚✨