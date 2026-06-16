/* =====================================================
   BAOCAO.JS — Giám sát & Báo cáo
   Hoàn thiện các chức năng theo nhận xét đánh giá UI/UX
   ===================================================== */

'use strict';

/* ─── DỮ LIỆU MẪU ─────────────────────────────────── */

const DATA_DOANHTHU = [
  // 31 ngày tháng 5/2026 (Friday–Sunday = cuối tuần cao hơn)
  {code:'HD-2571',date:'01/05',room:680000, dv:120000},
  {code:'HD-2572',date:'02/05',room:820000, dv:180000},
  {code:'HD-2573',date:'03/05',room:790000, dv:160000},
  {code:'HD-2574',date:'04/05',room:480000, dv: 80000},
  {code:'HD-2575',date:'05/05',room:510000, dv: 95000},
  {code:'HD-2576',date:'06/05',room:530000, dv:100000},
  {code:'HD-2577',date:'07/05',room:490000, dv: 85000},
  {code:'HD-2578',date:'08/05',room:710000, dv:140000},
  {code:'HD-2579',date:'09/05',room:850000, dv:190000},
  {code:'HD-2580',date:'10/05',room:800000, dv:170000},
  {code:'HD-2581',date:'11/05',room:460000, dv: 75000},
  {code:'HD-2582',date:'12/05',room:540000, dv:100000},
  {code:'HD-2583',date:'13/05',room:520000, dv: 95000},
  {code:'HD-2584',date:'14/05',room:500000, dv: 90000},
  {code:'HD-2585',date:'15/05',room:740000, dv:145000},
  {code:'HD-2586',date:'16/05',room:880000, dv:200000},
  {code:'HD-2587',date:'17/05',room:820000, dv:175000},
  {code:'HD-2588',date:'18/05',room:490000, dv: 80000},
  {code:'HD-2589',date:'19/05',room:510000, dv: 90000},
  {code:'HD-2590',date:'20/05',room:530000, dv:100000},
  {code:'HD-2591',date:'21/05',room:480000, dv: 85000},
  {code:'HD-2592',date:'22/05',room:720000, dv:150000},
  {code:'HD-2593',date:'23/05',room:860000, dv:195000},
  {code:'HD-2594',date:'24/05',room:780000, dv:160000},
  {code:'HD-2595',date:'25/05',room:500000, dv: 90000},
  {code:'HD-2596',date:'26/05',room:480000, dv: 80000},
  {code:'HD-2597',date:'27/05',room:520000, dv: 95000},
  {code:'HD-2598',date:'28/05',room:490000, dv: 85000},
  {code:'HD-2599',date:'29/05',room:700000, dv:140000},
  {code:'HD-2600',date:'30/05',room:840000, dv:185000},
  {code:'HD-2601',date:'31/05',room:760000, dv:155000},
];

const DATA_KHUNGGIO = [
  {label:'08:00', v: 4},
  {label:'10:00', v: 8},
  {label:'12:00', v:11},
  {label:'14:00', v:12},
  {label:'16:00', v:14},
  {label:'18:00', v:16},
  {label:'20:00', v:18},
  {label:'22:00', v:10},
  {label:'00:00', v: 3},
];

const DATA_NHATKY = [
  {time:'25/05 21:32', nv:'Nguyễn Văn A', action:'Mở phòng',    room:'101', result:'Thành công'},
  {time:'25/05 21:15', nv:'Nguyễn Văn A', action:'Đóng phòng',  room:'102', result:'Thành công'},
  {time:'25/05 20:58', nv:'Trần Thị B',   action:'Mở phòng',    room:'201', result:'Thất bại'},
  {time:'25/05 20:30', nv:'Nguyễn Văn A', action:'Mở phòng',    room:'303', result:'Thành công'},
  {time:'25/05 20:10', nv:'Lê Văn C',     action:'Mở phòng',    room:'204', result:'Thành công'},
  {time:'25/05 19:45', nv:'Phạm Thị D',   action:'Thanh toán',  room:'403', result:'Thành công'},
  {time:'25/05 19:20', nv:'Trần Thị B',   action:'Chuyển phòng',room:'102', result:'Thành công'},
  {time:'25/05 18:55', nv:'Lê Văn C',     action:'Đóng phòng',  room:'301', result:'Thành công'},
  {time:'25/05 18:30', nv:'Nguyễn Văn A', action:'Thanh toán',  room:'205', result:'Thành công'},
  {time:'25/05 18:00', nv:'Phạm Thị D',   action:'Mở phòng',    room:'104', result:'Thất bại'},
  {time:'24/05 22:10', nv:'Trần Thị B',   action:'Đóng phòng',  room:'202', result:'Thành công'},
  {time:'24/05 21:45', nv:'Lê Văn C',     action:'Thanh toán',  room:'101', result:'Thành công'},
  {time:'24/05 21:00', nv:'Nguyễn Văn A', action:'Mở phòng',    room:'305', result:'Thành công'},
  {time:'24/05 20:30', nv:'Phạm Thị D',   action:'Chuyển phòng',room:'203', result:'Thành công'},
  {time:'24/05 19:50', nv:'Trần Thị B',   action:'Mở phòng',    room:'401', result:'Thành công'},
];

/* ─── QUẢN LÝ VIEW ─────────────────────────────────── */

function showView(name) {
  document.getElementById('viewOverview').style.display = 'none';
  document.getElementById('viewReport').style.display   = 'none';
  document.getElementById('viewLog').style.display      = 'none';

  if (name === 'overview') {
    document.getElementById('viewOverview').style.display = '';
  } else if (name === 'report') {
    document.getElementById('viewReport').style.display = '';
  } else if (name === 'log') {
    document.getElementById('viewLog').style.display = '';
    renderLogTable(DATA_NHATKY);
  }
  window.scrollTo(0, 0);
}

/* ─── ĐIỀU HƯỚNG TỪ TRANG TỔNG QUAN ──────────────── */

document.getElementById('cardBaoCao').addEventListener('click', function(e) {
  if (e.target.closest('.fc-link')) e.preventDefault();
  showView('report');
});

document.getElementById('btnOpenReport').addEventListener('click', function(e) {
  e.preventDefault();
  showView('report');
});

/* ─── TAB SWITCHING ───────────────────────────────── */

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('tab' + cap(this.dataset.tab)).classList.add('active');
  });
});

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ─── FILTER VALIDATION + FIX 6: DISABLE BUTTON ─── */

function setupFilter(monthId, fromId, toId, btnId, dataId, hintId, onView) {
  const mInp  = document.getElementById(monthId);
  const fInp  = document.getElementById(fromId);
  const tInp  = document.getElementById(toId);
  const btn   = document.getElementById(btnId);

  function check() {
    const monthOk = /^\d{2}\/\d{2}$/.test(mInp.value.trim());
    const rangeOk = fInp.value !== '' && tInp.value !== '';

    // FIX 6: chỉ enable khi có ít nhất 1 chế độ lọc hợp lệ
    btn.disabled = !(monthOk || rangeOk);

    // FIX 7: làm mờ nhóm kia khi một nhóm đang được dùng
    const fromGroup = fInp.closest('.filter-group');
    const toGroup   = tInp.closest('.filter-group');

    if (mInp.value.trim().length > 0) {
      if (fromGroup) fromGroup.classList.add('dimmed');
      if (toGroup)   toGroup.classList.add('dimmed');
    } else {
      if (fromGroup) fromGroup.classList.remove('dimmed');
      if (toGroup)   toGroup.classList.remove('dimmed');
    }

    if (fInp.value || tInp.value) {
      mInp.closest('.filter-group').classList.add('dimmed');
    } else {
      mInp.closest('.filter-group').classList.remove('dimmed');
    }
  }

  mInp.addEventListener('input', check);
  fInp.addEventListener('change', check);
  tInp.addEventListener('change', check);

  // Tự động format MM/YY
  mInp.addEventListener('input', function () {
    let v = this.value.replace(/\D/g,'');
    if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,4);
    this.value = v;
  });

  btn.addEventListener('click', function () {
    if (!btn.disabled) {
      document.getElementById(hintId).style.display = 'none';

      let valM = mInp ? mInp.value.trim() : '';
      let valF = fInp ? fInp.value.trim() : '';
      let valT = tInp ? tInp.value.trim() : '';
      
      // MOCK LOGIC: Dữ liệu mẫu chỉ có của tháng 05/2026.
      let hasData = false;
      if (valM.includes('05')) hasData = true;
      if (valF.includes('/05/') || valF.includes('/5/')) hasData = true;
      if (valT.includes('/05/') || valT.includes('/5/')) hasData = true;
      if (!valM && !valF && !valT) hasData = false;
      
      let emptyId = dataId + 'Empty';
      let elEmpty = document.getElementById(emptyId);
      if (!elEmpty) {
          elEmpty = document.createElement('div');
          elEmpty.id = emptyId;
          elEmpty.className = '';
          elEmpty.innerHTML = `
<div class="empty-state" style="width: 100%;">
  <div class="es-warn" style="margin-bottom: 16px;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top: -2px;">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
    Không có dữ liệu trong khoảng thời gian đã chọn.
  </div>
  <div class="es-body" style="border: 1px solid var(--c-border); border-radius: var(--radius-lg); background: var(--c-white); padding: 80px 0;">
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
       <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
       <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
       <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
    <p style="margin-top: 16px; font-size: 16px; color: #a1a1aa; font-weight: 500;">Không có dữ liệu trong khoảng thời gian đã chọn</p>
  </div>
</div>`;
          document.getElementById(dataId).parentNode.appendChild(elEmpty);
      }

      if (hasData) {
          document.getElementById(dataId).style.display = '';
          elEmpty.style.display = 'none';
          onView && onView();
      } else {
          document.getElementById(dataId).style.display = 'none';
          elEmpty.style.display = 'flex';
      }
    }
  });
}

/* Khởi tạo từng tab */
setupFilter('dtMonth','dtFrom','dtTo','btnViewDt','dataDt','hintDt', function () {
  renderDoanhThuTable(DATA_DOANHTHU, 1);
  setTimeout(() => drawBarChart('chartDt',
    DATA_DOANHTHU.map(d => d.date),
    DATA_DOANHTHU.map(d => d.room),
    'VNĐ'
  ), 50);
});

setupFilter('dvMonth','dvFrom','dvTo','btnViewDv','dataDv','hintDv', null);

setupFilter('kgMonth','kgFrom','kgTo','btnViewKg','dataKg','hintKg', function () {
  setTimeout(() => drawBarChart('chartKg',
    DATA_KHUNGGIO.map(d => d.label),
    DATA_KHUNGGIO.map(d => d.v),
    'số lượt'
  ), 50);
});

setupFilter('ccMonth','ccFrom','ccTo','btnViewCc','dataCc','hintCc', null);

/* ─── BẢNG DOANH THU (PHÂN TRANG) ────────────────── */

const PAGE_SIZE = 6;
let dtPage = 1;

function renderDoanhThuTable(data, page) {
  const tbody = document.getElementById('tbodyDt');
  const start = (page - 1) * PAGE_SIZE;
  const slice = data.slice(start, start + PAGE_SIZE);
  // Mã HĐ: td-link (teal, left) | Ngày: center (default) | Tiền: td-r (right)
  tbody.innerHTML = slice.map(r =>
    `<tr>
       <td class="td-link">${r.code}</td>
       <td>${r.date}</td>
       <td class="td-r">${fmt(r.room)}</td>
       <td class="td-r">${fmt(r.dv)}</td>
       <td class="td-r">${fmt(r.room + r.dv)}</td>
     </tr>`
  ).join('');
  renderPagination('pagesDt', data, page, 'renderDoanhThuTable', 'DATA_DOANHTHU');
}

function renderPagination(containerId, dataArray, current, renderFnName, dataVarName, pageSize = PAGE_SIZE) {
  const total = Math.ceil(dataArray.length / pageSize);
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML =
    `<button class="page-btn" onclick="${renderFnName}(${dataVarName},${Math.max(1,current-1)})" ${current<=1?'disabled':''}>‹</button>
     <span class="page-current">${current}</span>
     <button class="page-btn" onclick="${renderFnName}(${dataVarName},${Math.min(total,current+1)})" ${current>=total?'disabled':''}>›</button>`;
}

function fmt(n) {
  return n.toLocaleString('vi-VN') + ' đ';
}

/* ─── NHẬT KÝ HỆ THỐNG ───────────────────────────── */

let currentLogFiltered = []; // Lưu lại danh sách đã lọc để phân trang đúng
const LOG_PAGE_SIZE = 10;

function renderLogTable(data, page = 1) {
  const tbody = document.getElementById('tbodyLog');
  const empty = document.getElementById('logEmpty');

  if (data.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = '';
    document.getElementById('pagesLog').innerHTML = '';
    return;
  }
  empty.style.display = 'none';

  currentLogFiltered = data; // Cập nhật danh sách hiện tại
  const start = (page - 1) * LOG_PAGE_SIZE;
  const slice = data.slice(start, start + LOG_PAGE_SIZE);

  // Nhật ký: tất cả center (default td) | Kết quả: màu + bold
  tbody.innerHTML = slice.map(r => {
    const cls = r.result === 'Thành công' ? 'result-ok' : 'result-fail';
    return `<tr>
      <td>${r.time}</td>
      <td>${r.nv}</td>
      <td>${r.action}</td>
      <td>${r.room}</td>
      <td class="${cls}">${r.result}</td>
    </tr>`;
  }).join('');

  renderPagination('pagesLog', data, page, 'renderLogTable', 'currentLogFiltered', LOG_PAGE_SIZE);
}

function applyLogFilter() {
  const action   = document.getElementById('logAction').value;
  const employee = document.getElementById('logEmployee').value.trim().toLowerCase();

  const filtered = DATA_NHATKY.filter(r => {
    const matchAction   = !action   || r.action === action;
    const matchEmployee = !employee || r.nv.toLowerCase().includes(employee);
    return matchAction && matchEmployee;
  });

  renderLogTable(filtered, 1);
}

function resetLogFilter() {
  document.getElementById('logAction').value   = '';
  document.getElementById('logEmployee').value = '';
  document.getElementById('logFrom').value     = '2026-05-01';
  document.getElementById('logTo').value       = '2026-05-25';
  renderLogTable(DATA_NHATKY, 1);
}

/* ─── MODAL XÁC THỰC ─────────────────────────────── */

const ADMIN_PASSWORD = 'admin123';

const authModal    = document.getElementById('authModal');
const authPassword = document.getElementById('authPassword');
const authError    = document.getElementById('authError');
/* FIX 1: không giữ reference lockWrap nữa — icon khóa không bao giờ được thay đổi */

function openAuthModal() {
  authPassword.value = '';
  authError.style.display = 'none';
  authPassword.classList.remove('input-error');
  /* FIX 1: xóa dòng lockWrap.classList.remove('error-state') — icon ở nguyên teal */
  authModal.classList.add('show');
  setTimeout(() => authPassword.focus(), 280);
}

function closeAuthModal() {
  authModal.classList.remove('show');
}

document.getElementById('cardNhatKy').addEventListener('click', function(e) {
  if (e.target.closest('.fc-link')) e.preventDefault();
  openAuthModal();
});

document.getElementById('btnOpenAuth').addEventListener('click', function(e) {
  e.preventDefault();
  openAuthModal();
});

document.getElementById('btnCloseAuth').addEventListener('click', closeAuthModal);
document.getElementById('btnCancelAuth').addEventListener('click', closeAuthModal);

authModal.addEventListener('click', e => { if (e.target === authModal) closeAuthModal(); });

document.getElementById('btnConfirmAuth').addEventListener('click', validatePassword);
authPassword.addEventListener('keydown', e => { if (e.key === 'Enter') validatePassword(); });

function validatePassword() {
  const pw = authPassword.value;

  if (pw === '') {
    showAuthError('Vui lòng nhập mật khẩu.');
    return;
  }

  if (pw !== ADMIN_PASSWORD) {
    showAuthError('Mật khẩu không đúng, vui lòng thử lại.');
    return;
  }

  // Đúng mật khẩu
  closeAuthModal();
  showView('log');
}

function showAuthError(msg) {
  document.getElementById('authErrorMsg').textContent = msg;
  authError.style.display = 'flex';
  authPassword.classList.add('input-error');
  /* FIX 1: xóa lockWrap.classList.add('error-state') — lỗi chỉ hiện ở banner + border input */
  authPassword.value = '';   // clear field on error
  setTimeout(() => authPassword.focus(), 50);
}

/* ─── XUẤT FILE (SIMULATION + TOAST) ─────────────── */

function triggerExport(type, name) {
  const map = {
    'doanh-thu': 'dataDt',
    'dich-vu': 'dataDv',
    'khung-gio': 'dataKg',
    'cham-cong': 'dataCc'
  };
  
  const dataId = map[name];
  if (dataId) {
    const dataEl = document.getElementById(dataId);
    if (!dataEl || dataEl.style.display === 'none') {
       showToastBc('error', 'Không có dữ liệu!', 'Vui lòng chọn thời gian và xem báo cáo trước khi xuất file.');
       return;
    }
  }

  // Giả lập 85% thành công, 15% thất bại
  const ok = Math.random() > 0.15;
  const ext = type === 'Excel' ? 'xlsx' : 'pdf';
  const slug = name + '-05-2026.' + ext;
  if (ok) {
    showToastBc('success', 'Xuất file thành công!', slug + ' đã được tải về thiết bị');
  } else {
    showToastBc('error', 'Xuất file thất bại!', 'Không thể tạo file. Vui lòng thử lại sau');
  }
}

/* ─── HỆ THỐNG TOAST ─────────────────────────────── */

function showToastBc(type, title, desc) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconHtml = '';
  if (type === 'success') {
    iconHtml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  } else {
    iconHtml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  }

  toast.innerHTML =
    `<div class="toast-icon-wrap">${iconHtml}</div>
     <div class="toast-body">
       <div class="toast-title">${title}</div>
       <div class="toast-desc">${desc}</div>
     </div>
     <button class="toast-x" onclick="this.parentElement.remove()">
       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
     </button>`;

  container.prepend(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/* ─── FIX 2: VẼ BIỂU ĐỒ CÓ TRỤC Y ──────────────── */

function drawBarChart(canvasId, labels, values, unit) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // High-DPI support
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;

  // FIX 2: padding trái đủ lớn cho nhãn trục Y
  const pad = { top: 12, right: 12, bottom: 32, left: 64 };
  const cW  = W - pad.left - pad.right;
  const cH  = H - pad.top  - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  const maxVal = Math.max(...values) * 1.15;
  const niceMax = getNiceMax(maxVal);
  const Y_STEPS = 5;

  // ─── Trục Y: gridlines + nhãn ───
  for (let i = 0; i <= Y_STEPS; i++) {
    const val = (niceMax / Y_STEPS) * i;
    const y   = pad.top + cH - (cH * i / Y_STEPS);

    // Gridline
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cW, y);
    ctx.stroke();

    // Nhãn trục Y
    ctx.fillStyle = '#94a3b8';
    ctx.font      = `${11 * Math.min(W/400, 1)}px Segoe UI, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(fmtY(val, unit), pad.left - 6, y + 4);
  }

  // ─── Thanh bar ───
  const barSpace  = cW / labels.length;
  const barWidth  = barSpace * (labels.length > 15 ? 0.8 : 0.65);
  const barOffset = (barSpace - barWidth) / 2;

  values.forEach((val, i) => {
    const x   = pad.left + i * barSpace + barOffset;
    const bH  = (val / niceMax) * cH;
    const y   = pad.top + cH - bH;
    const r   = Math.min(3, barWidth / 2);

    // Màu primary theo design system
    ctx.fillStyle = '#007DB7';
    roundedRect(ctx, x, y, barWidth, bH, r);
    ctx.fill();

    // Nhãn trục X (thưa để tránh chồng chéo)
    const every = Math.ceil(labels.length / 8);
    if (i % every === 0 || i === labels.length - 1) {
      ctx.fillStyle = '#94a3b8';
      ctx.font      = `10px Segoe UI, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barWidth / 2, H - 8);
    }
  });
}

/* Vẽ rect có góc tròn trên cùng */
function roundedRect(ctx, x, y, w, h, r) {
  if (h <= 0) return;
  r = Math.min(r, h);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getNiceMax(v) {
  if (v <= 0) return 10;
  const mag  = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / mag) * mag;
}

function fmtY(v, unit) {
  if (unit === 'VNĐ') {
    if (v === 0) return '0';
    if (v >= 1000000) return (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'Tr';
    if (v >= 1000)    return Math.round(v / 1000) + 'K';
    return String(v);
  }
  return v === 0 ? '0' : String(v);
}

/* Vẽ lại chart khi resize */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (document.getElementById('chartDt')) {
      const dv = document.getElementById('dataDt');
      if (dv && dv.style.display !== 'none') {
        drawBarChart('chartDt',
          DATA_DOANHTHU.map(d => d.date),
          DATA_DOANHTHU.map(d => d.room), 'VNĐ');
      }
    }
    if (document.getElementById('chartKg')) {
      const dk = document.getElementById('dataKg');
      if (dk && dk.style.display !== 'none') {
        drawBarChart('chartKg',
          DATA_KHUNGGIO.map(d => d.label),
          DATA_KHUNGGIO.map(d => d.v), 'số lượt');
      }
    }
  }, 200);
});

/* ─── KHỞI TẠO ───────────────────────────────────── */

// Hiện view mặc định
showView('overview');