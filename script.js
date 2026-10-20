'use strict';

// Mobile navigation: keep the expanded state accessible to screen readers.
const menuButton = document.querySelector('#menu-toggle');
const nav = document.querySelector('#primary-nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));

// Theme toggle: persist preference between visits.
const themeButton = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('#theme-icon');
let savedTheme;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { /* Storage may be disabled. */ }
function applyTheme(light) {
  document.body.classList.toggle('light', light);
  themeButton.setAttribute('aria-pressed', String(light));
  themeButton.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  themeIcon.textContent = light ? '☾' : '☼';
  document.querySelector('meta[name="theme-color"]').content = light ? '#f6f9fc' : '#0a1527';
}
applyTheme(savedTheme === 'light');
themeButton.addEventListener('click', () => {
  const light = !document.body.classList.contains('light');
  applyTheme(light);
  try { localStorage.setItem('portfolio-theme', light ? 'light' : 'dark'); } catch (_) { /* Optional storage. */ }
});

// Project filter with an accessible announcement.
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
const filterStatus = document.querySelector('#filter-status');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let visibleCount = 0;
  projectCards.forEach(card => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.hidden = !visible;
    if (visible) visibleCount++;
  });
  filterStatus.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'} shown.`;
}));

// Contact button: requires replacing the example email before publishing.
const emailButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
emailButton.addEventListener('click', async () => {
  const email = emailButton.dataset.email;
  if (!email || email.includes('YOUR_EMAIL')) {
    copyStatus.textContent = 'Add your email address to index.html first.';
    return;
  }
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = 'Email address copied.';
  } catch (_) {
    copyStatus.textContent = `Email: ${email}`;
  }
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
