/* Hash links work on GitHub Pages, including direct links and browser history. */
(() => {
  const portfolio = document.getElementById('portfolio');
  const pane = document.getElementById('project-pane');
  const close = document.getElementById('close-project');
  const home = document.getElementById('home-link');
  const links = [...document.querySelectorAll('[data-project]')];
  const projects = [...pane.querySelectorAll('.project')];
  const mobile = window.matchMedia('(max-width: 760px)');
  let selected = null;

  function showProject(id, focus = false) {
    const project = projects.find(item => item.id === id);
    selected = project?.id || null;
    projects.forEach(item => { item.hidden = item !== project; });
    pane.hidden = !project;
    close.hidden = !project;
    portfolio.dataset.projectOpen = String(Boolean(project));
    links.forEach(link => {
      if (link.dataset.project === selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = project ? `${project.querySelector('h2').textContent} — Michael Breibart` : 'Michael Breibart';
    pane.scrollTop = 0;
    if (project && focus) {
      project.querySelector('h2').focus({ preventScroll: true });
      if (mobile.matches) pane.scrollIntoView({ block: 'start' });
    }
  }

  function navigate(id, focus = false) {
    const url = id ? `#${id}` : window.location.pathname + window.location.search;
    history.pushState(null, '', url);
    showProject(id, focus);
  }

  links.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(selected === link.dataset.project ? null : link.dataset.project, true);
  }));
  close.addEventListener('click', () => {
    const link = links.find(item => item.dataset.project === selected);
    navigate(null);
    link?.focus({ preventScroll: !mobile.matches });
  });
  home.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(null);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected) close.click();
  });
  function syncRoute() { showProject(window.location.hash.slice(1)); }
  window.addEventListener('popstate', syncRoute);
  window.addEventListener('hashchange', syncRoute);
  document.documentElement.classList.add('js');
  syncRoute();
})();
