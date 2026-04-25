# 📋 TaskFlow — Student Task Manager

A modern, responsive task management web application built with vanilla HTML, CSS, and JavaScript. Designed with a premium SaaS-inspired UI featuring glassmorphism, smooth animations, and dark mode support.

![TaskFlow Preview](https://img.shields.io/badge/Status-Ready-brightgreen) ![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Add Tasks** | Quickly add tasks with a clean input form |
| **Edit Tasks** | Modify task text and priority via a modal dialog |
| **Delete Tasks** | Remove tasks with smooth slide-out animation |
| **Mark Complete** | Toggle tasks as done with animated checkboxes |
| **Priority Levels** | Assign Low / Medium / High priority with color-coded indicators |
| **Filter View** | View All, Pending, or Completed tasks from the sidebar |
| **Progress Ring** | Visual SVG progress ring showing completion percentage |
| **Dark Mode** | Toggle between light and dark themes (respects system preference) |
| **Persistent Storage** | All tasks and theme preference saved in `localStorage` |
| **Responsive Design** | Fully responsive with collapsible sidebar on mobile |
| **Toast Notifications** | Non-intrusive feedback on user actions |
| **Micro-animations** | Smooth transitions on every interaction |

---

## 🗂 Project Structure

```
student-task-manager/
├── index.html          # Main HTML entry point
├── css/
│   └── style.css       # Complete design system & styles
├── js/
│   └── app.js          # Modular application logic
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari)

### Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/student-task-manager.git
   cd student-task-manager
   ```
2. Open `index.html` in your browser:
   ```bash
   # macOS
   open index.html

   # Windows
   start index.html

   # Linux
   xdg-open index.html
   ```

   Or use a live server extension in VS Code for hot-reloading.

---

## 🏗 Architecture

The JavaScript follows a **modular IIFE (Immediately Invoked Function Expression)** pattern:

| Module | Responsibility |
|---|---|
| `Storage` | Encapsulates all `localStorage` read/write operations |
| `TaskModel` | Pure data layer — CRUD operations on tasks array |
| `Toast` | Lightweight notification system |
| `Theme` | Dark/light mode management with system pref detection |
| `Greeting` | Time-of-day contextual greeting |
| `UI` | All DOM rendering, event handling, and user interaction |

---

## 🎨 Design System

- **Typography**: Inter (Google Fonts) — clean, modern, highly readable
- **Icons**: Phosphor Icons — lightweight, consistent icon set
- **Colors**: Curated indigo/violet palette with HSL-based tokens
- **Effects**: Glassmorphism, animated background blobs, SVG progress ring
- **Themes**: Full light/dark mode via CSS custom properties

---

## 🔮 Future Improvements

- [ ] **Due Dates** — Add date picker for task deadlines with overdue indicators
- [ ] **Categories/Tags** — Organize tasks by subject, course, or custom labels
- [ ] **Drag & Drop** — Reorder tasks with drag-and-drop sorting
- [ ] **Search** — Full-text search across all tasks
- [ ] **Subtasks** — Break tasks into smaller checklist items
- [ ] **Export/Import** — Backup and restore tasks as JSON
- [ ] **PWA Support** — Add service worker for offline functionality
- [ ] **Cloud Sync** — Optional Firebase/Supabase backend for cross-device sync
- [ ] **Keyboard Shortcuts** — Power-user shortcuts (e.g., `Ctrl+N` for new task)
- [ ] **Pomodoro Timer** — Built-in focus timer for task execution
- [ ] **Analytics Dashboard** — Weekly/monthly task completion trends

---

## 🛠 Technologies Used

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, flexbox, grid, animations, media queries
- **JavaScript (ES6+)** — Modules, template literals, destructuring, arrow functions

No frameworks. No build tools. Pure web standards.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 🙌 Credits

- [Inter Font](https://rsms.me/inter/) by Rasmus Andersson
- [Phosphor Icons](https://phosphoricons.com/) by Helena Zhang & Tobias Fried

---

<p align="center">
  Built with ❤️ for students, by students.
</p>
