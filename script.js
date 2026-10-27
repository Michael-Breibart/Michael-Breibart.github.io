/**
 * Michael Breibart — Personal Portfolio
 * Interactive Script: Theme switcher, Project filtering, Clipboard, Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Switcher (Dark / Light) with LocalStorage & OS Preference
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to OS/dark
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    htmlRoot.setAttribute('data-theme', 'light');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
  }

  themeToggle?.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  mobileMenuBtn?.addEventListener('click', () => {
    mobileDrawer?.classList.toggle('active');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('active');
    });
  });

  // Close mobile drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mobileDrawer?.classList.contains('active') &&
      !mobileDrawer.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      mobileDrawer.classList.remove('active');
    }
  });

  // --------------------------------------------------------------------------
  // 3. Project Filter Tabs
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Add entrance animation
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. Copy Email to Clipboard with UI Feedback
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');

  copyEmailBtn?.addEventListener('click', async () => {
    const email = copyEmailBtn.getAttribute('data-email') || 'breibartmichael@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      const originalText = copyText.textContent;
      copyText.textContent = 'Copied to Clipboard! ✓';
      copyEmailBtn.style.borderColor = 'var(--accent-emerald)';
      copyEmailBtn.style.color = 'var(--accent-emerald)';

      setTimeout(() => {
        copyText.textContent = originalText;
        copyEmailBtn.style.borderColor = '';
        copyEmailBtn.style.color = '';
      }, 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });

  // --------------------------------------------------------------------------
  // 5. Current Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
