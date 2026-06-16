if (document.querySelector('.room-card')) {
        // Lấy danh sách tất cả các phòng và phần tử bảng để cập nhật
        const rooms = document.querySelectorAll('.room-card');
        const tableBody = document.getElementById('table-body');

        // Thêm sự kiện click cho từng phòng
        rooms.forEach(room => {
            room.addEventListener('click', function() {
                // Xóa class 'selected' ở tất cả các phòng
                rooms.forEach(r => r.classList.remove('selected'));
                
                // Thêm class 'selected' cho phòng vừa click
                this.classList.add('selected');

                // Lấy tên phòng từ thuộc tính data-name
                const roomName = this.getAttribute('data-name');

                // Cập nhật lại nội dung bảng ở dưới footer
                tableBody.innerHTML = `
                    <tr>
                        <td>${roomName}</td>
                        <td></td>
                        <td>--/--/--  --:--:--</td>
                        <td>--/--/--  --:--:--</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                `;
            });
        });
        // --- XỬ LÝ CONTEXT MENU (CHUỘT PHẢI) ---
const contextMenu = document.getElementById('roomContextMenu');
const menuItems = {
    reserve: document.getElementById('menu-reserve'),
    cancel: document.getElementById('menu-cancel'),
    transfer: document.getElementById('menu-transfer'),
    checkin: document.getElementById('menu-checkin'),
    checkout: document.getElementById('menu-checkout'),
    service: document.getElementById('menu-service')
};

// Hàm bật/tắt (enable/disable) 1 menu item
function setItemState(item, isEnabled) {
    if (isEnabled) {
        item.classList.remove('disabled');
    } else {
        item.classList.add('disabled');
    }
}

// Bắt sự kiện chuột phải cho từng phòng
rooms.forEach(room => {
    room.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // Chặn menu mặc định của trình duyệt

        // Xác định trạng thái phòng hiện tại dựa vào class
        const isAvailable = this.classList.contains('bg-available');
        const isReserved = this.classList.contains('bg-reserved');
        const isInUse = this.classList.contains('bg-in-use');

        // Logic ẩn/hiện nút dựa theo trạng thái
        if (isAvailable) {
            // Phòng trống: Chỉ hiện Đặt trước và Tạo phiếu
            setItemState(menuItems.reserve, true);
            setItemState(menuItems.cancel, false);
            setItemState(menuItems.transfer, false);
            setItemState(menuItems.checkin, true);
            setItemState(menuItems.checkout, false);
            setItemState(menuItems.service, false);
            
        } else if (isReserved) {
            // Đã đặt: Huỷ đặt, Chuyển phòng, Tạo phiếu
            setItemState(menuItems.reserve, false);
            setItemState(menuItems.cancel, true);
            setItemState(menuItems.transfer, true);
            setItemState(menuItems.checkin, true);
            setItemState(menuItems.checkout, false);
            setItemState(menuItems.service, false);

        } else if (isInUse) {
            // Đang mở (Đang sử dụng): Chuyển phòng, Tạo phiếu (kèm Thanh toán/Dịch vụ)
            setItemState(menuItems.reserve, false);
            setItemState(menuItems.cancel, false);
            setItemState(menuItems.transfer, true);
            setItemState(menuItems.checkin, true);
            setItemState(menuItems.checkout, true);
            setItemState(menuItems.service, true);
        }

        // Lấy tọa độ chuột để đặt vị trí xuất hiện của menu
        let x = e.pageX;
        let y = e.pageY;
        
        // Điều chỉnh nếu menu bị tràn ra ngoài viền phải hoặc dưới của màn hình
        if (x + 240 > window.innerWidth) x = window.innerWidth - 250;
        if (y + 250 > window.innerHeight) y = window.innerHeight - 260;

        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.style.display = 'block'; // Hiển thị menu
    });
});

// Click chuột trái ra ngoài thì tự động ẩn menu đi
document.addEventListener('click', function(e) {
    // Nếu click không trúng vào menu thì ẩn menu
    if (e.target.closest('.context-menu') === null) {
        contextMenu.style.display = 'none';
    }
});
// --- XỬ LÝ POPUP CHUYỂN PHÒNG ---
const transferModal = document.getElementById('transferModal');
const transferFromInput = document.getElementById('transferFrom');
const transferToInput = document.getElementById('transferTo');
const transferList = document.getElementById('transferList');
const transferError = document.getElementById('transferError');
const btnConfirm = document.getElementById('btnConfirmTransfer');
const btnCancel = document.getElementById('btnCancelTransfer');

let currentRightClickedRoom = ""; // Lưu tạm phòng đang được click chuột phải

// Lấy tên phòng khi click chuột phải (Thêm dòng này vào trong sự kiện contextmenu cũ)
rooms.forEach(room => {
    room.addEventListener('contextmenu', function(e) {
        currentRightClickedRoom = this.getAttribute('data-name'); 
        // ... (Các code xử lý menu hiển thị ở bài trước giữ nguyên) ...
    });
});

// Khi bấm "Chuyển phòng" trong menu chuột phải
menuItems.transfer.addEventListener('click', function() {
    if (this.classList.contains('disabled')) return;
    
    // Gán tên phòng vào ô "Chuyển từ" và reset form
    transferFromInput.value = currentRightClickedRoom;
    transferToInput.value = "";
    transferError.style.display = 'none';
    transferList.style.display = 'none';
    
    // Xóa class selected cũ trong list
    const items = transferList.querySelectorAll('li');
    items.forEach(i => i.classList.remove('selected'));

    // Ẩn context menu và hiện modal
    contextMenu.style.display = 'none';
    transferModal.style.display = 'flex';
});

// Xử lý Custom Dropdown (Tìm kiếm và chọn)
transferToInput.addEventListener('focus', () => {
    transferList.style.display = 'block';
});

// Lọc danh sách khi gõ phím
transferToInput.addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const items = transferList.querySelectorAll('li');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Chọn phòng từ danh sách
transferList.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        transferToInput.value = e.target.textContent;
        transferList.style.display = 'none';
        transferError.style.display = 'none'; // Ẩn lỗi nếu đã chọn
        
        // Thêm class selected để highlight màu #5CCBFF mờ
        const items = transferList.querySelectorAll('li');
        items.forEach(i => i.classList.remove('selected'));
        e.target.classList.add('selected');
    }
});

// Ẩn danh sách nếu click ra ngoài
document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-dropdown')) {
        transferList.style.display = 'none';
    }
});

// Bấm Huỷ thoát popup
btnCancel.addEventListener('click', () => {
    transferModal.style.display = 'none';
});

// Bấm Xác nhận
btnConfirm.addEventListener('click', () => {
    if (transferToInput.value.trim() === "") {
        // Hiện thông báo đỏ nếu chưa chọn
        transferError.style.display = 'flex';
    } else {
        // Thành công: Đóng modal và gọi thông báo Toast
        transferModal.style.display = 'none';
        showToast('Chuyển phòng thành công!', 'Thông tin đã được lưu vào hệ thống');
    }
});
// --- XỬ LÝ THÔNG BÁO TOAST ---
const toastMessage = document.getElementById('toastMessage');
const toastClose = document.querySelector('.toast-close');
let toastTimeout;
// Thay thế hàm showToast cũ bằng hàm mới có tham số (title, desc)
function showToast(title, desc) {
    document.querySelector('.toast-title').textContent = title;
    document.querySelector('.toast-desc').textContent = desc;
    
    toastMessage.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000);
}

// Tìm chỗ btnConfirm của popup Chuyển phòng trước đó, sửa lệnh showToast() thành:
// showToast('Chuyển phòng thành công!', 'Thông tin đã được lưu vào hệ thống');

toastClose.addEventListener('click', () => {
    toastMessage.classList.remove('show');
});

// --- XỬ LÝ POPUP ĐẶT TRƯỚC PHÒNG ---
const reserveModal = document.getElementById('reserveModal');
const reserveName = document.getElementById('reserveName');
const reservePhone = document.getElementById('reservePhone');
const reserveTime = document.getElementById('reserveTime');
const phoneError = document.getElementById('phoneError');
const timeError = document.getElementById('timeError');

// Mở popup khi chọn "Đặt trước phòng" từ menu chuột phải
menuItems.reserve.addEventListener('click', function() {
    if (this.classList.contains('disabled')) return;
    
    // Reset lại form cho sạch sẽ mỗi khi mở
    reserveName.value = '';
    reservePhone.value = '';
    reserveTime.value = '';
    reservePhone.classList.remove('input-error-border');
    reserveTime.classList.remove('input-error-border');
    phoneError.style.display = 'none';
    timeError.style.display = 'none';

    // Ẩn menu chuột phải và hiện popup đặt phòng
    contextMenu.style.display = 'none';
    reserveModal.style.display = 'flex';
});

// Nút Huỷ
document.getElementById('btnCancelReserve').addEventListener('click', () => {
    reserveModal.style.display = 'none';
});

// Nút Xác nhận
document.getElementById('btnConfirmReserve').addEventListener('click', () => {
    let isValid = true;

    // Kiểm tra số điện thoại
    if (reservePhone.value.trim() === '') {
        reservePhone.classList.add('input-error-border');
        phoneError.style.display = 'flex';
        isValid = false;
    } else {
        reservePhone.classList.remove('input-error-border');
        phoneError.style.display = 'none';
    }

    // Kiểm tra thời gian
    if (reserveTime.value.trim() === '') {
        reserveTime.classList.add('input-error-border');
        timeError.style.display = 'flex';
        isValid = false;
    } else {
        reserveTime.classList.remove('input-error-border');
        timeError.style.display = 'none';
    }

    // Nếu tất cả đều hợp lệ
    if (isValid) {
        reserveModal.style.display = 'none';
        showToast('Đặt phòng thành công!', 'Thông tin đã được lưu vào hệ thống');
    }
});
// --- XỬ LÝ POPUP HUỶ ĐẶT PHÒNG ---
const cancelModal = document.getElementById('cancelModal');
const btnConfirmCancel = document.getElementById('btnConfirmCancel');
const btnCancelCancel = document.getElementById('btnCancelCancel');

// Mở popup khi chọn "Huỷ đặt trước phòng" từ menu chuột phải
menuItems.cancel.addEventListener('click', function() {
    if (this.classList.contains('disabled')) return;

    // Ẩn menu chuột phải và hiển thị popup xác nhận huỷ
    contextMenu.style.display = 'none';
    cancelModal.style.display = 'flex';
});

// Bấm nút Huỷ (Đóng popup, không thực hiện huỷ nữa)
btnCancelCancel.addEventListener('click', () => {
    cancelModal.style.display = 'none';
});

// Bấm nút Xác nhận huỷ
btnConfirmCancel.addEventListener('click', () => {
    // Đóng popup xác nhận
    cancelModal.style.display = 'none';
    
    // Hiển thị thông báo Toast màu xanh ở góc phải màn hình
    showToast('Hủy đặt phòng thành công!', 'Thông tin đã được lưu vào hệ thống');
});

// --- XỬ LÝ POPUP TẠO PHIẾU THUÊ PHÒNG ---
const checkinModal = document.getElementById('checkinModal');
const checkinId = document.getElementById('checkinId');
const checkinName = document.getElementById('checkinName');
const checkinPhone = document.getElementById('checkinPhone');
const checkinDate = document.getElementById('checkinDate');

const errCheckinName = document.getElementById('errCheckinName');
const errCheckinPhone = document.getElementById('errCheckinPhone');
const errCheckinDate = document.getElementById('errCheckinDate');

// Hàm tự động tạo Mã phiếu thuê (VD: MS16062026xx)
function generateCheckinId() {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const rand = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `MS${d}${m}${y}${rand}`;
}

// Hàm reset và mở form Tạo phiếu
function openCheckinModal() {
    // Sinh mã và xoá trắng dữ liệu cũ
    checkinId.value = generateCheckinId();
    checkinName.value = '';
    checkinPhone.value = '';
    checkinDate.value = '';

    // Tắt hết các thông báo đỏ đang đè lên input
    errCheckinName.style.display = 'none';
    errCheckinPhone.style.display = 'none';
    errCheckinDate.style.display = 'none';

    // Đóng menu chuột phải (nếu đang mở) và hiện popup
    contextMenu.style.display = 'none';
    checkinModal.style.display = 'flex';
}

// Lắng nghe sự kiện click từ Menu chuột phải
menuItems.checkin.addEventListener('click', function() {
    if (this.classList.contains('disabled')) return;
    openCheckinModal();
});

// Lắng nghe sự kiện Double Click (Chuột trái đúp) vào các phòng trống & đã đặt
// Lắng nghe sự kiện Double Click vào phòng
rooms.forEach(room => {
    room.addEventListener('dblclick', function() {
        const isAvailable = this.classList.contains('bg-available');
        const isReserved = this.classList.contains('bg-reserved');
        const isInUse = this.classList.contains('bg-in-use');
        
        // Trống hoặc Đã đặt -> Tạo phiếu thuê
        if (isAvailable || isReserved) {
            openCheckinModal();
        } 
        // Đang sử dụng -> Thanh toán
        else if (isInUse) {
            openCheckoutModal();
        }
    });
});

// Sự kiện: Khi click vào thông báo đỏ, sẽ tự động ẩn báo lỗi và trỏ chuột vào ô input
[errCheckinName, errCheckinPhone, errCheckinDate].forEach(errDiv => {
    errDiv.addEventListener('click', function() {
        this.style.display = 'none';
        // Tìm ô input tương ứng với thông báo lỗi để focus vào (vd: errCheckinName -> checkinName)
        const inputId = this.id.replace('err', '');
        const actualInputId = inputId.charAt(0).toLowerCase() + inputId.slice(1);
        document.getElementById(actualInputId).focus();
    });
});

// Nút Huỷ
// Bấm "Huỷ" ở form Tạo Phiếu
document.getElementById('btnCancelCheckin').addEventListener('click', () => {
    document.getElementById('cancelCheckinConfirmModal').style.display = 'flex';
});

// Bấm "Xác nhận" (Đồng ý huỷ tạo phiếu)
document.getElementById('btnYesCancelCheckin').addEventListener('click', () => {
    document.getElementById('cancelCheckinConfirmModal').style.display = 'none';
    checkinModal.style.display = 'none'; // Đóng cả form tạo phiếu
});

// Bấm "Huỷ" (Không huỷ nữa, quay lại form)
document.getElementById('btnNoCancelCheckin').addEventListener('click', () => {
    document.getElementById('cancelCheckinConfirmModal').style.display = 'none';
});

// Nút Xác nhận và Validate thông tin
document.getElementById('btnConfirmCheckin').addEventListener('click', () => {
    let isValid = true;

    if (checkinName.value.trim() === '') {
        errCheckinName.style.display = 'flex';
        isValid = false;
    }
    
    if (checkinPhone.value.trim() === '') {
        errCheckinPhone.style.display = 'flex';
        isValid = false;
    }
    
    if (checkinDate.value.trim() === '') {
        errCheckinDate.style.display = 'flex';
        isValid = false;
    }

    // Nếu thông tin điền đầy đủ
    if (isValid) {
        checkinModal.style.display = 'none';
        showToast('Tạo phiếu thuê thành công!', 'Thông tin đã được lưu vào hệ thống');
    }
});

// --- XỬ LÝ POPUP THANH TOÁN ---
const checkoutModal = document.getElementById('checkoutModal');
const cancelCheckoutConfirmModal = document.getElementById('cancelCheckoutConfirmModal');

// Hàm mở form thanh toán
function openCheckoutModal() {
    contextMenu.style.display = 'none';
    checkoutModal.style.display = 'flex';
}

// Click chuột phải chọn "Thanh toán"
menuItems.checkout.addEventListener('click', function() {
    if (this.classList.contains('disabled')) return;
    openCheckoutModal();
});

// Bấm "Thanh toán" (Xác nhận)
document.getElementById('btnConfirmCheckout').addEventListener('click', () => {
    checkoutModal.style.display = 'none';
    showToast('Thanh toán thành công!', 'Thông tin đã được lưu vào hệ thống');
});

// Bấm "Huỷ" ở form Thanh toán
document.getElementById('btnCancelCheckout').addEventListener('click', () => {
    cancelCheckoutConfirmModal.style.display = 'flex';
});

// Bấm "Xác nhận" (Đồng ý huỷ quá trình thanh toán)
document.getElementById('btnYesCancelCheckout').addEventListener('click', () => {
    cancelCheckoutConfirmModal.style.display = 'none';
    checkoutModal.style.display = 'none'; // Đóng cả form thanh toán
});

// Bấm "Huỷ" (Không huỷ thanh toán nữa)
document.getElementById('btnNoCancelCheckout').addEventListener('click', () => {
    cancelCheckoutConfirmModal.style.display = 'none';
});
}

/* ================= QUẢN LÝ DỊCH VỤ ================= */

if (document.getElementById("dvTableBody")) {
    let services = JSON.parse(localStorage.getItem("dichVuList")) || [
        {
            id: "DV-001",
            name: "Nước suối Aquafina",
            type: "Đồ uống",
            unit: "Chai",
            price: 15000,
            quantity: 42,
            status: "Đang kinh doanh"
        },
        {
            id: "DV-002",
            name: "Thuê trống cầm tay",
            type: "Phụ kiện",
            unit: "Cái",
            price: 10000,
            quantity: 15,
            status: "Đang kinh doanh"
        },
        {
            id: "DV-003",
            name: "Gói hạt hướng dương",
            type: "Đồ ăn nhanh",
            unit: "Gói",
            price: 20000,
            quantity: 0,
            status: "Hết hàng"
        },
        {
            id: "DV-004",
            name: "Thuê mic",
            type: "Phụ kiện",
            unit: "Cái",
            price: 20000,
            quantity: 3,
            status: "Đang kinh doanh"
        },
        {
            id: "DV-005",
            name: "Gói trang trí sinh nhật",
            type: "Sự kiện",
            unit: "Gói",
            price: 250000,
            quantity: 0,
            status: "Tạm ngừng"
        }
    ];

    let selectedIndex = null;
    let editingIndex = null;

    const dvTableBody = document.getElementById("dvTableBody");
    const dvSearch = document.getElementById("dvSearch");
    const dvTotal = document.getElementById("dvTotal");

    const dvModal = document.getElementById("dvModal");
    const dvDeleteModal = document.getElementById("dvDeleteModal");
    const dvModalTitle = document.getElementById("dvModalTitle");

    const dvId = document.getElementById("dvId");
    const dvName = document.getElementById("dvName");
    const dvType = document.getElementById("dvType");
    const dvUnit = document.getElementById("dvUnit");
    const dvPrice = document.getElementById("dvPrice");
    const dvQuantity = document.getElementById("dvQuantity");
    const dvStatus = document.getElementById("dvStatus");
    const dvError = document.getElementById("dvError");

    function saveLocal() {
        localStorage.setItem("dichVuList", JSON.stringify(services));
    }

    function formatMoney(value) {
        return Number(value).toLocaleString("vi-VN") + " đ";
    }

    function getStatusClass(status) {
        if (status === "Đang kinh doanh") return "dv-status-green";
        if (status === "Hết hàng") return "dv-status-orange";
        return "dv-status-red";
    }

    function updateActionButtons() {
        const btnEdit = document.getElementById("btnOpenEditDv");
        const btnDelete = document.getElementById("btnOpenDeleteDv");

        if (selectedIndex === null || !services[selectedIndex]) {
            btnEdit.classList.add("dv-btn-disabled");
            btnDelete.classList.add("dv-btn-disabled");
        } else {
            btnEdit.classList.remove("dv-btn-disabled");
            btnDelete.classList.remove("dv-btn-disabled");
        }
    }

    function renderServices() {
        const keyword = dvSearch.value.trim().toLowerCase();

        const filtered = services.filter(s =>
            s.id.toLowerCase().includes(keyword) ||
            s.name.toLowerCase().includes(keyword)
        );

        dvTableBody.innerHTML = "";

        filtered.forEach((s) => {
            const realIndex = services.indexOf(s);

            const tr = document.createElement("tr");

            if (realIndex === selectedIndex) {
                tr.classList.add("selected");
            }

            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.type}</td>
                <td>${formatMoney(s.price)}</td>
                <td>${s.quantity}</td>
                <td class="${getStatusClass(s.status)}">${s.status}</td>
            `;

            tr.addEventListener("click", function (e) {
                e.stopPropagation();
                selectedIndex = realIndex;
                renderServices();
            });

            dvTableBody.appendChild(tr);
        });

        dvTotal.textContent = "Tổng số dịch vụ: " + filtered.length;

        updateActionButtons();
        saveLocal();
    }

    function resetForm() {
        dvId.value = "";
        dvName.value = "";
        dvType.value = "Đồ uống";
        dvUnit.value = "";
        dvPrice.value = "";
        dvQuantity.value = "";
        dvStatus.value = "Đang kinh doanh";
        dvError.textContent = "";
        dvId.disabled = false;
    }

    function openAddModal() {
        editingIndex = null;
        resetForm();
        dvModalTitle.textContent = "Nhập thông tin dịch vụ";
        document.getElementById("btnSaveDv").textContent = "Lưu";
        dvModal.style.display = "flex";
    }

    function openEditModal() {
        if (selectedIndex === null || !services[selectedIndex]) return;

        editingIndex = selectedIndex;
        const s = services[selectedIndex];

        dvModalTitle.textContent = "Sửa thông tin dịch vụ";
        document.getElementById("btnSaveDv").textContent = "Cập nhật";

        dvId.value = s.id;
        dvName.value = s.name;
        dvType.value = s.type;
        dvUnit.value = s.unit;
        dvPrice.value = s.price;
        dvQuantity.value = s.quantity;
        dvStatus.value = s.status;

        dvId.disabled = true;
        dvError.textContent = "";
        dvModal.style.display = "flex";
    }

    function validateForm() {
        const id = dvId.value.trim();
        const name = dvName.value.trim();
        const unit = dvUnit.value.trim();
        const price = Number(dvPrice.value);
        const quantity = Number(dvQuantity.value);

        if (id === "") {
            dvError.textContent = "Mã dịch vụ không hợp lệ";
            dvId.focus();
            return false;
        }

        if (editingIndex === null && services.some(s => s.id === id)) {
            dvError.textContent = "Mã dịch vụ đã tồn tại";
            dvId.focus();
            return false;
        }

        if (name === "") {
            dvError.textContent = "Tên dịch vụ không hợp lệ";
            dvName.focus();
            return false;
        }

        if (unit === "") {
            dvError.textContent = "Đơn vị tính không được để trống";
            dvUnit.focus();
            return false;
        }

        if (price <= 0 || isNaN(price)) {
            dvError.textContent = "Đơn giá không hợp lệ";
            dvPrice.focus();
            return false;
        }

        if (quantity < 0 || isNaN(quantity)) {
            dvError.textContent = "Số lượng không hợp lệ";
            dvQuantity.focus();
            return false;
        }

        return true;
    }

    function saveService() {
        if (!validateForm()) return;

        const service = {
            id: dvId.value.trim(),
            name: dvName.value.trim(),
            type: dvType.value,
            unit: dvUnit.value.trim(),
            price: Number(dvPrice.value),
            quantity: Number(dvQuantity.value),
            status: dvStatus.value
        };

        if (service.quantity === 0 && service.status === "Đang kinh doanh") {
            service.status = "Hết hàng";
        }

        if (editingIndex === null) {
            services.push(service);
            selectedIndex = services.length - 1;
            showToastDv("Thêm dịch vụ thành công!", "Thông tin đã được lưu vào hệ thống");
        } else {
            services[editingIndex] = service;
            selectedIndex = editingIndex;
            showToastDv("Cập nhật dịch vụ thành công!", "Thông tin đã được lưu vào hệ thống");
        }

        dvModal.style.display = "none";
        renderServices();
    }

    function deleteService() {
        if (selectedIndex === null || !services[selectedIndex]) return;

        dvDeleteModal.style.display = "flex";
    }

    function confirmDeleteService() {
        services.splice(selectedIndex, 1);

        if (services.length === 0) {
            selectedIndex = null;
        } else if (selectedIndex >= services.length) {
            selectedIndex = services.length - 1;
        }

        dvDeleteModal.style.display = "none";
        renderServices();
        showToastDv("Xóa dịch vụ thành công!", "Thông tin đã được cập nhật");
    }

    function showToastDv(title, desc) {
        const toast = document.getElementById("toastMessage");
        if (!toast) return;

        toast.querySelector(".toast-title").textContent = title;
        toast.querySelector(".toast-desc").textContent = desc;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    document.getElementById("btnOpenAddDv").addEventListener("click", function (e) {
        e.stopPropagation();
        openAddModal();
    });

    document.getElementById("btnOpenEditDv").addEventListener("click", function (e) {
        e.stopPropagation();
        openEditModal();
    });

    document.getElementById("btnOpenDeleteDv").addEventListener("click", function (e) {
        e.stopPropagation();
        deleteService();
    });

    document.getElementById("btnSaveDv").addEventListener("click", function (e) {
        e.stopPropagation();
        saveService();
    });

    document.getElementById("btnCancelDv").addEventListener("click", function (e) {
        e.stopPropagation();
        dvModal.style.display = "none";
    });

    document.getElementById("btnConfirmDeleteDv").addEventListener("click", function (e) {
        e.stopPropagation();
        confirmDeleteService();
    });

    document.getElementById("btnCancelDeleteDv").addEventListener("click", function (e) {
        e.stopPropagation();
        dvDeleteModal.style.display = "none";
    });

    dvSearch.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    dvSearch.addEventListener("input", function () {
        selectedIndex = null;
        renderServices();
    });

    document.querySelector(".toast-close").addEventListener("click", function () {
        document.getElementById("toastMessage").classList.remove("show");
    });

    document.addEventListener("click", function (e) {
        if (
            !e.target.closest(".dv-table") &&
            !e.target.closest(".dv-actions") &&
            !e.target.closest(".dv-modal") &&
            !e.target.closest(".dv-delete-box")
        ) {
            selectedIndex = null;
            renderServices();
        }
    });

    renderServices();
}