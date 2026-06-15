
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