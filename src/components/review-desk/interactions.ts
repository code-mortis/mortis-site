for (const group of document.querySelectorAll<HTMLElement>('[data-switch]')) {
  const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[role=tab]'));
  function selectTab(active: HTMLButtonElement) {
    for (const tab of tabs) {
      const selected = tab === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls')!);
      if (panel) panel.hidden = !selected;
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      const offset = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[event.key as string];
      const target = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : offset ? tabs[(index + tabs.length + offset) % tabs.length] : null;
      if (target) { event.preventDefault(); selectTab(target); target.focus(); }
    });
  });
}
const modal = document.querySelector<HTMLDialogElement>('#capture-dialog');
if (modal) {
  const image = modal.querySelector('img')!;
  const title = modal.querySelector('h2')!;
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>('[data-enlarge], [data-open-view]');
    if (!trigger) return;
    const picture = trigger.dataset.openView
      ? document.getElementById(trigger.dataset.openView)?.querySelector<HTMLElement>('[data-enlarge]')
      : trigger;
    if (!picture?.dataset.full) return;
    title.textContent = picture.dataset.label ?? 'App capture';
    image.src = picture.dataset.full;
    image.alt = picture.querySelector('img')?.alt ?? picture.dataset.alt ?? '';
    modal.style.setProperty('--native-width', picture.dataset.width + 'px');
    modal.showModal();
  });
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.querySelector('button')?.addEventListener('click', () => modal.close());
}
for (const demo of document.querySelectorAll<HTMLElement>('[data-boundary]')) {
  const day = demo.querySelector<HTMLSelectElement>('[data-day]')!;
  const condition = demo.querySelector<HTMLSelectElement>('[data-condition]')!;
  const operator = demo.querySelector('[data-operator]')!;
  const result = demo.querySelector<HTMLElement>('[data-result]')!;
  demo.addEventListener('change', () => {
    const inclusive = condition.value === 'fixed';
    const queued = inclusive ? Number(day.value) <= 0 : Number(day.value) < 0;
    operator.textContent = inclusive ? '<=' : '<';
    result.dataset.result = queued ? 'queued' : 'skipped';
    result.textContent = queued ? 'Reminder queued' : 'Reminder skipped';
  });
}
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
  const code = button.closest('.code-sample')?.querySelector('code');
  button.addEventListener('click', async () => {
    if (!code) return;
    try { await navigator.clipboard.writeText(code.textContent || ''); button.textContent = 'Copied'; }
    catch {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = getSelection(); selection?.removeAllRanges(); selection?.addRange(range);
      button.textContent = 'Text selected';
    }
    setTimeout(() => { button.textContent = 'Copy'; }, 1800);
  });
}
