// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 初始化工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 初始化日期选择器
    initDateRangePicker();

    // 初始化事件监听
    initEventListeners();
});

// 初始化日期选择器
function initDateRangePicker() {
    const dateRange = document.getElementById('dateRange');
    if (!dateRange) return;

    // 这里可以集成日期选择器库，如 daterangepicker
    dateRange.value = '2024-03-01 - 2024-03-26';
}

// 初始化事件监听
function initEventListeners() {
    // 导出账单按钮
    const exportBtn = document.getElementById('exportBill');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportBillData);
    }

    // 搜索框
    const searchInput = document.querySelector('input[placeholder="搜索"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // 筛选按钮
    const filterBtn = document.querySelector('button:has(.fa-filter)');
    if (filterBtn) {
        filterBtn.addEventListener('click', showFilterDialog);
    }
}

// 导出账单数据
function exportBillData() {
    const dateRange = document.getElementById('dateRange').value;
    console.log('导出账单:', dateRange);
    showToast('账单导出中，请稍候...');
    // TODO: 实现导出逻辑
}

// 处理搜索
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#billingDetailsList tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// 显示筛选对话框
function showFilterDialog() {
    // TODO: 实现筛选对话框
    console.log('显示筛选对话框');
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type}`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastEl);
    document.body.appendChild(toastContainer);
    
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 3000
    });
    
    toast.show();
    
    toastEl.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(toastContainer);
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 