/* Small interactions for a buildless, paper-first portfolio. */
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  function setMenu(open, restoreFocus = false) {
    drawer.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(drawer.hidden));
  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (!drawer.hidden && !drawer.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !drawer.hidden) setMenu(false, true);
  });
  window.matchMedia('(min-width: 481px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });

  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  const filterStatus = document.getElementById('filter-status');
  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let count = 0;
    cards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) count++;
    });
    const category = filter === 'all' ? 'all projects' : button.textContent.replace(/\d+/g, '').trim().toLowerCase();
    filterStatus.textContent = `Showing ${count} of ${cards.length} projects: ${category}.`;
  }));

  const copyButton = document.getElementById('copy-email-btn');
  const copyStatus = document.getElementById('copy-status');
  let resetTimer;
  copyButton.addEventListener('click', async () => {
    copyButton.disabled = true;
    clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText(copyButton.dataset.email);
      copyButton.textContent = 'Copied ✓';
      copyStatus.textContent = 'Email address copied to your clipboard.';
    } catch {
      copyButton.textContent = 'Copy email';
      copyStatus.textContent = `Copy unavailable. Email me at ${copyButton.dataset.email}.`;
    } finally {
      copyButton.disabled = false;
      resetTimer = setTimeout(() => {
        copyButton.textContent = 'Copy email';
        copyStatus.textContent = '';
      }, 3000);
    }
  });
  document.getElementById('current-year').textContent = new Date().getFullYear();
});
