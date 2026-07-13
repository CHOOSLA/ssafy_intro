// ==========================================================================
// Guestbook (localStorage 기반 방명록)
// - 저장: localStorage에 JSON 배열로 보관
// - 렌더링: textContent만 사용해 사용자 입력이 HTML로 해석되지 않도록 함 (XSS 방어)
// ==========================================================================

const STORAGE_KEY = 'ssafy_intro_guestbook_v1';

const form = document.getElementById('gb-form');
const nameInput = document.getElementById('gb-name');
const messageInput = document.getElementById('gb-message');
const list = document.getElementById('gb-list');
const emptyState = document.getElementById('gb-empty');

function loadEntries() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function createEntryElement(entry) {
    const li = document.createElement('li');
    li.className = 'rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(44,44,44,0.06)]';

    const head = document.createElement('div');
    head.className = 'mb-3 flex items-center justify-between';

    const name = document.createElement('strong');
    name.className = 'font-batang text-lg';
    name.textContent = entry.name;

    const meta = document.createElement('div');
    meta.className = 'flex items-center gap-3';

    const date = document.createElement('time');
    date.className = 'text-xs text-charcoal/40';
    date.textContent = formatDate(entry.createdAt);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'text-xs text-charcoal/40 transition-colors hover:text-apricot';
    removeBtn.textContent = '삭제';
    removeBtn.addEventListener('click', () => {
        const entries = loadEntries().filter((e) => e.createdAt !== entry.createdAt);
        saveEntries(entries);
        render();
    });

    meta.append(date, removeBtn);
    head.append(name, meta);

    const message = document.createElement('p');
    message.className = 'break-keep text-sm leading-relaxed text-charcoal/80';
    message.textContent = entry.message;

    li.append(head, message);
    return li;
}

function render() {
    const entries = loadEntries().sort((a, b) => b.createdAt - a.createdAt);
    list.replaceChildren(...entries.map(createEntryElement));
    emptyState.style.display = entries.length ? 'none' : '';
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !message) return;

    const entries = loadEntries();
    entries.push({ name, message, createdAt: Date.now() });
    saveEntries(entries);

    form.reset();
    nameInput.focus();
    render();
});

render();
