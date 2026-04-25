/**
 * ══════════════════════════════════════════════════════════════
 *  Student Task Manager — app.js
 *  Modular, well-structured application entry point.
 *  All logic is organized into focused modules below.
 * ══════════════════════════════════════════════════════════════
 */

// ─────────────────────── Storage Module ───────────────────────
// Encapsulates all localStorage interactions in one place.
const Storage = (() => {
  const TASKS_KEY = 'taskflow_tasks';
  const THEME_KEY = 'taskflow_theme';

  return {
    /** Retrieve all tasks from localStorage */
    getTasks() {
      try {
        return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
      } catch {
        return [];
      }
    },

    /** Persist the entire tasks array */
    saveTasks(tasks) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    },

    /** Get saved theme preference ('light' | 'dark' | null) */
    getTheme() {
      return localStorage.getItem(THEME_KEY);
    },

    /** Save the current theme */
    saveTheme(theme) {
      localStorage.setItem(THEME_KEY, theme);
    },
  };
})();

// ─────────────────────── Task Model ───────────────────────
// Pure data helpers — no DOM interaction.
const TaskModel = (() => {
  let tasks = Storage.getTasks();

  /** Generate a simple unique ID */
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  return {
    getAll()       { return tasks; },
    getById(id)    { return tasks.find(t => t.id === id); },
    getPending()   { return tasks.filter(t => !t.completed); },
    getCompleted() { return tasks.filter(t =>  t.completed); },

    /** Create a new task object and persist */
    add(text, priority = 'low') {
      const task = {
        id: uid(),
        text: text.trim(),
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      tasks.unshift(task);
      Storage.saveTasks(tasks);
      return task;
    },

    /** Update an existing task's text and/or priority */
    update(id, updates) {
      const task = tasks.find(t => t.id === id);
      if (!task) return null;
      Object.assign(task, updates);
      Storage.saveTasks(tasks);
      return task;
    },

    /** Toggle completed status */
    toggleComplete(id) {
      const task = tasks.find(t => t.id === id);
      if (!task) return null;
      task.completed = !task.completed;
      Storage.saveTasks(tasks);
      return task;
    },

    /** Remove a task */
    remove(id) {
      tasks = tasks.filter(t => t.id !== id);
      Storage.saveTasks(tasks);
    },

    /** Remove all completed tasks */
    clearCompleted() {
      tasks = tasks.filter(t => !t.completed);
      Storage.saveTasks(tasks);
    },
  };
})();

// ─────────────────────── Toast Module ───────────────────────
// Lightweight notification system.
const Toast = (() => {
  const container = document.getElementById('toast-container');
  const ICONS = {
    success: 'ph ph-check-circle',
    error:   'ph ph-warning-circle',
    info:    'ph ph-info',
  };

  return {
    show(message, type = 'success', duration = 2500) {
      const el = document.createElement('div');
      el.className = `toast toast--${type}`;
      el.innerHTML = `<i class="${ICONS[type]}"></i><span>${message}</span>`;
      container.appendChild(el);

      setTimeout(() => {
        el.classList.add('toast--out');
        el.addEventListener('animationend', () => el.remove());
      }, duration);
    },
  };
})();

// ─────────────────────── Theme Module ───────────────────────
const Theme = (() => {
  const toggle = document.getElementById('theme-toggle');
  const icon   = toggle.querySelector('i');

  /** Apply theme to document and update icon */
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    Storage.saveTheme(theme);
  }

  /** Initialize theme based on saved pref → system pref fallback */
  function init() {
    const saved = Storage.getTheme();
    if (saved) {
      apply(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      apply('dark');
    }

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      apply(current === 'dark' ? 'light' : 'dark');
    });
  }

  return { init };
})();

// ─────────────────────── Greeting Module ───────────────────────
const Greeting = (() => {
  const el = document.getElementById('greeting-text');

  function update() {
    const h = new Date().getHours();
    let greeting;
    if (h < 12)      greeting = 'Good Morning ☀️';
    else if (h < 17) greeting = 'Good Afternoon 🌤️';
    else if (h < 21) greeting = 'Good Evening 🌅';
    else              greeting = 'Good Night 🌙';
    el.textContent = greeting;
  }

  return { init: update };
})();

// ─────────────────────── UI / Rendering ───────────────────────
const UI = (() => {
  // DOM references
  const taskList       = document.getElementById('task-list');
  const emptyState     = document.getElementById('empty-state');
  const addForm        = document.getElementById('add-task-form');
  const taskInput      = document.getElementById('task-input');
  const prioritySel    = document.getElementById('priority-selector');
  const clearBtn       = document.getElementById('clear-completed');
  const listTitle      = document.getElementById('task-list-title');

  // Filter nav
  const filterBtns     = document.querySelectorAll('.nav-btn[data-filter]');
  const countAll       = document.getElementById('count-all');
  const countPending   = document.getElementById('count-pending');
  const countCompleted = document.getElementById('count-completed');

  // Progress ring
  const ring           = document.getElementById('progress-ring');
  const percentLabel   = document.getElementById('progress-percent');
  const statsCompleted = document.getElementById('stats-completed');
  const statsTotal     = document.getElementById('stats-total');

  // Edit modal elements
  const modal          = document.getElementById('edit-modal');
  const editForm       = document.getElementById('edit-task-form');
  const editIdField    = document.getElementById('edit-task-id');
  const editInput      = document.getElementById('edit-task-input');
  const editPrioritySel = document.getElementById('edit-priority-selector');
  const modalCloseBtn  = document.getElementById('modal-close');
  const modalCancelBtn = document.getElementById('modal-cancel');

  // Sidebar (mobile)
  const sidebar        = document.getElementById('sidebar');
  const sidebarToggle  = document.getElementById('sidebar-toggle');
  const sidebarClose   = document.getElementById('sidebar-close');

  let currentFilter = 'all';
  let selectedPriority = 'low';

  // ─── Helpers ───

  /** Format a date string into a friendly relative/absolute label */
  function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60_000)       return 'Just now';
    if (diff < 3_600_000)    return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000)   return `${Math.floor(diff / 3_600_000)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  /** Build a single task list-item element */
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' task-item--completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <label class="task-item__check">
        <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark as ${task.completed ? 'pending' : 'completed'}" />
        <div class="checkmark"><i class="ph ph-check"></i></div>
      </label>
      <div class="task-item__priority task-item__priority--${task.priority}"></div>
      <div class="task-item__content">
        <p class="task-item__text">${escapeHTML(task.text)}</p>
        <div class="task-item__meta">
          <span>${capitalize(task.priority)} priority</span>
          <span>•</span>
          <span>${formatDate(task.createdAt)}</span>
        </div>
      </div>
      <div class="task-item__actions">
        <button class="task-action task-action--edit" aria-label="Edit task" title="Edit">
          <i class="ph ph-pencil-simple"></i>
        </button>
        <button class="task-action task-action--delete" aria-label="Delete task" title="Delete">
          <i class="ph ph-trash"></i>
        </button>
      </div>
    `;
    return li;
  }

  /** Escape HTML to prevent XSS */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ─── Rendering ───

  /** Re-render the task list based on current filter */
  function render() {
    const all       = TaskModel.getAll();
    const pending   = TaskModel.getPending();
    const completed = TaskModel.getCompleted();

    // Determine which tasks to show
    let visible;
    switch (currentFilter) {
      case 'pending':   visible = pending;   listTitle.textContent = 'Pending Tasks'; break;
      case 'completed': visible = completed; listTitle.textContent = 'Completed Tasks'; break;
      default:          visible = all;       listTitle.textContent = 'All Tasks';
    }

    // Update counts
    countAll.textContent       = all.length;
    countPending.textContent   = pending.length;
    countCompleted.textContent = completed.length;

    // Update progress ring
    const total = all.length;
    const done  = completed.length;
    const pct   = total ? Math.round((done / total) * 100) : 0;
    const circumference = 2 * Math.PI * 52; // radius = 52
    ring.style.strokeDashoffset = circumference - (circumference * pct / 100);
    percentLabel.textContent    = `${pct}%`;
    statsCompleted.textContent  = done;
    statsTotal.textContent      = total;

    // Render list
    taskList.innerHTML = '';
    visible.forEach(task => taskList.appendChild(createTaskElement(task)));

    // Empty state
    emptyState.classList.toggle('empty-state--visible', visible.length === 0);
  }

  // ─── Priority selector logic (reusable for both add & edit) ───
  function setupPrioritySelector(container, callback) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.priority-btn');
      if (!btn) return;
      container.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('priority-btn--active'));
      btn.classList.add('priority-btn--active');
      callback(btn.dataset.priority);
    });
  }

  // ─── Event Bindings ───

  function bindEvents() {
    // Add task
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();
      if (!text) return;
      TaskModel.add(text, selectedPriority);
      taskInput.value = '';
      // Reset priority to low
      selectedPriority = 'low';
      prioritySel.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('priority-btn--active'));
      prioritySel.querySelector('[data-priority="low"]').classList.add('priority-btn--active');
      render();
      Toast.show('Task added!', 'success');
    });

    // Priority selector for the add form
    setupPrioritySelector(prioritySel, (p) => { selectedPriority = p; });

    // Task list delegation: toggle, edit, delete
    taskList.addEventListener('click', (e) => {
      const item = e.target.closest('.task-item');
      if (!item) return;
      const id = item.dataset.id;

      // Checkbox toggle
      if (e.target.closest('.task-item__check')) {
        TaskModel.toggleComplete(id);
        render();
        return;
      }

      // Edit
      if (e.target.closest('.task-action--edit')) {
        openEditModal(id);
        return;
      }

      // Delete
      if (e.target.closest('.task-action--delete')) {
        item.classList.add('task-item--removing');
        item.addEventListener('animationend', () => {
          TaskModel.remove(id);
          render();
          Toast.show('Task deleted', 'info');
        });
      }
    });

    // Clear completed
    clearBtn.addEventListener('click', () => {
      const count = TaskModel.getCompleted().length;
      if (count === 0) return Toast.show('Nothing to clear', 'info');
      TaskModel.clearCompleted();
      render();
      Toast.show(`Cleared ${count} task${count > 1 ? 's' : ''}`, 'info');
    });

    // Filters
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('nav-btn--active'));
        btn.classList.add('nav-btn--active');
        currentFilter = btn.dataset.filter;
        render();
        closeSidebar(); // auto-close on mobile
      });
    });

    // ─── Edit modal ───
    setupPrioritySelector(editPrioritySel, () => {}); // active class handles state

    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id   = editIdField.value;
      const text = editInput.value.trim();
      if (!text) return;
      const activeBtn = editPrioritySel.querySelector('.priority-btn--active');
      const priority  = activeBtn ? activeBtn.dataset.priority : 'low';
      TaskModel.update(id, { text, priority });
      closeEditModal();
      render();
      Toast.show('Task updated!', 'success');
    });

    modalCloseBtn.addEventListener('click', closeEditModal);
    modalCancelBtn.addEventListener('click', closeEditModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEditModal();
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('modal-overlay--open')) {
        closeEditModal();
      }
    });

    // ─── Sidebar (mobile) ───
    sidebarToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
  }

  // ─── Modal helpers ───
  function openEditModal(id) {
    const task = TaskModel.getById(id);
    if (!task) return;
    editIdField.value = task.id;
    editInput.value   = task.text;

    // Set the correct priority button active
    editPrioritySel.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('priority-btn--active'));
    const target = editPrioritySel.querySelector(`[data-priority="${task.priority}"]`);
    if (target) target.classList.add('priority-btn--active');

    modal.classList.add('modal-overlay--open');
    editInput.focus();
  }

  function closeEditModal() {
    modal.classList.remove('modal-overlay--open');
  }

  // ─── Sidebar helpers ───
  let overlay = null;

  function openSidebar() {
    sidebar.classList.add('sidebar--open');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.addEventListener('click', closeSidebar);
      document.body.appendChild(overlay);
    }
    // Force reflow for animation
    void overlay.offsetWidth;
    overlay.classList.add('sidebar-overlay--visible');
  }

  function closeSidebar() {
    sidebar.classList.remove('sidebar--open');
    if (overlay) overlay.classList.remove('sidebar-overlay--visible');
  }

  // ─── Init ───
  function init() {
    bindEvents();
    render();
  }

  return { init };
})();

// ─────────────────────── Bootstrap ───────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Greeting.init();
  UI.init();
});
