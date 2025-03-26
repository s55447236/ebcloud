import projectManager from './common.js';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 监听项目变更事件
    document.addEventListener('projectChange', function(e) {
        filterDevMachinesByProject(e.detail.projectId);
    });
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化创建开发机表单
    initCreateDevMachineForm();

    // 初始化表单验证
    const form = document.getElementById('createDevMachineForm');
    const createBtn = document.getElementById('createDevMachineBtn');

    // 创建开发机
    createBtn.addEventListener('click', function() {
        if (!validateForm()) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // 模拟API调用
        console.log('创建开发机:', data);
        showToast('开发机创建请求已提交');
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('createDevMachineModal'));
        modal.hide();
        
        // 重置表单
        form.reset();
    });

    // 表单验证
    function validateForm() {
        const name = form.querySelector('[name="name"]').value.trim();
        if (!name) {
            showToast('请输入实例名称', 'error');
            return false;
        }
        
        // 实例名称格式验证
        const namePattern = /^[a-z0-9][a-z0-9-]{0,38}[a-z0-9]$/;
        if (!namePattern.test(name)) {
            showToast('实例名称只能包含小写字母、数字和中划线，且必须以字母或数字开头和结尾', 'error');
            return false;
        }
        
        return true;
    }

    // 操作按钮事件处理
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('title');
            const row = this.closest('tr');
            const instanceName = row.querySelector('td:first-child div div').textContent;
            
            switch(action) {
                case '连接':
                    connectToInstance(instanceName);
                    break;
                case '重启':
                    restartInstance(instanceName);
                    break;
                case '停止':
                    stopInstance(instanceName);
                    break;
            }
        });
    });

    // 实例操作函数
    function connectToInstance(instanceName) {
        console.log('连接到实例:', instanceName);
        showToast('正在打开终端连接...');
        // TODO: 实现终端连接逻辑
    }

    function restartInstance(instanceName) {
        if (confirm(`确定要重启实例 ${instanceName} 吗？`)) {
            console.log('重启实例:', instanceName);
            showToast('重启指令已发送');
            // TODO: 实现重启逻辑
        }
    }

    function stopInstance(instanceName) {
        if (confirm(`确定要停止实例 ${instanceName} 吗？`)) {
            console.log('停止实例:', instanceName);
            showToast('停止指令已发送');
            // TODO: 实现停止逻辑
        }
    }

    // 初始化工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 初始化其他功能
    initializeSearchBox();
    initializeDevMachineTable();
    initializeCreateDevMachineForm();
    initializeResourceMonitoring();
});

// 根据项目筛选开发机列表
function filterDevMachinesByProject(projectId) {
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const projectBadge = row.querySelector('td:nth-child(2) .badge');
        if (!projectBadge) return;
        
        const rowProjectId = projectBadge.textContent.trim();
        const shouldShow = projectId === 'all' || rowProjectId === projectId;
        row.style.display = shouldShow ? '' : 'none';
    });

    // 更新资源概览卡片
    updateResourceOverview(projectId);
}

// 更新资源概览
function updateResourceOverview(projectId) {
    // TODO: 从后端API获取特定项目的资源使用情况
    // 这里使用模拟数据
    const data = {
        runningInstances: projectId === 'all' ? 2 : 1,
        cpuUsage: projectId === 'all' ? '24核' : '12核',
        memoryUsage: projectId === 'all' ? '48 GB' : '24 GB',
        storageUsage: projectId === 'all' ? '240 GB' : '120 GB'
    };

    // 更新UI
    document.querySelector('.card-title.text-success').textContent = data.runningInstances;
    document.querySelectorAll('.card-title.mb-0')[1].textContent = data.cpuUsage;
    document.querySelectorAll('.card-title.mb-0')[2].textContent = data.memoryUsage;
    document.querySelectorAll('.card-title.mb-0')[3].textContent = data.storageUsage;
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        const currentProject = projectManager.getCurrentProject();
        searchDevMachines(searchTerm, currentProject);
    }, 300));
}

// 搜索开发机
function searchDevMachines(term, projectId) {
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td:first-child').textContent.toLowerCase();
        const rowProjectId = row.querySelector('td:nth-child(2) .badge').textContent.trim();
        
        const matchesSearch = name.includes(term);
        const matchesProject = projectId === 'all' || rowProjectId === projectId;
        
        row.style.display = (matchesSearch && matchesProject) ? '' : 'none';
    });
}

// 初始化创建开发机表单
function initCreateDevMachineForm() {
    const form = document.getElementById('createDevMachineForm');
    const createBtn = document.querySelector('#createDevMachineModal .btn-primary');
    if (!form || !createBtn) return;
    
    createBtn.addEventListener('click', function() {
        if (validateCreateForm(form)) {
            handleCreateDevMachine(form);
        }
    });

    // 设置默认项目
    const projectSelect = form.querySelector('[name="project"]');
    const currentProject = projectManager.getCurrentProject();
    if (currentProject !== 'all') {
        projectSelect.value = currentProject;
    }
}

// 验证创建表单
function validateCreateForm(form) {
    const name = form.querySelector('[name="name"]').value;
    const project = form.querySelector('[name="project"]').value;
    
    if (!name || !project) {
        showToast('请填写必填字段', 'error');
        return false;
    }
    
    return true;
}

// 处理创建开发机
function handleCreateDevMachine(form) {
    const formData = {
        name: form.querySelector('[name="name"]').value,
        project: form.querySelector('[name="project"]').value,
        os: form.querySelector('[name="os"]').value
    };
    
    // TODO: 发送到后端API
    console.log('创建开发机:', formData);
    
    showToast('开发机创建请求已提交', 'success');
    
    // 关闭模态框并重置表单
    const modal = bootstrap.Modal.getInstance(document.getElementById('createDevMachineModal'));
    modal.hide();
    form.reset();
}

// 工具函数：显示提示消息
function showToast(message, type = 'info') {
    // TODO: 实现提示消息显示
    console.log(`${type.toUpperCase()}: ${message}`);
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