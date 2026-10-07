const $ = (selector) => document.querySelector(selector);
const main = $('#main');
document.title = '';
let titleTypingTimer = null;

const state = {
  life: null,
  career: null,
  media: null,
  theme: localStorage.getItem('bh-theme') || 'dark',
  mediaFilter: 'Tất cả'
};

const pages = {
  home: { title: 'Trang chủ', render: home },
  journey: { title: 'Hành trình', render: journey },
  life: { title: 'Cuộc đời Bác Hồ', render: life },
  career: { title: 'Sự nghiệp', render: career },
  media: { title: 'Tư liệu', render: media }
};

// ============================================================
// DỮ LIỆU BẢN ĐỒ
// Thêm / sửa địa điểm tại đây. Đây là các chặng tiêu biểu,
// không phải toàn bộ mọi nơi Người từng đặt chân tới.
// neu thay thieu thi tu them vo
// ============================================================
const journeyPoints = [
  {
    name: 'Kim Liên',
    year: '1890',
    lat: 18.79,
    lng: 105.69,
    text: 'Quê hương gắn với tuổi thơ và gia đình của Nguyễn Sinh Cung.'
  },
  {
    name: 'Bến Nhà Rồng – Sài Gòn',
    year: '1911',
    lat: 10.768,
    lng: 106.706,
    text: 'Ngày 5/6/1911, Nguyễn Tất Thành rời Sài Gòn trên tàu Đô đốc Latouche-Tréville.'
  },
  {
    name: 'Marseille',
    year: '1911',
    lat: 43.2965,
    lng: 5.3698,
    text: 'Một trong những điểm đến đầu tiên trong hành trình sang Pháp.'
  },
  {
    name: 'Dakar',
    year: '1912',
    lat: 14.7167,
    lng: -17.4677,
    text: 'Một bến cảng ở châu Phi được ghi nhận trong hành trình làm việc trên tàu.'
  },
  {
    name: 'London',
    year: '1913–1917',
    lat: 51.5074,
    lng: -0.1278,
    text: 'Một chặng hoạt động và lao động trong những năm ở nước ngoài.'
  },
  {
    name: 'Paris',
    year: '1919–1923',
    lat: 48.8566,
    lng: 2.3522,
    text: 'Giai đoạn hoạt động chính trị, báo chí và tham gia phong trào của người Việt tại Pháp.'
  },
  {
    name: 'Moskva',
    year: '1923',
    lat: 55.7558,
    lng: 37.6173,
    text: 'Một chặng quan trọng trong hoạt động quốc tế của Nguyễn Ái Quốc.'
  },
  {
    name: 'Quảng Châu',
    year: '1924–1927',
    lat: 23.1291,
    lng: 113.2644,
    text: 'Nơi Nguyễn Ái Quốc hoạt động, đào tạo cán bộ và thúc đẩy việc chuẩn bị lực lượng cách mạng.'
  },
  {
    name: 'Hồng Kông',
    year: '1930',
    lat: 22.3193,
    lng: 114.1694,
    text: 'Gắn với Hội nghị hợp nhất các tổ chức cộng sản đầu năm 1930.'
  },
  {
    name: 'Pác Bó – Cao Bằng',
    year: '1941',
    lat: 22.905,
    lng: 106.27,
    text: 'Ngày 28/1/1941 Người trở về nước; sau đó hoạt động tại Pác Bó và chủ trì Hội nghị Trung ương 8.'
  },
  {
    name: 'Tân Trào',
    year: '1945',
    lat: 21.81,
    lng: 105.42,
    text: 'Một địa điểm quan trọng trong giai đoạn chuẩn bị Tổng khởi nghĩa năm 1945.'
  },
  {
    name: 'Hà Nội – Ba Đình',
    year: '1945',
    lat: 21.0285,
    lng: 105.8542,
    text: 'Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.'
  }
];

async function loadData() {
  const cacheBust = `?v=${Date.now()}`;

  const [lifeResponse, careerResponse, mediaResponse] = await Promise.all([
    fetch(`data/life.json${cacheBust}`, { cache: 'no-store' }),
    fetch(`data/career.json${cacheBust}`, { cache: 'no-store' }),
    fetch(`data/media.json${cacheBust}`, { cache: 'no-store' })
  ]);

  if (!lifeResponse.ok || !careerResponse.ok || !mediaResponse.ok) {
    throw new Error(
      `Không tải được JSON: ${lifeResponse.status}, ${careerResponse.status}, ${mediaResponse.status}`
    );
  }

  state.life = await lifeResponse.json();
  state.career = await careerResponse.json();
  state.media = await mediaResponse.json();
}

function imageWithFallback(src, alt, className = '') {
  const safeSrc = escapeAttr(src);
  const safeAlt = escapeAttr(alt);
  return `<img class=\"${className}\" src=\"${safeSrc}\" alt=\"${safeAlt}\" onerror=\"this.onerror=null;this.src='assets/images/placeholder.svg';this.classList.add('fallback-image')\">`;
}

function home() {
  return `
    <section class="hero page">
      <div class="hero-backdrop" aria-hidden="true"></div>
      <div class="hero-overlay"></div>
      <div class="hero-inner hero-overlay-content">
        <div class="eyebrow">MỘT HÀNH TRÌNH — MỘT TRANG SỬ</div>
        <h1 class="hero-title tw-once">
          Chủ tịch Hồ Chí Minh - người đặt nền móng cho nền độc lập của Dân tộc Việt Nam
        </h1>
        <p class="hero-sub">
          Lần theo những dấu mốc, địa điểm và tư liệu để tìm hiểu một hành trình lịch sử kéo dài qua nhiều thập niên.
        </p>
        <button class="cta" onclick="document.querySelector('#homeIntro').scrollIntoView({behavior:'smooth'})">
          KHÁM PHÁ<span>↓</span>
        </button>
      </div>
    </section>

    <section id="homeIntro" class="section home-intro">
      <div class="section-head">
        <div class="kicker">Lời mở đầu</div>
        <h2 class="tw-once">Người đi tìm một con đường</h2>
        <p class="section-lead">
          Từ quê hương Kim Liên, qua nhiều chặng hoạt động ở nước ngoài và trở về Việt Nam năm 1941,
          cuộc đời Hồ Chí Minh gắn với nhiều biến động lớn của lịch sử Việt Nam và thế giới.
        </p>
      </div>
      <div class="quote">
        Website được thiết kế như một chuyến tham quan tư liệu: đọc, xem, lần theo từng mốc thời gian
        và tự khám phá câu chuyện lịch sử. Một số tư liệu có thể chưa đầy đủ, nhưng hy vọng sẽ giúp bạn hình dung một phần hành trình của Bác Hồ.
      </div>
    </section>
  `;
}

function life() {
  return shell(
    'Cuộc đời Bác Hồ',
    state.life.intro,
    `
      <div class="life-list">
        ${state.life.items.map((item, index) => `
          <button class="life-row ${index % 2 ? 'reverse' : ''} scroll-reveal" onclick="openLife(${index})">
            <div class="life-image">
              ${imageWithFallback(item.image, item.title)}
            </div>
            <div class="life-copy">
              <span>${item.period}</span>
              <h3>${item.title}</h3>
              <p>${item.summary}</p>
              <b>Đến trang chi tiết →</b>
            </div>
          </button>
        `).join('')}
      </div>
      <div class="source">
        Nguồn nền:
        <a href="https://hochiminh.vn/cuoc-doi-su-nghiep/bien-nien-tieu-su-ho-chi-minh" target="_blank" rel="noopener">
          Biên niên tiểu sử Hồ Chí Minh — hochiminh.vn
        </a>
      </div>
    `
  );
}

function career() {
  return shell(
    'Sự nghiệp',
    state.career.intro,
    `
      <div class="timeline">
        ${state.career.events.map((event, index) => `
          <article class="event scroll-reveal">
            <div class="date">${event.date}</div>
            <i class="dot"></i>
            <button class="event-body" onclick="openCareer(${index})">
              <h3>${event.title}</h3>
              <p>${event.story}</p>
              <span>Tìm hiểu →</span>
            </button>
          </article>
        `).join('')}
      </div>
      <div class="source">
        Tham khảo:
        <a href="https://hochiminh.vn/cuoc-doi-su-nghiep/bien-nien-tieu-su-ho-chi-minh" target="_blank" rel="noopener">
          Biên niên tiểu sử
        </a>
      </div>
    `
  );
}

function media() {
  const data = state.media || {};
  const allImages = Array.isArray(data.images) ? data.images : [];
  const allVideos = Array.isArray(data.videos) ? data.videos : [];
  const filter = state.mediaFilter || 'Tất cả';

  const categories = [
    'Tất cả',
    'Hình ảnh',
    'Video',
    'Quê hương & tuổi thơ',
    'Hành trình',
    'Hoạt động cách mạng',
    'Cách mạng Tháng Tám',
    'Tân Trào',
    '1954–1969'
  ];

  let images = [];
  let videos = [];

  if (filter === 'Tất cả' || filter === 'Hình ảnh') {
    images = allImages;
  } else if (filter === 'Video') {
    videos = allVideos;
  } else {
    images = allImages.filter((item) => item.category === filter);
  }
  //tutorial dung embed yt:
  //- copy link youtube, m se thay cai id share cua m la 1 dong ky tu, lay cai id day ra r tu tao 1 cai vo data/media.json r dan no vo
  //(vi du: youtube.com/watch...si=<id> hoac youtu.be/...si=<id> thi lay moi id thoi)
  return shell(
    'Tư liệu',
    'Mỗi category có thể chứa nhiều ảnh/video, mỗi ảnh/video có tiêu đề và năm riêng.',
    '(phai doi lai cai nay, thay thieu thieu j day)',
    `
      <div class="media-tabs">
        ${categories.map((category) => `
          <button class="tab ${filter === category ? 'active' : ''}" data-media-filter="${escapeAttr(category)}">
            ${category}
          </button>
        `).join('')}
      </div>

      <div class="masonry">
        ${images.map((item) => `
          <article class="media-card image-card scroll-reveal">
            <div class="media-thumb">
              <img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.title)}" onerror="this.onerror=null;this.src='assets/images/placeholder.svg';this.classList.add('fallback-image')">
            </div>
            <div class="media-info">
              <small>${escapeAttr(item.category)} · ${escapeAttr(item.year)}</small>
              <h3>${escapeAttr(item.title)}</h3>
              <p>Ảnh tư liệu · ${escapeAttr(item.source)}</p>
            </div>
          </article>
        `).join('')}
        
        ${videos.map((video) => `
          <article class="media-card video-card2 scroll-reveal">
            <div class="video-frame">
              ${video.youtube
                ? `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(video.youtube)}?rel=0" title="${escapeAttr(video.title)}" loading="lazy" allowfullscreen></iframe>`
                : `
                  <div class="video-placeholder">
                    <span>▶</span>
                    <strong>Chưa có YouTube ID</strong>
                    <small>Điền trường <b>youtube</b> trong <code>data/media.json</code></small>
                    <a href="${escapeAttr(video.sourceUrl)}" target="_blank" rel="noopener">Mở tư liệu gốc ↗</a>
                  </div>
                `}
            </div>
            <div class="media-info">
              <small>${escapeAttr(video.year)}</small>
              <h3>${escapeAttr(video.title)}</h3>
              <p>Nguồn: ${escapeAttr(video.source)}</p>
            </div>
          </article>
        `).join('')}
      </div>

      ${!images.length && !videos.length ? '<div class="empty-state">Chưa có tư liệu trong category này.</div>' : ''}

      <div class="source">
        Nguồn tài liệu :
        <a href="https://hochiminh.vn/tu-lieu-video" target="_blank" rel="noopener">
          hochiminh.vn/tu-lieu-video
        </a>
      </div>
    `
  );
}
//map function
//tutorial: lay toa do dia ly cua noi Bac Ho tung den(vi du: 21.028511, 105.804817 la chi Ha Noi) r chi ra giai doan va hoat dong cua Bac o day
function journey() {
  return `
    <section class="section page">
      <div class="section-head">
        <div class="kicker">Bản đồ hành trình</div>
        <h2 class="tw-once">Theo dấu những địa điểm quan trọng</h2>
        <p class="section-lead">
          Các marker dưới đây là những chặng tiêu biểu trong hành trình của Người.
          Đường nối và mũi tên giúp nhìn nhanh thứ tự tương đối giữa các chặng; bản đồ không nhằm mô tả chính xác từng ngày di chuyển.
        </p>
      </div>

      <div class="journey-grid">
        <div class="map-wrap">
          <div id="journeyMap"></div>
        </div>
        <div>
          <div class="quote">
            <b>Đọc bản đồ:</b> marker là địa điểm, đường đỏ là tuyến trực quan hóa,
            mũi tên biểu thị hướng từ chặng trước tới chặng sau.
          </div>
          <div class="journey-list">
            ${journeyPoints.map((point, index) => `
              <button class="journey-item" onclick="focusJourney(${index})">
                <span>${String(index + 1).padStart(2, '0')}</span>
                <div>
                  <b>${point.name}</b>
                  <small>${point.year}</small>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="map-caption">
        <span>● Marker = địa điểm · ➜ = hướng tuyến</span>
        <span>Zoom / kéo bản đồ để khám phá</span>
      </div>
    </section>
  `;
}

function shell(title, lead, body) {
  return `
    <section class="section page">
      <div class="section-head">
        <div class="kicker">${title}</div>
        <h2 class="tw-once">${title}</h2>
        <p class="section-lead">${lead}</p>
      </div>
      ${body}
    </section>
  `;
}

function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function typeOnce(root) {
  root.querySelectorAll('.tw-once').forEach((element) => {
    if (element.dataset.done) return;

    const text = element.textContent.trim();
    element.textContent = '';
    element.dataset.done = '1';

    let index = 0;

    const tick = () => {
      if (index < text.length) {
        element.textContent += text[index++];
        setTimeout(tick, 14);
      }
    };

    tick();
  });
}

function observeReveal(root) {
  const elements = root.querySelectorAll('.scroll-reveal');

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  elements.forEach((element) => observer.observe(element));
}

function typeDocumentTitle(title) {
  clearTimeout(titleTypingTimer);
  document.title = '';

  let index = 0;
  let deleting = false;

  const animate = () => {
    if (!deleting) {
      index += 1;
      document.title = title.slice(0, index);

      if (index === title.length) {
        deleting = true;
        titleTypingTimer = setTimeout(animate, 900);
        return;
      }
    } else {
      index -= 1;
      document.title = title.slice(0, index);

      if (index === 0) {
        deleting = false;
        titleTypingTimer = setTimeout(animate, 350);
        return;
      }
    }

    titleTypingTimer = setTimeout(animate, 200);
  };

  titleTypingTimer = setTimeout(animate, 200);
}
//doan nay la function chi loi render app(neu ng van hanh bi nguu)
function navigate(key) {
  const page = pages[key] || pages.home;

  try {
    main.innerHTML = page.render();
  } catch (error) {
    console.error(`Lỗi render tab ${key}:`, error);
    main.innerHTML = `
      <section class="section">
        <h2>Không thể mở tab này</h2>
        <p>Đã xảy ra lỗi khi dựng nội dung.</p>
      </section>
    `;
    return;
  }

  typeDocumentTitle(`${page.title} — Theo dấu chân Bác Hồ`);

  main.querySelectorAll('[data-media-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mediaFilter = button.dataset.mediaFilter;
      navigate('media');
    });
  });

  typeOnce(main);
  observeReveal(main);
  closeDrawer();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (key === 'journey') {
    setTimeout(initMap, 100);
  }
}
//doan nay no van chua co vi chua load den
let journeyMap = null;
let journeyMarkers = [];
//h ms load map nay
function initMap() {
  const element = $('#journeyMap');
  if (!element || !window.L) return;

  journeyMap = L.map(element, {
    scrollWheelZoom: false,
    worldCopyJump: true,
    zoomAnimation: false
  }).setView([18.79, 105.69], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(journeyMap);

  const latLngs = journeyPoints.map((point) => [point.lat, point.lng]);
  const routeRenderer = L.svg({ padding: 0.5 });
  const route = L.polyline(latLngs, {
    color: '#8f2020',
    weight: 3,
    opacity: 0.8,
    dashArray: '8 7',
    smoothFactor: 0,
    noClip: true,
    renderer: routeRenderer
  }).addTo(journeyMap);

  journeyMarkers = journeyPoints.map((point, index) => {
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: 7,
      color: '#8f2020',
      fillColor: '#caa85e',
      fillOpacity: 1,
      weight: 2,
      renderer: routeRenderer
    }).addTo(journeyMap);

    marker.bindPopup(`
      <div class="map-popup">
        <b>${point.year}</b>
        <br>
        <strong>${point.name}</strong>
        <p>${point.text}</p>
      </div>
    `);

    marker.bindTooltip(`${index + 1}. ${point.name}`, {
      direction: 'top',
      offset: [0, -8]
    });

    return marker;
  });

  setTimeout(() => {
    for (let index = 0; index < latLngs.length - 1; index += 1) {
      addRouteArrow(latLngs[index], latLngs[index + 1]);
    }

    journeyMap.invalidateSize();
  }, 150);
}

function addRouteArrow(from, to) {
  if (!journeyMap) return;

  const middle = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2
  ];

  const icon = L.divIcon({
    className: 'route-arrow-icon',
    html: '<span>➜</span>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const marker = L.marker(middle, {
    icon,
    interactive: false,
    keyboard: false
  }).addTo(journeyMap);

  const updateAngle = (event) => {
    const zoom = event?.zoom ?? journeyMap.getZoom();
    const a = journeyMap.project(from, zoom);
    const b = journeyMap.project(to, zoom);

    const angle = Math.atan2(
      b.y - a.y,
      b.x - a.x
    ) * 180 / Math.PI;

    const element = marker.getElement();
    const arrow = element && element.querySelector('span');

    if (arrow) {
      arrow.style.transform = `rotate(${angle}deg)`;
    }
  };

  updateAngle();
  journeyMap.on('zoomanim zoom move zoomend', updateAngle);
}

function focusJourney(index) {
  if (!journeyMap || !journeyMarkers[index]) return;

  const point = journeyPoints[index];
  journeyMap.flyTo([point.lat, point.lng], 5, {
    duration: 0.8
  });
  journeyMarkers[index].openPopup();
}

function openLife(index) {
  const item = state.life.items[index];

  modal(`
    <div class="detail-page">
      <div class="detail-media">
        ${imageWithFallback(item.image, item.title)}
        <small>${item.caption || ''}</small>
      </div>
      <div class="detail-copy">
        <span>${item.period}</span>
        <h2>${item.title}</h2>
        <p>${item.story}</p>
        <div class="detail-note">
          Nguồn tham khảo: Biên niên tiểu sử Hồ Chí Minh trên hochiminh.vn.
          Ảnh minh họa lấy từ đường dẫn trong data/life.json.
        </div>
      </div>
    </div>
  `);
}

function openCareer(index) {
  const event = state.career.events[index];

  modal(`
    <div class="detail-page">
      <div class="detail-media">
        ${imageWithFallback(event.image, event.title)}
        <small>Ảnh: thay file tại <code>${event.image}</code></small>
      </div>
      <div class="detail-copy">
        <div class="historical-meta">
          <span class="pill">${event.date}</span>
          <span class="pill">SỰ KIỆN LỊCH SỬ</span>
        </div>
        <h2>${event.title}</h2>
        <h4>Câu chuyện</h4>
        <p>${event.story}</p>
        <h4>Đóng góp / ý nghĩa</h4>
        <p>${event.meaning}</p>
        <div class="detail-note">
          Nguồn/ghi chú sự kiện có thể mở rộng trực tiếp trong <code>data/career.json</code>.
        </div>
      </div>
    </div>
  `);
}
//neu chx co imagr thi no se fallback ve cai cach dua image vo
function openImg(src, title, year, source) {
  modal(`
    <div class="detail-media single">
      ${imageWithFallback(src, title)}
      <div class="historical-meta">
        <span class="pill">${year}</span>
        <span class="pill">${source}</span>
      </div>
      <h2>${title}</h2>
      <small>
        Cập nhật <code>src</code> trong <code>data/media.json</code> để thay ảnh.
      </small>
    </div>
  `);
}

function filterMedia(category) {
  state.mediaFilter = category;
  navigate('media');
}

function closeModal() {
  $('#modal').classList.remove('show');
  document.body.style.overflow = '';
}

function modal(html) {
  $('#modalContent').innerHTML = html;
  $('#modal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  $('#drawer').classList.remove('open');
  $('#backdrop').classList.remove('show');
}

function openDrawer() {
  $('#drawer').classList.add('open');
  $('#backdrop').classList.add('show');
}
//theme(default la dark, light ko nen bat, no cu xau xau kieu j ay)
function updateThemeButtons() {
  const isDark = state.theme === 'dark';
  const icon = isDark ? '☀' : '☾';
  const text = isDark ? 'Sáng' : 'Tối';

  $('#themeTopBtn').innerHTML = `${icon} <span>${text}</span>`;

  const drawerButton = $('#themeBtn');
  if (drawerButton) {
    drawerButton.innerHTML = `${icon} <span>Chế độ ${text.toLowerCase()}</span>`;
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem('bh-theme', state.theme);
  updateThemeButtons();
}
function openCredits() {
  window.location.href = 'credits.html';
}

//nut bam va function cua nut
function buildNav() {
  const labels = [
    ['home', 'Trang chủ'],
    ['journey', 'Hành trình'],
    ['life', 'Cuộc đời'],
    ['career', 'Sự nghiệp'],
    ['media', 'Tư liệu']
  ];

  $('#topNav').innerHTML = labels
    .map(([key, label]) => `<button onclick="navigate('${key}')">${label}</button>`)
    .join('')
    + `
      <button class="credits-nav" onclick="openCredits()" aria-label="Credits" title="Credits">
        <img src="assets/images/credits/credits.svg" alt="Credits"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='inline'">
        <span>✦</span>
      </button>
    `;

  $('#drawerNav').innerHTML = labels
    .map(
      ([key, label]) => `
        <div class="drawer-group">
          <button class="nav-item" onclick="navigate('${key}')">${label}</button>
        </div>
      `
    )
    .join('')
    + `
      <div class="drawer-group">
        <button class="nav-item credits-drawer-item" onclick="openCredits()">
          <img src="assets/images/credits/credits.svg" alt="">
          <span>Credits</span>
        </button>
      </div>
      <div class="drawer-divider"></div>
      <button class="theme-toggle" id="themeBtn" onclick="toggleTheme"></button>
    `;

  // Gắn handler thay vì nhét cả function vào HTML.
  $('#themeBtn').onclick = toggleTheme;
  updateThemeButtons();
}

$('#menuBtn').onclick = openDrawer;
$('#closeBtn').onclick = closeDrawer;
$('#backdrop').onclick = closeDrawer;

$('#modal').addEventListener('click', (event) => {
  if (event.target.id === 'modal') closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    closeDrawer();
  }
});

document.documentElement.dataset.theme = state.theme;
buildNav();
//doan nay phai chay server rieng(localhost) chu ko nen chay thang file html(open with)
loadData()
  .then(() => {
    navigate('home');
    setTimeout(() => $('#loader').classList.add('done'), 500);
  })
  .catch(() => {
    main.innerHTML = `
      <section class="section">
        <h2>Không tải được dữ liệu JSON</h2>
        <p>Hãy chạy website bằng local server thay vì mở file:// trực tiếp.</p>
      </section>
    `;

    setTimeout(() => $('#loader').classList.add('done'), 500);
  });
