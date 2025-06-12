// js/script.js

// 1. Load shared navbar into any page that has a #navbar container
async function loadNavbar() {
  const container = document.getElementById('navbar');
  if (!container) return;
  try {
    const html = await fetch('/components/navbar.html').then(r => r.text());
    container.innerHTML = html;
  } catch (err) {
    console.error('Failed to load navbar:', err);
  }
}

// 2. Catalog page logic
function initCatalogPage() {
  const filterDropdown = document.getElementById('filterDropdown');
  const addItemBtn = document.getElementById('addItemBtn');
  const itemList = document.getElementById('itemList');

  if (filterDropdown) {
    filterDropdown.addEventListener('change', e => {
      const choice = e.target.value;
      console.log({ page: '/pages/catalog.html', action: 'selectFilter', data: choice });
      itemList.innerHTML = '';
    });
  }

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      const newItem = `Item ${Math.floor(Math.random() * 1000)}`;
      const li = document.createElement('li');
      li.textContent = newItem;
      itemList.appendChild(li);
      console.log({
        page: '/pages/catalog.html',
        action: 'clickAddItem',
        data: newItem
      });
    });
  }
}

// 3. Settings page logic
function initSettingsPage() {
  const volumeSlider = document.getElementById('volumeSlider');
  const notificationsToggle = document.getElementById('notificationsToggle');
  const saveBtn = document.getElementById('saveSettingsBtn');

  if (volumeSlider) {
    volumeSlider.addEventListener('input', e => {
      console.log({
        page: '/pages/settings.html',
        action: 'changeVolume',
        data: e.target.value
      });
    });
  }

  if (notificationsToggle) {
    notificationsToggle.addEventListener('change', e => {
      console.log({
        page: '/pages/settings.html',
        action: 'toggleNotifications',
        data: e.target.checked
      });
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const volume = volumeSlider?.value ?? null;
      const notifications = notificationsToggle?.checked ?? null;
      console.log({
        page: '/pages/settings.html',
        action: 'saveSettings',
        data: { volume, notifications }
      });
    });
  }
}

// 4. Data Table page logic
function initDataTablePage() {
  const tbody = document.querySelector('#dataTable tbody');
  if (!tbody) return;

  // Generate 30 rows of data
  const data = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 1
  }));

  // Populate table
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="border px-4 py-2">${row.id}</td>
      <td class="border px-4 py-2">${row.name}</td>
      <td class="border px-4 py-2">${row.value}</td>
    `;
    tbody.appendChild(tr);
  });

  // Filter functionality
  const filterInput = document.getElementById('tableFilter');
  if (filterInput) {
    filterInput.addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      Array.from(tbody.rows).forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
      console.log({
        page: '/pages/data-table.html',
        action: 'filterTable',
        data: term
      });
    });
  }
}

// 5. On DOM ready, wire everything up
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  initCatalogPage();
  initSettingsPage();
  initDataTablePage();  // ← Ensure data-table rows are initialized
});


// 6. Add a global assertion helper
window.assert = (selector, expectedCount) => {
  const actual = document.querySelectorAll(selector).length;
  console.log({
    page: document.querySelector('meta[name="page-id"]').content,
    assertion: selector,
    actual,
    expected: expectedCount
  });
};
