
// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 初始化搜索功能
    initSearch();
    
    // 初始化工具提示
    var tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltips.map(function (tooltip) {
        return new bootstrap.Tooltip(tooltip)
    });
});

// 初始化搜索功能
function initSearch() {
    const searchInput = document.querySelector('input[placeholder="搜索开发机..."]');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        searchDevMachines(searchTerm);
    }, 300));
}

// 搜索开发机
function searchDevMachines(term) {
    const rows = document.querySelectorAll('.table tbody tr');
    
    rows.forEach(row => {
        const machineName = row.querySelector('td:first-child').textContent.toLowerCase();
        const description = row.querySelector('td:first-child small')?.textContent.toLowerCase() || '';
        
        const isMatch = machineName.includes(term) || description.includes(term);
        row.style.display = isMatch ? '' : 'none';
    });
}

// 打开SSH连接模态框
function openSSHModal(machineName, ipAddress) {
    const sshModal = new bootstrap.Modal(document.getElementById('sshModal'));
    
    // 设置连接信息
    document.getElementById('sshHost').value = ipAddress;
    
    // 生成SSH命令
    const sshCommand = `ssh -i ~/.ssh/dev-machine.pem root@${ipAddress}`;
    document.getElementById('sshCommand').value = sshCommand;
    
    sshModal.show();
}

// 复制到剪贴板
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    
    // 显示复制成功提示
    showToast('复制成功');
}

// 下载SSH密钥
function downloadSSHKey() {
    // 这里应该调用后端API获取SSH密钥
    // 为了演示，我们创建一个示例下载
    const dummyKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890...
-----END RSA PRIVATE KEY-----`;
    
    const blob = new Blob([dummyKey], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dev-machine.pem';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// 创建开发机
function createDevMachine() {
    // 跳转到开发机创建页面
    window.location.href = '/dev-machine/create';
}

// 显示提示消息
function showToast(message) {
    // 创建toast元素
    const toastContainer = document.createElement('div');
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    
    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
        <div class="toast-header">
            <i class="fas fa-info-circle me-2"></i>
            <strong class="me-auto">提示</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    document.body.appendChild(toastContainer);
    
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });
    
    toast.show();
    
    // 监听隐藏事件，移除元素
    toastElement.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(toastContainer);
    });
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 