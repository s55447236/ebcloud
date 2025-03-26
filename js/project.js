// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化搜索功能
    initSearch();
    
    // 初始化创建项目表单
    initCreateProjectForm();
    
    // 初始化编辑项目表单
    initEditProjectForm();
    
    // 初始化成员管理
    initMemberManagement();
    
    // 初始化项目操作按钮
    initProjectActions();
});

// 初始化搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        searchProjects(searchTerm);
    }, 300));
}

// 搜索项目
function searchProjects(term) {
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td:first-child').textContent.toLowerCase();
        const description = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const isMatch = name.includes(term) || description.includes(term);
        
        row.style.display = isMatch ? '' : 'none';
    });
}

// 初始化创建项目表单
function initCreateProjectForm() {
    const form = document.getElementById('createProjectForm');
    const createBtn = document.getElementById('createProjectBtn');
    if (!form || !createBtn) return;
    
    createBtn.addEventListener('click', function() {
        if (validateProjectForm(form)) {
            handleCreateProject(form);
        }
    });
}

// 初始化编辑项目表单
function initEditProjectForm() {
    const form = document.getElementById('editProjectForm');
    const updateBtn = document.getElementById('updateProjectBtn');
    if (!form || !updateBtn) return;
    
    updateBtn.addEventListener('click', function() {
        if (validateProjectForm(form)) {
            handleUpdateProject(form);
        }
    });
}

// 验证项目表单
function validateProjectForm(form) {
    const name = form.querySelector('[name="name"]').value.trim();
    
    if (!name) {
        showToast('请输入项目名称', 'error');
        return false;
    }
    
    return true;
}

// 处理创建项目
function handleCreateProject(form) {
    const formData = {
        name: form.querySelector('[name="name"]').value,
        description: form.querySelector('[name="description"]').value,
        quotas: {
            cpu: form.querySelector('[name="cpuQuota"]').value,
            memory: form.querySelector('[name="memoryQuota"]').value,
            storage: form.querySelector('[name="storageQuota"]').value
        }
    };
    
    // TODO: 发送到后端API
    console.log('创建项目:', formData);
    
    showToast('项目创建成功', 'success');
    
    // 关闭模态框并重置表单
    const modal = bootstrap.Modal.getInstance(document.getElementById('createProjectModal'));
    modal.hide();
    form.reset();
}

// 处理更新项目
function handleUpdateProject(form) {
    const formData = {
        name: form.querySelector('[name="name"]').value,
        description: form.querySelector('[name="description"]').value,
        quotas: {
            cpu: form.querySelector('[name="cpuQuota"]').value,
            memory: form.querySelector('[name="memoryQuota"]').value,
            storage: form.querySelector('[name="storageQuota"]').value
        }
    };
    
    // TODO: 发送到后端API
    console.log('更新项目:', formData);
    
    showToast('项目更新成功', 'success');
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
    modal.hide();
}

// 初始化成员管理
function initMemberManagement() {
    const addMemberBtn = document.getElementById('addMemberBtn');
    if (!addMemberBtn) return;
    
    addMemberBtn.addEventListener('click', function() {
        // TODO: 实现添加成员的逻辑
        console.log('添加成员');
    });
    
    // 初始化成员角色选择器
    document.querySelectorAll('.form-select').forEach(select => {
        select.addEventListener('change', function() {
            const role = this.value;
            const row = this.closest('tr');
            const username = row.querySelector('td:first-child div div:first-child').textContent;
            
            handleUpdateMemberRole(username, role);
        });
    });
    
    // 初始化移除成员按钮
    document.querySelectorAll('.btn-outline-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const username = row.querySelector('td:first-child div div:first-child').textContent;
            
            if (confirm(`确定要移除成员 ${username} 吗？`)) {
                handleRemoveMember(username, row);
            }
        });
    });
}

// 处理更新成员角色
function handleUpdateMemberRole(username, role) {
    // TODO: 发送到后端API
    console.log('更新成员角色:', { username, role });
    showToast('成员角色更新成功', 'success');
}

// 处理移除成员
function handleRemoveMember(username, row) {
    // TODO: 发送到后端API
    console.log('移除成员:', username);
    
    // 移除行
    row.remove();
    showToast('成员已移除', 'success');
}

// 初始化项目操作按钮
function initProjectActions() {
    // 删除项目按钮
    document.querySelectorAll('.btn-outline-danger[title="删除"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const projectName = row.querySelector('td:first-child div div:first-child').textContent;
            
            if (confirm(`确定要删除项目 ${projectName} 吗？此操作不可恢复。`)) {
                handleDeleteProject(projectName, row);
            }
        });
    });
}

// 处理删除项目
function handleDeleteProject(projectName, row) {
    // TODO: 发送到后端API
    console.log('删除项目:', projectName);
    
    // 移除行
    row.remove();
    showToast('项目已删除', 'success');
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