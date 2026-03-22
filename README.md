# 🧠 Active Recall Study App

A **guided active recall study app** that structures study sessions through retrieval practice, metacognition, and spaced repetition.

## 🚀 Features

✅ **Priming Phase** – Activate prior knowledge with target questions  
✅ **Study Timer** – 25-min focused study with rotating prompts  
✅ **Recall (No Notes)** – Force retrieval from memory only  
✅ **Reflection** – Identify weak points and turn them into future questions  
✅ **Spaced Repetition** – Get reminded to revisit weak points  
✅ **Local Storage** – All data saved on your device  

---

## 📱 How to Use Locally

### Option 1: Simple File Open (Fastest)
1. Clone or download this repo
2. Open `index.html` in your browser
3. Start studying!

### Option 2: Local Server (Recommended)
If you have Python:
```bash
cd active-recall-app
python -m http.server 8000
```
Then visit: http://localhost:8000

---

## 🌐 Deploy to GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to https://github.com/new
2. Create a repo named `active-recall-app` (or any name)
3. Clone it locally

### Step 2: Add Files
Copy all files from this folder into your cloned repo:
```
active-recall-app/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── screens.js
│   └── storage.js
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Initial commit: Active Recall app"
git push origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch, `/root` folder
5. Save

Your app will be live at: `https://yourusername.github.io/active-recall-app`

---

## 🎯 The Perfect Study Flow

```
1. Home
   ↓
2. Create Session (Prime your brain)
   └─ Topic
   └─ Prior knowledge
   └─ Target questions (CRITICAL)
   └─ What's hardest?
   ↓
3. Study Timer (25 min)
   └─ Rotating prompts remind you to retrieve, not read
   ↓
4. Recall Phase (NO NOTES ALLOWED)
   └─ Brain dump everything
   └─ Answer your target questions
   ↓
5. Reflection
   └─ What was hardest?
   └─ What did you miss?
   └─ Turn weak points → next session's questions
   ↓
6. Save & Schedule
   └─ Weak points saved for spaced repetition
   └─ Reminders show up on home screen
   ↓
7. Quick Recall Mode (between sessions)
   └─ 30-second recall checks on weak points
```

---

## 💾 Data Storage

All data is stored in your browser's **LocalStorage**:
- Study sessions
- Weak points
- Statistics

**Note:** Data is device-specific. If you clear browser data, sessions are lost.

---

## 🎨 Design Philosophy

- ✨ **Minimal friction** – One action at a time
- 🧠 **Calm & focused** – Soft colors, smooth transitions
- 📚 **Effort encouraged** – Recalls never optional
- 💡 **Subtle guidance** – Nudge, don't lecture

---

## 🔥 Future Features (When Ready)

- Cloud sync (Firebase)
- Analytics dashboard
- Custom timer durations
- Streak tracking
- Dark mode
- Mobile app (React Native)

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Storage:** LocalStorage API
- **Hosting:** GitHub Pages
- **Design:** Mobile-first, no dependencies

---

## 📝 License

MIT – Use freely

---

**Happy studying! 🚀**
