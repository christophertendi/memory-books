# Memory Books - Couples' Digital Scrapbook

A beautiful, minimalist web application for couples to store and cherish their precious memories. Inspired by Studio Yord's aesthetic and Crossin's concept, built with React + Vite.

## ✨ Features

### 📚 Book Library
- Create multiple memory books (unlimited)
- Name books by year, location, or any special occasion
- Choose from 6 elegant book colors
- Each book can hold up to 10 memories
- Visual book spine design with memory counter

### 📸 Memory Management (CRUD)
- **Create**: Add memories with photos and captions
- **Read**: View memories in polaroid-style cards
- **Update**: Edit photos and captions anytime
- **Delete**: Remove memories with confirmation

### 🎨 Design Features
- Minimalist, clean interface
- Polaroid-style photo presentation
- Book spine aesthetic inspired by Studio Yord
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions

### 💾 Data Storage
- All data stored locally in browser (localStorage)
- No server required - works completely offline
- Each user's data is private to their browser
- Images stored as base64 or URLs

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`

## 📖 How to Use

### Creating a Book

1. Click "New Book" on the library page
2. Enter a name (e.g., "Summer 2024", "Paris Trip", "Our First Year")
3. Choose a color for the book spine
4. Click "Create Book"

### Adding Memories

1. Click on a book to open it
2. Click the floating "+" button
3. Upload a photo or paste an image URL
4. Write a caption
5. Click "Add Memory"

### Navigating Memories

- Use arrow buttons to flip through pages
- Edit icon: Modify the current memory
- Trash icon: Delete the current memory
- Back button: Return to library

### Editing Books

- Click the edit icon under any book
- Change the name or color
- Click "Update Book"

### Deleting

- Books: Click trash icon under the book (confirms before deleting)
- Memories: Click trash icon while viewing (confirms before deleting)

## 🎨 Book Colors

Choose from 6 elegant colors:
- **Black** - Classic and timeless
- **Navy** - Deep and sophisticated
- **Forest** - Natural and calming
- **Burgundy** - Rich and warm
- **Charcoal** - Modern and sleek
- **Slate** - Cool and contemporary

## 💡 Tips

### Image Sources

**Upload from device:**
- Click "Choose File" and select from your device
- Images are converted to base64 for storage

**Use image URLs:**
- Paste any image URL in the text input
- Works with Google Photos shared links, Imgur, etc.

**Getting shareable image URLs:**
1. **Google Photos**: Share photo → Copy link
2. **Imgur**: Upload → Copy direct link
3. **Unsplash**: Right-click → Copy image address

### Storage Limits

- **Books**: Unlimited
- **Memories per book**: 10 (keeps books manageable)
- **Image size**: Keep under 2MB for best performance
- **Browser storage**: Typically 5-10MB per domain

### Best Practices

1. **Compress images** before uploading for faster loading
2. **Organize by theme** - create books for different occasions
3. **Regular backups** - export your data periodically (see below)
4. **Clear captions** - write meaningful descriptions

## 🔧 Advanced Features

### Backup Your Data

```javascript
// Open browser console (F12)
// Copy all your books
console.log(localStorage.getItem('memoryBooks'));
// Save the output to a text file
```

### Restore Your Data

```javascript
// Open browser console (F12)
// Paste your saved data
localStorage.setItem('memoryBooks', 'YOUR_SAVED_DATA_HERE');
// Refresh the page
```

### Clear All Data

```javascript
// Warning: This deletes everything!
localStorage.removeItem('memoryBooks');
// Refresh the page
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Beautiful, consistent icons
- **localStorage** - Client-side data persistence
- **CSS3** - Custom styling, no frameworks
- **FileReader API** - Image upload handling

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Design Philosophy

Inspired by:
- **Studio Yord**: Minimalist aesthetic, book spine design
- **Crossin**: Concept of digital memory preservation
- **Polaroid**: Instant photo nostalgia

Principles:
- Clean, uncluttered interface
- Focus on content (memories)
- Intuitive navigation
- Emotional design (warmth, nostalgia)

## 📂 Project Structure

```
memory-books/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── src/
    ├── main.jsx        # React entry
    ├── App.jsx         # Main component (all logic)
    └── App.css         # All styles
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel auto-detects Vite
4. Deploy!

### Netlify

1. Build: `npm run build`
2. Publish: `dist` folder
3. Or connect GitHub for auto-deploy

### Static Hosting

1. Run `npm run build`
2. Upload `dist` folder to any static host
3. Works with GitHub Pages, Cloudflare Pages, etc.

## 🤝 For Couples

### Sharing Between Partners

Since data is stored locally, here are ways to share:

**Option 1: Same Device**
- Use the same computer/browser
- Both partners can add memories

**Option 2: Export/Import**
- Export data from one browser
- Import into partner's browser
- Requires manual sync

**Option 3: Deployment**
- Deploy to a shared URL
- Each browser maintains its own data
- Consider adding authentication for true sharing

## 📝 Future Enhancements

Potential features:
- Cloud sync between devices
- User authentication
- Shared books between partners
- Print/export to PDF
- Date-based filtering
- Search functionality
- Tags and categories
- Video support
- Comments on memories

## 💝 Made With Love

Perfect for:
- Anniversary gifts
- Memory preservation
- Couples' journaling
- Travel documentation
- Special occasions
- Daily moments

---

Built with ❤️ for preserving precious memories
