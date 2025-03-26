// 初始化函数
function initSharedStorage() {
    // 检查特定元素是否存在
    const storageList = document.getElementById('sharedStorageList');
    if (!storageList) {
        console.warn('共享存储列表元素不存在');
        return;
    }

    // 初始化工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 初始化项目选择器
    initProjectSelector();
    
    // 加载存储数据
    loadStorageData();

    // 初始化创建按钮事件
    initCreateButton();
}

// 检查页面是否通过动态加载
function checkAndInitialize() {
    // 检查特定元素是否存在
    const storageList = document.getElementById('sharedStorageList');
    if (storageList) {
        initSharedStorage();
    } else {
        // 如果元素不存在，等待一段时间后重试
        setTimeout(checkAndInitialize, 100);
    }
}

// 监听页面加载
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndInitialize);
} else {
    checkAndInitialize();
}

// 初始化项目选择器
function initProjectSelector() {
    const projectSelector = document.getElementById('projectSelector');
    if (!projectSelector) return;
    
    projectSelector.addEventListener('change', function() {
        const selectedProject = this.value;
        filterStorageByProject(selectedProject);
    });
}

// 根据项目筛选存储列表
function filterStorageByProject(projectId) {
    const rows = document.querySelectorAll('#sharedStorageList tr');
    
    rows.forEach(row => {
        if (projectId === 'all') {
            row.style.display = '';
            return;
        }
        
        const projectBadge = row.querySelector('td:nth-child(2) .badge');
        if (!projectBadge) return;
        
        const rowProjectId = projectBadge.textContent.trim();
        const shouldShow = projectId === 'all' || rowProjectId === projectId;
        row.style.display = shouldShow ? '' : 'none';
    });
}

// 加载存储数据
function loadStorageData() {
    // 模拟从后端获取数据
    const mockData = [
        {
            name: 'shared-storage-1',
            description: '用于数据共享的存储卷',
            project: '默认项目',
            capacity: '100 GB',
            used: 45,
            mountPath: '/mnt/shared',
            status: 'mounted'
        },
        {
            name: 'shared-storage-2',
            description: '模型训练数据存储',
            project: '默认项目',
            capacity: '200 GB',
            used: 60,
            mountPath: '/mnt/training',
            status: 'mounted'
        },
        {
            name: 'shared-storage-3',
            description: '开发环境共享存储',
            project: '默认项目',
            capacity: '50 GB',
            used: 30,
            mountPath: '/mnt/dev',
            status: 'mounted'
        }
    ];

    // 更新存储列表
    updateStorageList(mockData);
    
    // 更新统计数据
    updateStorageStats(mockData);
}

// 更新存储列表
function updateStorageList(storages) {
    const tbody = document.getElementById('sharedStorageList');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    storages.forEach(storage => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-hdd me-2 text-primary"></i>
                    <div>
                        <div>${storage.name}</div>
                        <small class="text-muted">${storage.description}</small>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-info">${storage.project}</span></td>
            <td>${storage.capacity}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="progress flex-grow-1" style="height: 5px;">
                        <div class="progress-bar" role="progressbar" style="width: ${storage.used}%"></div>
                    </div>
                    <span class="ms-2">${storage.used}%</span>
                </div>
            </td>
            <td>${storage.mountPath}</td>
            <td><span class="badge bg-success">${storage.status === 'mounted' ? '已挂载' : '未挂载'}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="tooltip" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" title="扩容">
                        <i class="fas fa-expand-alt"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" data-bs-toggle="tooltip" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // 重新初始化工具提示
    const tooltips = [].slice.call(tbody.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.map(el => new bootstrap.Tooltip(el));
}

// 更新存储统计数据
function updateStorageStats(storages) {
    const totalStorage = storages.reduce((acc, s) => acc + parseInt(s.capacity), 0);
    const totalUsed = storages.reduce((acc, s) => acc + (parseInt(s.capacity) * s.used / 100), 0);
    const mountedCount = storages.filter(s => s.status === 'mounted').length;
    
    // 更新显示
    document.querySelector('.card:nth-child(1) .card-title').textContent = `${totalStorage} GB`;
    document.querySelector('.card:nth-child(1) .progress-bar').style.width = `${(totalUsed / totalStorage * 100).toFixed(1)}%`;
    
    document.querySelector('.card:nth-child(2) .card-title').textContent = `${mountedCount} 个`;
    document.querySelector('.card:nth-child(2) .progress-bar').style.width = `${(mountedCount / storages.length * 100).toFixed(1)}%`;
}

// 创建共享存储
function createSharedStorage() {
    const form = document.getElementById('createSharedStorageForm');
    const formData = new FormData(form);
    const storageData = Object.fromEntries(formData.entries());

    if (!validateStorageForm(storageData)) {
        return;
    }

    // TODO: 发送创建存储请求到后端
    console.log('创建共享存储:', storageData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('createSharedStorageModal'));
    modal.hide();
    
    // 显示成功提示
    showToast('共享存储创建成功');
    
    // 重置表单
    form.reset();
    
    // 重新加载存储列表
    loadStorageData();
}

// 表单验证
function validateStorageForm(data) {
    if (!data.name) {
        showToast('请输入存储名称', 'error');
        return false;
    }
    if (!data.project) {
        showToast('请选择所属项目', 'error');
        return false;
    }
    if (!data.capacity || data.capacity < 1) {
        showToast('请输入有效的存储容量', 'error');
        return false;
    }
    if (!data.mountPath) {
        showToast('请输入挂载路径', 'error');
        return false;
    }
    return true;
}

// 显示提示消息
function showToast(message, type = 'success') {
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

// 初始化创建按钮事件
function initCreateButton() {
    const createBtn = document.querySelector('.btn-create-storage');
    const createForm = document.getElementById('createSharedStorageForm');
    const submitBtn = document.querySelector('#createSharedStorageModal .modal-footer button[type="submit"]');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createSharedStorage();
        });
    }
    
    if (createForm) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createSharedStorage();
        });
    }
} 