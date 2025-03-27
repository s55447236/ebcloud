// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有工具提示
    var tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltips.map(function (tooltip) {
        return new bootstrap.Tooltip(tooltip)
    });

    // 处理版本展开/收起的图标旋转
    document.querySelectorAll('.toggle-versions').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const expanded = this.getAttribute('aria-expanded') === 'true';
            
            // 更新图标旋转状态
            if (expanded) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(90deg)';
            }
        });
    });

    // 处理镜像搜索
    const searchInputs = document.querySelectorAll('input[placeholder="搜索镜像..."]');
    searchInputs.forEach(function(input) {
        input.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const tableBody = e.target.closest('.card-body').querySelector('tbody');
            
            // 遍历所有父行（主镜像行）
            const parentRows = tableBody.querySelectorAll('.parent-row');
            parentRows.forEach(function(row) {
                const imageName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const shouldShow = imageName.includes(searchTerm);
                
                // 获取关联的版本行
                const versionRow = row.nextElementSibling;
                
                if (shouldShow) {
                    row.style.display = '';
                    if (versionRow && versionRow.classList.contains('version-row')) {
                        versionRow.style.display = '';
                    }
                } else {
                    row.style.display = 'none';
                    if (versionRow && versionRow.classList.contains('version-row')) {
                        versionRow.style.display = 'none';
                    }
                }
            });
        }, 300));
    });

    // 初始化项目选择器
    initProjectSelector();
    
    // 初始化镜像来源切换
    initImageSourceSwitch();
    
    // 初始化镜像类型切换
    initImageTypeTabs();
    
    // 加载镜像数据
    loadImageData();
});

// 初始化项目选择器
function initProjectSelector() {
    const projectSelector = document.getElementById('projectSelector');
    if (!projectSelector) return;
    
    projectSelector.addEventListener('change', function() {
        const selectedProject = this.value;
        filterImagesByProject(selectedProject);
    });
}

// 根据项目筛选镜像列表
function filterImagesByProject(projectId) {
    const rows = document.querySelectorAll('#imageList tr');
    
    rows.forEach(row => {
        if (projectId === 'all') {
            row.style.display = '';
            return;
        }
        
        const projectCell = row.querySelector('td:nth-child(2)');
        if (!projectCell) return;
        
        const rowProjectId = projectCell.textContent.trim();
        const shouldShow = projectId === 'all' || rowProjectId === projectId;
        row.style.display = shouldShow ? '' : 'none';
    });
}

// 初始化镜像来源切换
function initImageSourceSwitch() {
    const sourceSelect = document.getElementById('imageSource');
    if (!sourceSelect) return;
    
    const dockerhubImport = document.getElementById('dockerhubImport');
    const harborImport = document.getElementById('harborImport');
    const fileImport = document.getElementById('fileImport');
    
    sourceSelect.addEventListener('change', function(e) {
        const source = e.target.value;
        document.getElementById('dockerhubImport').style.display = source === 'dockerhub' ? 'block' : 'none';
        document.getElementById('harborImport').style.display = source === 'harbor' ? 'block' : 'none';
        document.getElementById('fileImport').style.display = source === 'file' ? 'block' : 'none';
    });
}

// 初始化镜像类型标签页
function initImageTypeTabs() {
    const tabs = document.querySelectorAll('#imageTypeTabs .nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            // 切换标签页时重新加载对应类型的镜像数据
            const type = e.target.id === 'preset-tab' ? 'preset' : 'custom';
            loadImageData(type);
        });
    });
}

// 加载镜像数据
function loadImageData(type = 'preset') {
    // 模拟从后端获取数据
    const mockData = [
        {
            name: 'tensorflow-gpu',
            description: 'TensorFlow GPU 开发环境',
            project: '项目一',
            tags: ['latest', '2.6.0'],
            size: '3.5 GB',
            createTime: '2024-03-10',
            status: 'ready'
        },
        {
            name: 'pytorch-dev',
            description: 'PyTorch 开发环境',
            project: '项目二',
            tags: ['latest', '1.10.0'],
            size: '2.8 GB',
            createTime: '2024-03-09',
            status: 'ready'
        },
        {
            name: 'python-base',
            description: 'Python 基础开发环境',
            project: '项目一',
            tags: ['3.9', 'latest'],
            size: '1.2 GB',
            createTime: '2024-03-08',
            status: 'ready'
        }
    ];

    // 更新镜像列表
    updateImageList(mockData);
    
    // 更新统计数据
    updateImageStats(mockData);
}

// 更新镜像列表
function updateImageList(images) {
    const tbody = document.getElementById('imageList');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    images.forEach(image => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-cube me-2 text-primary"></i>
                    <div>
                        <div>${image.name}</div>
                        <small class="text-muted">${image.description}</small>
                    </div>
                </div>
            </td>
            <td>${image.project}</td>
            <td>${image.tags.map(tag => `<span class="badge bg-info me-1">${tag}</span>`).join('')}</td>
            <td>${image.size}</td>
            <td>${image.createTime}</td>
            <td><span class="badge bg-success">${image.status === 'ready' ? '就绪' : '构建中'}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="tooltip" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" title="拉取">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" data-bs-toggle="tooltip" title="分享">
                        <i class="fas fa-share-alt"></i>
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

// 更新镜像统计数据
function updateImageStats(images) {
    const totalSize = images.reduce((acc, img) => acc + parseFloat(img.size), 0);
    const privateCount = images.length;
    const publicCount = 0; // 示例数据中没有公开镜像
    
    // 更新显示
    document.querySelector('.card:nth-child(1) .card-title').textContent = `${images.length} 个`;
    document.querySelector('.card:nth-child(2) .card-title').textContent = `${totalSize.toFixed(1)} GB`;
    document.querySelector('.card:nth-child(3) .card-title').textContent = `${publicCount} 个`;
}

// 创建镜像
function createImage() {
    const form = document.getElementById('createImageForm');
    const formData = new FormData(form);
    const imageData = Object.fromEntries(formData.entries());

    if (!validateImageForm(imageData)) {
        return;
    }

    // TODO: 发送创建镜像请求到后端
    console.log('创建镜像:', imageData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('createImageModal'));
    modal.hide();
    
    // 显示成功提示
    showToast('镜像创建成功');
    
    // 重置表单
    form.reset();
    
    // 重新加载镜像列表
    loadImageData();
}

// 表单验证
function validateImageForm(data) {
    if (!data.name) {
        showToast('请输入镜像名称', 'error');
        return false;
    }
    if (!data.project) {
        showToast('请选择所属项目', 'error');
        return false;
    }
    if (!data.baseImage) {
        showToast('请选择基础镜像', 'error');
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