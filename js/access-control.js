// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化项目选择器
    initProjectSelector();
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化添加用户表单
    initAddUserForm();
    
    // 初始化用户操作按钮
    initUserActions();

    // 初始化 Bootstrap 工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 初始化标签页
    const tabList = document.querySelectorAll('#accessControlTabs button');
    tabList.forEach(function(tab) {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            this.tab.show();
        });
    });

    // 用户管理相关
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // TODO: 处理添加用户的逻辑
            const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            modal.hide();
            showToast('用户添加成功');
        });
    }

    // 项目管理相关
    const createProjectForm = document.getElementById('createProjectForm');
    if (createProjectForm) {
        createProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // TODO: 处理创建项目的逻辑
            const modal = bootstrap.Modal.getInstance(document.getElementById('createProjectModal'));
            modal.hide();
            showToast('项目创建成功');
        });
    }

    // 初始化编辑按钮事件
    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            // TODO: 处理编辑逻辑
            console.log('编辑:', name);
        });
    });

    // 初始化删除按钮事件
    document.querySelectorAll('.btn-outline-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            if (confirm(`确定要删除 ${name} 吗？`)) {
                // TODO: 处理删除逻辑
                console.log('删除:', name);
            }
        });
    });

    // 项目成员管理按钮事件
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const projectName = row.cells[0].textContent;
            // TODO: 处理成员管理逻辑
            console.log('管理成员:', projectName);
        });
    });

    // 初始化访问控制页面
    initializeAccessControl();
});

// 初始化项目选择器
function initProjectSelector() {
    const projectSelectors = document.querySelectorAll('.form-select');
    if (!projectSelectors.length) return;
    
    projectSelectors.forEach(selector => {
        // 设置默认选项
        selector.value = 'default';
        
        selector.addEventListener('change', function() {
            const selectedValue = this.value;
            
            // 如果选择了创建新项目
            if (selectedValue === 'create') {
                // 重置选择器到默认值
                this.value = 'default';
                // 显示创建项目模态框
                const modal = new bootstrap.Modal(document.getElementById('createProjectModal'));
                modal.show();
                return;
            }
            
            // 处理项目切换
            switchToProject(this.options[this.selectedIndex].text);
        });
    });
}

// 切换项目
function switchToProject(projectName) {
    // 保存当前项目到本地存储
    localStorage.setItem('currentProject', projectName);
    
    // 更新所有项目选择器的值
    document.querySelectorAll('.form-select').forEach(selector => {
        const option = Array.from(selector.options).find(opt => opt.text === projectName);
        if (option) {
            selector.value = option.value;
        }
    });
    
    // 触发项目切换事件
    const event = new CustomEvent('projectChange', {
        detail: { projectName }
    });
    document.dispatchEvent(event);
    
    // 刷新项目相关数据
    refreshProjectData(projectName);
}

// 刷新项目相关数据
function refreshProjectData(projectName) {
    // TODO: 根据选中的项目刷新页面上的相关数据
    console.log('刷新项目数据:', projectName);
    
    // 这里可以添加更新用户列表、资源使用情况等逻辑
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        searchUsers(searchTerm);
    }, 300));
}

// 搜索用户
function searchUsers(term) {
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const username = row.querySelector('td:first-child').textContent.toLowerCase();
        const email = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const isMatch = username.includes(term) || email.includes(term);
        
        row.style.display = isMatch ? '' : 'none';
    });
}

// 初始化添加用户表单
function initAddUserForm() {
    const addUserForm = document.getElementById('addUserForm');
    const addUserBtn = document.getElementById('addUserBtn');
    if (!addUserForm || !addUserBtn) return;
    
    addUserBtn.addEventListener('click', function() {
        if (validateAddUserForm(addUserForm)) {
            handleAddUser(addUserForm);
        }
    });
}

// 验证添加用户表单
function validateAddUserForm(form) {
    const username = form.querySelector('[name="username"]').value;
    const email = form.querySelector('[name="email"]').value;
    const projects = Array.from(form.querySelector('[name="projects"]').selectedOptions).map(opt => opt.value);
    const role = form.querySelector('[name="role"]').value;
    
    if (!username || !email) {
        showToast('请填写必填字段', 'error');
        return false;
    }
    
    if (!projects.length) {
        showToast('请至少选择一个项目', 'error');
        return false;
    }
    
    if (!role) {
        showToast('请选择用户角色', 'error');
        return false;
    }
    
    return true;
}

// 处理添加用户
function handleAddUser(form) {
    // 收集表单数据
    const formData = {
        username: form.querySelector('[name="username"]').value,
        email: form.querySelector('[name="email"]').value,
        position: form.querySelector('[name="position"]').value,
        projects: Array.from(form.querySelector('[name="projects"]').selectedOptions).map(opt => opt.value),
        role: form.querySelector('[name="role"]').value
    };
    
    // TODO: 发送到后端API
    console.log('添加用户:', formData);
    
    // 模拟成功响应
    showToast('用户添加成功', 'success');
    
    // 关闭模态框并重置表单
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
    form.reset();
}

// 初始化用户操作按钮
function initUserActions() {
    // 编辑用户
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const userData = getUserDataFromRow(row);
            handleEditUser(userData);
        });
    });
    
    // 禁用/启用用户
    document.querySelectorAll('.btn-outline-warning').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const userData = getUserDataFromRow(row);
            handleToggleUserStatus(userData);
        });
    });
}

// 从表格行获取用户数据
function getUserDataFromRow(row) {
    return {
        username: row.querySelector('td:first-child div div:first-child').textContent,
        email: row.querySelector('td:nth-child(2)').textContent,
        projects: Array.from(row.querySelectorAll('.project-tags .badge')).map(badge => badge.textContent),
        role: row.querySelector('td:nth-child(4) .badge').textContent,
        status: row.querySelector('td:nth-child(5) .badge').textContent
    };
}

// 处理编辑用户
function handleEditUser(userData) {
    // TODO: 实现编辑用户功能
    console.log('编辑用户:', userData);
}

// 处理切换用户状态
function handleToggleUserStatus(userData) {
    const newStatus = userData.status === '已启用' ? '已禁用' : '已启用';
    // TODO: 发送到后端API
    console.log('切换用户状态:', userData.username, newStatus);
    
    showToast(`用户状态已更新为: ${newStatus}`, 'success');
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建 toast 元素
    const toastContainer = document.createElement('div');
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">提示</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    toastContainer.appendChild(toastEl);
    document.body.appendChild(toastContainer);
    
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 3000
    });
    
    toast.show();
    
    // 监听隐藏事件，移除 toast 元素
    toastEl.addEventListener('hidden.bs.toast', function() {
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

// 创建项目
function createProject() {
    const form = document.getElementById('createProjectForm');
    const formData = new FormData(form);
    
    // 构建项目数据
    const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        quota: {
            cpu: parseInt(formData.get('cpu')) || 4,
            memory: parseInt(formData.get('memory')) || 8,
            storage: parseInt(formData.get('storage')) || 100
        }
    };

    if (!validateProjectForm(projectData)) {
        return;
    }

    // TODO: 发送创建项目请求到后端
    console.log('创建项目:', projectData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('createProjectModal'));
    modal.hide();
    
    // 显示成功提示
    showToast('项目创建成功', 'success');
    
    // 刷新页面
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// 编辑项目
function editProject(projectName) {
    // 获取项目信息（这里模拟从服务器获取数据）
    const projectInfo = {
        id: '1',
        name: projectName,
        description: '系统默认项目',
        quota: {
            cpu: 4,
            memory: 8,
            storage: 100
        },
        status: 'active'
    };

    // 填充表单
    const form = document.getElementById('editProjectForm');
    if (form) {
        // 基本信息
        form.querySelector('[name="projectId"]').value = projectInfo.id;
        form.querySelector('[name="name"]').value = projectInfo.name;
        form.querySelector('[name="description"]').value = projectInfo.description;
        
        // 资源配额
        form.querySelector('[name="cpu"]').value = projectInfo.quota.cpu;
        form.querySelector('[name="memory"]').value = projectInfo.quota.memory;
        form.querySelector('[name="storage"]').value = projectInfo.quota.storage;
    }
}

// 更新项目信息
function updateProject() {
    const form = document.getElementById('editProjectForm');
    if (!form) return;

    const formData = new FormData(form);
    
    // 构建项目数据
    const projectData = {
        id: formData.get('projectId'),
        name: formData.get('name'),
        description: formData.get('description'),
        quota: {
            cpu: parseInt(formData.get('cpu')) || 4,
            memory: parseInt(formData.get('memory')) || 8,
            storage: parseInt(formData.get('storage')) || 100
        }
    };

    if (!validateProjectForm(projectData)) {
        return;
    }

    // TODO: 发送更新项目请求到后端
    console.log('更新项目:', projectData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
    if (modal) {
        modal.hide();
    }
    
    // 显示成功提示
    showToast('项目更新成功', 'success');
    
    // 刷新页面
    setTimeout(() => {
        location.reload();
    }, 1000);
}

function manageMembers(projectName) {
    // TODO: 获取项目成员列表
    const members = [
        {
            username: 'admin',
            email: 'admin@example.com',
            role: '管理员',
            joinTime: '2024-03-20'
        }
    ];

    // 填充成员列表
    const tbody = document.getElementById('projectMembersList');
    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.username}</td>
            <td>${member.email}</td>
            <td>${member.role}</td>
            <td>${member.joinTime}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" onclick="changeRole('${member.username}')">
                        <i class="fas fa-user-cog"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeMember('${member.username}')">
                        <i class="fas fa-user-minus"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('projectMembersModal'));
    modal.show();
}

// 用户管理相关函数
function createUser() {
    const form = document.getElementById('createUserForm');
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    if (!validateUserForm(userData)) {
        return;
    }

    // TODO: 发送创建用户请求到后端
    console.log('创建用户:', userData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
    modal.hide();
    
    // 显示成功提示
    showToast('用户创建成功');
    
    // 重置表单
    form.reset();
    
    // 刷新用户列表
    refreshUserList();
}

// 表单验证函数
function validateProjectForm(data) {
    if (!data.name || data.name.trim() === '') {
        showToast('请输入项目名称', 'error');
        return false;
    }
    if (!data.description || data.description.trim() === '') {
        showToast('请输入项目描述', 'error');
        return false;
    }
    if (data.quota.cpu < 1) {
        showToast('CPU配额必须大于0', 'error');
        return false;
    }
    if (data.quota.memory < 1) {
        showToast('内存配额必须大于0', 'error');
        return false;
    }
    if (data.quota.storage < 1) {
        showToast('存储配额必须大于0', 'error');
        return false;
    }
    return true;
}

function validateUserForm(data) {
    if (!data.username) {
        showToast('请输入用户名', 'error');
        return false;
    }
    if (!data.email) {
        showToast('请输入邮箱', 'error');
        return false;
    }
    if (!data.password) {
        showToast('请输入密码', 'error');
        return false;
    }
    return true;
}

// 辅助函数
function showToast(message, type = 'success') {
    // 创建 toast 元素
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
    
    // 监听隐藏事件，移除 toast 元素
    toastEl.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(toastContainer);
    });
}

function refreshProjectList() {
    // TODO: 从后端获取最新的项目列表
    console.log('刷新项目列表');
}

function refreshUserList() {
    // TODO: 从后端获取最新的用户列表
    console.log('刷新用户列表');
}

// 初始化访问控制页面
function initializeAccessControl() {
    // 初始化所有 tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 绑定事件监听器
    bindEventListeners();
}

// 绑定事件监听器
function bindEventListeners() {
    // 编辑用户按钮事件
    const editButtons = document.querySelectorAll('#users .btn-outline-primary');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const row = this.closest('tr');
            const userData = {
                username: row.cells[0].textContent.trim(),
                email: row.cells[1].textContent.trim(),
                role: row.cells[2].querySelector('.badge').textContent.trim(),
                projects: Array.from(row.cells[3].querySelectorAll('.badge')).map(badge => badge.textContent.trim()),
                status: row.cells[4].querySelector('.badge').textContent.trim()
            };
            
            // 填充编辑表单
            const form = document.getElementById('editUserForm');
            if (form) {
                form.querySelector('[name="username"]').value = userData.username;
                form.querySelector('[name="email"]').value = userData.email;
                form.querySelector('[name="role"]').value = userData.role.toLowerCase();
                
                // 设置项目复选框
                const defaultProjectCheckbox = form.querySelector('#defaultProject');
                const project1Checkbox = form.querySelector('#project1');
                if (defaultProjectCheckbox && project1Checkbox) {
                    defaultProjectCheckbox.checked = userData.projects.includes('默认项目');
                    project1Checkbox.checked = userData.projects.includes('项目一');
                }
                
                // 设置状态
                const statusSelect = form.querySelector('[name="status"]');
                if (statusSelect) {
                    statusSelect.value = userData.status === '活跃' ? 'active' : 'inactive';
                }
            }
        });
    });

    // 删除用户按钮事件
    const deleteButtons = document.querySelectorAll('#users .btn-outline-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const username = row.cells[0].textContent.trim();
            if (confirm(`确定要删除用户 ${username} 吗？`)) {
                // 执行删除操作
                deleteUser(username);
            }
        });
    });

    // 更新用户按钮事件
    const updateUserBtn = document.querySelector('#editUserModal .btn-primary');
    if (updateUserBtn) {
        updateUserBtn.addEventListener('click', function() {
            updateUser();
        });
    }
}

// 更新用户信息
function updateUser() {
    const form = document.getElementById('editUserForm');
    if (!form) return;

    const formData = new FormData(form);
    
    // 获取选中的项目
    const selectedProjects = [];
    const defaultProjectCheckbox = form.querySelector('#defaultProject');
    const project1Checkbox = form.querySelector('#project1');
    
    if (defaultProjectCheckbox && defaultProjectCheckbox.checked) {
        selectedProjects.push('默认项目');
    }
    if (project1Checkbox && project1Checkbox.checked) {
        selectedProjects.push('项目一');
    }
    
    // 构建用户数据
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        role: formData.get('role'),
        projects: selectedProjects,
        status: formData.get('status')
    };
    
    // TODO: 发送更新请求到服务器
    console.log('更新用户信息:', userData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    if (modal) {
        modal.hide();
    }
    
    // 显示成功提示
    showToast('用户信息更新成功', 'success');
    
    // 刷新页面
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// 删除用户
function deleteUser(username) {
    // TODO: 发送删除请求到服务器
    console.log('删除用户:', username);
    
    // 显示成功提示
    showToast('用户删除成功', 'success');
    
    // 刷新页面
    setTimeout(() => {
        location.reload();
    }, 1000);
} 