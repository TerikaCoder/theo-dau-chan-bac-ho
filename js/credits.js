const $ = (selector) => document.querySelector(selector);
const state = { theme: localStorage.getItem('bh-theme') || 'dark', songs: [], current: -1, members: [] };
const audio = $('#audio');

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function socialIcon(platform) {
  const map = {facebook:'f', tiktok:'♪', instagram:'◎', youtube:'▶', github:'⌘', discord:'◉', email:'@', website:'↗'};
  return map[String(platform || '').toLowerCase()] || '↗';
}
function imageFallback(img) { img.onerror = null; img.src = 'assets/images/placeholder.svg'; }

function renderMembers(data) {
  state.members = Array.isArray(data.members) ? data.members : [];
  const groups = ['Trưởng nhóm', 'Phó nhóm', 'Thành viên'];
  $('#membersTree').innerHTML = groups.map((role, groupIndex) => {
    const members = state.members.filter(m => (m.role || 'Thành viên') === role);
    if (!members.length) return '';
    return `<section class="credit-level level-${groupIndex}">
      <div class="level-label"><span>${String(groupIndex + 1).padStart(2,'0')}</span><strong>${escapeHtml(role)}</strong></div>
      <div class="level-list">${members.map((member) => {
        const index = state.members.indexOf(member);
        const image = member.image || 'assets/images/placeholder.svg';
        return `<button class="member-node" type="button" data-member="${index}">
          <span class="member-node-text"><small>${escapeHtml(member.role || 'Thành viên')}</small><strong>${escapeHtml(member.name)}</strong></span>
          <img src="${escapeHtml(image)}" alt="" onerror="imageFallback(this)">
          <span class="node-arrow">+</span>
        </button>`;
      }).join('')}</div>
    </section>`;
  }).join('');
  document.querySelectorAll('.member-node').forEach(node => node.addEventListener('click', () => openMember(Number(node.dataset.member))));
}

function openMember(index) {
  const member = state.members[index];
  if (!member) return;
  const socials = Array.isArray(member.social) ? member.social : [];
  $('#memberModal').classList.add('open');
  $('#memberModal').setAttribute('aria-hidden','false');
  $('#modalRole').textContent = member.role || 'Thành viên';
  $('#modalName').textContent = member.name || '—';
  $('#modalFeeling').textContent = member.feeling || '—';
  $('#modalSocial').innerHTML = socials.map(item => `<a class="social-link" href="${escapeHtml(item.url || '#')}" target="_blank" rel="noopener"><span class="social-icon">${socialIcon(item.platform)}</span>${escapeHtml(item.label || item.platform)}</a>`).join('');
  const img = $('#modalImage'); img.src = member.image || 'assets/images/placeholder.svg'; img.onerror = () => imageFallback(img);
}
function closeMember() { $('#memberModal').classList.remove('open'); $('#memberModal').setAttribute('aria-hidden','true'); }
$('#closeModal').onclick = closeMember;
$('#memberModal').addEventListener('click', e => { if (e.target.id === 'memberModal') closeMember(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMember(); });

function formatTime(seconds) { if (!Number.isFinite(seconds)) return '0:00'; return `${Math.floor(seconds/60)}:${Math.floor(seconds%60).toString().padStart(2,'0')}`; }
function updateTheme() { document.documentElement.dataset.theme = state.theme; const dark = state.theme === 'dark'; $('#themeButton').innerHTML = `${dark ? '☀' : '☾'} <span>${dark ? 'Sáng' : 'Tối'}</span>`; }
function toggleTheme() { state.theme = state.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('bh-theme', state.theme); updateTheme(); }

function showSongNotification(song) {
  const box = $('#songToast');
  $('#toastSong').textContent = song.name || song.file || '—';
  $('#toastAuthor').textContent = song.author || '—';
  $('#toastRequest').textContent = song.requestBy || '—';
  box.classList.remove('show'); void box.offsetWidth; box.classList.add('show');
  clearTimeout(showSongNotification.timer);
  showSongNotification.timer = setTimeout(() => box.classList.remove('show'), 6000);
}
function chooseRandomSong(autoplay = true) {
  if (!state.songs.length) return;
  let next = Math.floor(Math.random() * state.songs.length);
  const previous = Number(localStorage.getItem('bh-last-song-index'));
  if (state.songs.length > 1 && Number.isInteger(previous) && next === previous) next = (next + 1 + Math.floor(Math.random() * (state.songs.length - 1))) % state.songs.length;
  state.current = next;
  localStorage.setItem('bh-last-song-index', String(next));
  const song = state.songs[next];
  audio.src = `assets/music/${encodeURIComponent(song.file || `${next + 1}.mp3`)}`;
  $('#songName').textContent = song.name || song.file;
  $('#songAuthor').textContent = song.author ? `— ${song.author}` : '—';
  $('#songRequest').textContent = `Request by ${song.requestBy || '—'}`;
  $('#progress').value = 0; $('#currentTime').textContent = '0:00'; $('#duration').textContent = '0:00';
  showSongNotification(song);
  if (autoplay) audio.play().catch(() => { $('#playButton').textContent = '▶ Bấm để phát'; });
}
audio.addEventListener('loadedmetadata', () => $('#duration').textContent = formatTime(audio.duration));
audio.addEventListener('timeupdate', () => { $('#currentTime').textContent = formatTime(audio.currentTime); $('#progress').value = audio.duration ? audio.currentTime / audio.duration * 100 : 0; });
audio.addEventListener('play', () => { $('#playButton').textContent = '❚❚ Tạm dừng'; $('#recordWheel').classList.add('playing'); });
audio.addEventListener('pause', () => { $('#playButton').textContent = '▶ Phát'; $('#recordWheel').classList.remove('playing'); });
audio.addEventListener('ended', () => chooseRandomSong(true));
$('#playButton').onclick = () => { if (!audio.src && state.songs.length) chooseRandomSong(false); if (audio.paused) audio.play().catch(()=>{}); else audio.pause(); };
$('#nextSong').onclick = () => chooseRandomSong(true);
$('#progress').oninput = () => { if (audio.duration) audio.currentTime = Number($('#progress').value) / 100 * audio.duration; };
$('#volume').oninput = () => audio.volume = Number($('#volume').value);
$('#themeButton').onclick = toggleTheme; audio.volume = 0.8;

Promise.all([
  fetch('data/credits.json?v=' + Date.now(), {cache:'no-store'}).then(r => r.json()),
  fetch('assets/music/song.json?v=' + Date.now(), {cache:'no-store'}).then(r => r.json())
]).then(([credits, music]) => {
  renderMembers(credits);
  state.songs = Array.isArray(music.songs) ? music.songs : [];
  chooseRandomSong(true);
}).catch(error => { console.error(error); $('#membersTree').innerHTML = '<div class="empty-members">Không tải được dữ liệu credits.</div>'; });
updateTheme();
