# ⚡ 1-Minute Install - Just the Commands

**Prerequisites:** Node.js 18+ and npm installed

---

## 🚀 Copy-Paste Installation

```bash
# Install all dependencies (wait ~2 minutes)
npm install react@18.3.1 react-dom@18.3.1 next@14.2.5 lucide-react@0.427.0 clsx@2.1.1 && \
npm install --save-dev typescript@5.5.4 @types/react@18.3.3 @types/react-dom@18.3.0 @types/node@20.14.12 tailwindcss@3.4.7 postcss@8.4.39 autoprefixer@10.4.19 eslint@8.57.0 eslint-config-next@14.2.5

# Create directories and copy files
mkdir -p src/components src/app/dashboard && \
cp Navigation.tsx AlertSystem.tsx LiveClock.tsx src/components/ && \
cp dashboard-page.tsx src/app/dashboard/page.tsx

# Start server
npm run dev
```

**Done!** Open: http://localhost:3000/dashboard

---

## 📦 Just the Package Names

If you prefer to install manually:

```bash
# Production
npm install react@18.3.1 react-dom@18.3.1 next@14.2.5 lucide-react@0.427.0

# Development
npm install --save-dev typescript@5.5.4 @types/react@18.3.3 @types/node@20.14.12 tailwindcss@3.4.7
```

---

## 🔥 Even Faster (if you have package.json)

Add to your `package.json`:

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "next": "14.2.5",
    "lucide-react": "0.427.0",
    "clsx": "2.1.1"
  },
  "devDependencies": {
    "typescript": "5.5.4",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@types/node": "20.14.12",
    "tailwindcss": "3.4.7",
    "postcss": "8.4.39",
    "autoprefixer": "10.4.19",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5"
  }
}
```

Then run:
```bash
npm install
```

---

## ✅ Quick Check

```bash
# Should see these files:
ls src/components/Navigation.tsx
ls src/components/AlertSystem.tsx
ls src/components/LiveClock.tsx
ls src/app/dashboard/page.tsx

# Start server:
npm run dev

# Open: http://localhost:3000/dashboard
```

---

## 🐛 If Something Breaks

```bash
# Nuclear option - start fresh:
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

---

**That's it!** See QUICKSTART.md for detailed guide.
