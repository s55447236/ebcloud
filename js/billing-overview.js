// 等待Chart.js加载完成
function waitForChartJs() {
    return new Promise((resolve) => {
        if (window.Chart) {
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            document.head.appendChild(script);
        }
    });
}

// 初始化页面
async function initializePage() {
    try {
        // 等待Chart.js加载完成
        await waitForChartJs();
        
        // 初始化工具提示
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // 初始化图表
        initCharts();

        // 初始化事件监听
        initEventListeners();
    } catch (error) {
        console.error('初始化页面失败:', error);
    }
}

// 确保在DOM加载完成后初始化页面
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// 初始化所有图表
function initCharts() {
    try {
        initCostTrendChart();
        initResourceDistributionChart();
        initProjectDistributionChart();
    } catch (error) {
        console.error('初始化图表失败:', error);
    }
}

// 初始化费用趋势图表
function initCostTrendChart() {
    const ctx = document.getElementById('costTrendChart');
    if (!ctx) {
        console.warn('找不到费用趋势图表元素');
        return;
    }

    try {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [{
                    label: '费用趋势',
                    data: [1200, 1900, 1500, 2100, 1800, 2300],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '费用 (元)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('初始化费用趋势图表失败:', error);
    }
}

// 初始化资源费用分布图表
function initResourceDistributionChart() {
    const ctx = document.getElementById('resourceDistributionChart');
    if (!ctx) {
        console.warn('找不到资源费用分布图表元素');
        return;
    }

    try {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['计算资源', '存储资源', '网络资源', '其他'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    } catch (error) {
        console.error('初始化资源费用分布图表失败:', error);
    }
}

// 初始化项目费用分布图表
function initProjectDistributionChart() {
    const ctx = document.getElementById('projectDistributionChart');
    if (!ctx) {
        console.warn('找不到项目费用分布图表元素');
        return;
    }

    try {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['默认项目', '清华大学', '北京大学实验项目', '其他项目'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    } catch (error) {
        console.error('初始化项目费用分布图表失败:', error);
    }
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

    // 充值按钮
    const rechargeBtn = document.querySelector('button:has(.fa-plus-circle)');
    if (rechargeBtn) {
        rechargeBtn.addEventListener('click', showRechargeDialog);
    }

    // 兑换代金券按钮
    const voucherBtn = document.querySelector('button:has(.fa-plus)');
    if (voucherBtn) {
        voucherBtn.addEventListener('click', showVoucherDialog);
    }
}

// 导出账单数据
function exportBillData() {
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

// 显示充值对话框
function showRechargeDialog() {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">账户充值</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">充值金额</label>
                        <div class="input-group">
                            <span class="input-group-text">¥</span>
                            <input type="number" class="form-control" min="100" step="100" value="1000">
                        </div>
                        <div class="form-text">最低充值金额为 ¥100</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">支付方式</label>
                        <div class="d-flex gap-3">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="paymentMethod" value="alipay" checked>
                                <label class="form-check-label">支付宝</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="paymentMethod" value="wechat">
                                <label class="form-check-label">微信支付</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" onclick="handleRecharge()">确认充值</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 显示模态框
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // 模态框关闭后删除元素
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// 显示兑换代金券对话框
function showVoucherDialog() {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">兑换代金券</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">兑换码</label>
                        <input type="text" class="form-control" placeholder="请输入代金券兑换码">
                    </div>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        请输入有效的代金券兑换码，兑换成功后将立即生效
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" onclick="handleVoucherExchange()">确认兑换</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 显示模态框
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // 模态框关闭后删除元素
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// 处理充值
function handleRecharge() {
    const amount = document.querySelector('.modal-body input[type="number"]').value;
    const paymentMethod = document.querySelector('.modal-body input[name="paymentMethod"]:checked').value;
    
    // TODO: 实现充值逻辑
    console.log('充值金额:', amount, '支付方式:', paymentMethod);
    showToast('正在跳转到支付页面...');
}

// 处理代金券兑换
function handleVoucherExchange() {
    const code = document.querySelector('.modal-body input[type="text"]').value;
    
    if (!code) {
        showToast('请输入兑换码', 'warning');
        return;
    }
    
    // TODO: 实现兑换逻辑
    console.log('兑换码:', code);
    showToast('正在验证兑换码...');
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