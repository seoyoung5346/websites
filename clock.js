/* ══════════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════════ */
const BG_IMAGES = [
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80", credit: "Photo: Samuel Ferrara / Unsplash" },
  { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80", credit: "Photo: Shifaaz shamoon / Unsplash" },
  { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80", credit: "Photo: Imat Bagja / Unsplash" },
  { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80", credit: "Photo: David Marcu / Unsplash" },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80", credit: "Photo: Benjamin Voros / Unsplash" },
];
 
const QUOTES = [
  "오늘 하루도, 하나씩 천천히.",
  "작은 발걸음이 큰 여정을 만든다.",
  "시작이 반이다.",
  "집중하는 자만이 목적지에 닿는다.",
  "지금 이 순간이 가장 중요하다.",
  "포기하지 않는 것이 재능이다.",
  "어제보다 조금 더 나은 오늘.",
];
 
const DAYS_KO   = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
const MONTHS_KO = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
 
const LS_USER  = "momentum_user";
const LS_TODOS = "momentum_todos";
 
 
/* ══════════════════════════════════════════════════════════
   1. 랜덤 배경 이미지
══════════════════════════════════════════════════════════ */
(function initBg() {
  const bg     = BG_IMAGES[Math.floor(Math.random() * BG_IMAGES.length)];
  const el     = document.getElementById("bg");
  const credit = document.getElementById("bg-credit");
 
  // 이미지 로드 후 적용 (깜빡임 방지)
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url('${bg.url}')`;
    credit.textContent = bg.credit;
  };
  img.src = bg.url;
})();
 
 
/* ══════════════════════════════════════════════════════════
   2. 실시간 시계
══════════════════════════════════════════════════════════ */
(function initClock() {
  const hEl   = document.getElementById("h");
  const mEl   = document.getElementById("m");
  const sEl   = document.getElementById("s");
  const dateEl = document.getElementById("date-display");
 
  function pad(n) {
    return String(n).padStart(2, "0");
  }
 
  function tick() {
    const now = new Date();
    hEl.textContent = pad(now.getHours());
    mEl.textContent = pad(now.getMinutes());
    sEl.textContent = pad(now.getSeconds());
    dateEl.textContent =
      `${DAYS_KO[now.getDay()]} · ${MONTHS_KO[now.getMonth()]} ${now.getDate()}일 · ${now.getFullYear()}`;
  }
 
  tick();                      // 즉시 실행 (1초 공백 제거)
  setInterval(tick, 1000);     // 1초마다 갱신
})();
 
 
/* ══════════════════════════════════════════════════════════
   3. localStorage 로그인
══════════════════════════════════════════════════════════ */
(function initLogin() {
  const saved   = localStorage.getItem(LS_USER);
  const greetEl = document.getElementById("greeting");
  const formEl  = document.getElementById("login-form");
  const input   = document.getElementById("name-input");
  const btn     = document.getElementById("login-btn");
 
  function showGreeting(name) {
    const hour   = new Date().getHours();
    const prefix = hour < 12 ? "좋은 아침이에요,"
                 : hour < 18 ? "안녕하세요,"
                 :             "좋은 저녁이에요,";
 
    greetEl.innerHTML = `${prefix} <span class="name-accent">${name}</span> ✦`;
    greetEl.classList.remove("hidden");
    setTimeout(() => greetEl.classList.add("visible"), 50); // CSS 트랜지션 트리거
    formEl.classList.add("hidden");
  }
 
  // 저장된 이름이 있으면 바로 인사, 없으면 폼 노출
  if (saved) {
    showGreeting(saved);
  } else {
    formEl.classList.remove("hidden");
    setTimeout(() => formEl.classList.add("visible"), 200);
    input.focus();
  }
 
  function login() {
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    localStorage.setItem(LS_USER, name);   // localStorage에 저장
    showGreeting(name);
  }
 
  btn.addEventListener("click", login);
  input.addEventListener("keydown", e => { if (e.key === "Enter") login(); });
})();
 
 
/* ══════════════════════════════════════════════════════════
   4. localStorage 투두리스트
══════════════════════════════════════════════════════════ */
(function initTodo() {
  const listEl  = document.getElementById("todo-list");
  const inputEl = document.getElementById("todo-input");
  const addBtn  = document.getElementById("todo-add-btn");
  const countEl = document.getElementById("todo-count");
  const clearBtn = document.getElementById("clear-done-btn");
 
  // localStorage에서 불러오기 (없으면 빈 배열)
  let todos = JSON.parse(localStorage.getItem(LS_TODOS) || "[]");
 
  function save() {
    localStorage.setItem(LS_TODOS, JSON.stringify(todos)); // 배열 → 문자열 저장
  }
 
  function renderCount() {
    const remaining = todos.filter(t => !t.done).length;
    countEl.textContent = `${remaining}개 남음`;
  }
 
  function renderItem(todo) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");
    li.dataset.id = todo.id;
 
    // 체크박스
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "todo-check";
    check.checked = todo.done;
    check.addEventListener("change", () => {
      todo.done = check.checked;
      li.classList.toggle("done", todo.done);
      save();
      renderCount();
    });
 
    // 텍스트
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;
 
    // 삭제 버튼
    const del = document.createElement("button");
    del.className = "todo-del";
    del.textContent = "×";
    del.title = "삭제";
    del.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      // 부드러운 삭제 애니메이션
      li.style.opacity = "0";
      li.style.transform = "translateX(10px)";
      li.style.transition = "opacity 0.2s, transform 0.2s";
      setTimeout(() => li.remove(), 200);
      save();
      renderCount();
    });
 
    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(del);
    listEl.appendChild(li);
  }
 
  function render() {
    listEl.innerHTML = "";
    todos.forEach(renderItem);
    renderCount();
  }
 
  function addTodo() {
    const text = inputEl.value.trim();
    if (!text) return;
 
    const todo = { id: Date.now(), text, done: false };
    todos.push(todo);
    renderItem(todo);  // 전체 재렌더 없이 항목만 추가
    save();
    renderCount();
    inputEl.value = "";
    inputEl.focus();
  }
 
  addBtn.addEventListener("click", addTodo);
  inputEl.addEventListener("keydown", e => { if (e.key === "Enter") addTodo(); });
 
  // 완료 항목 일괄 삭제
  clearBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.done);
    save();
    render();
  });
 
  render(); // 초기 렌더링
})();
 
 
/* ══════════════════════════════════════════════════════════
   5. 랜덤 명언
══════════════════════════════════════════════════════════ */
(function initQuote() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById("quote").textContent = q;
})();
 
 
/* ══════════════════════════════════════════════════════════
   6. 날씨 & 위치 (Geolocation + Open-Meteo + Nominatim)
      → API 키 불필요, 무료 사용 가능
══════════════════════════════════════════════════════════ */
(function initWeather() {
  const locEl  = document.getElementById("weather-loc");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
 
  // WMO 날씨 코드 → 한국어 설명
  const WMO_CODES = {
    0:"맑음", 1:"대체로 맑음", 2:"구름 조금", 3:"흐림",
    45:"안개", 48:"안개",
    51:"이슬비", 53:"이슬비", 55:"이슬비",
    61:"비",   63:"비",       65:"강한 비",
    71:"눈",   73:"눈",       75:"강한 눈",
    80:"소나기", 81:"소나기", 82:"강한 소나기",
    95:"뇌우", 96:"뇌우",    99:"뇌우",
  };
 
  const WEATHER_ICONS = {
    0:"☀", 1:"🌤", 2:"⛅", 3:"☁",
    45:"🌫", 48:"🌫",
    51:"🌦", 53:"🌦", 55:"🌧",
    61:"🌧", 63:"🌧", 65:"🌧",
    71:"🌨", 73:"❄",  75:"❄",
    80:"🌦", 81:"🌧", 82:"⛈",
    95:"⛈", 96:"⛈", 99:"⛈",
  };
 
  // Open-Meteo API로 날씨 조회
  function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast`
              + `?latitude=${lat}&longitude=${lon}`
              + `&current=temperature_2m,weathercode&timezone=auto`;
 
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weathercode;
        tempEl.textContent = `${WEATHER_ICONS[code] || "🌡"} ${temp}°C`;
        descEl.textContent = WMO_CODES[code] || "—";
      })
      .catch(() => { tempEl.textContent = "날씨 오류"; });
  }
 
  // Nominatim 역지오코딩으로 도시명 조회
  function fetchCity(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ko`)
      .then(r => r.json())
      .then(data => {
        const addr = data.address;
        const city = addr.city || addr.town || addr.county || addr.state || "";
        locEl.textContent = city;
      })
      .catch(() => { locEl.textContent = "위치 불명"; });
  }
 
  // Geolocation API로 현재 위치 요청
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords;
        fetchCity(lat, lon);
        fetchWeather(lat, lon);
      },
      () => { locEl.textContent = "위치 권한 없음"; }
    );
  } else {
    locEl.textContent = "위치 미지원";
  }
})();
