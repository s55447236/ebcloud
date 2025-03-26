// 初始化页面
document.addEventListener('DOMContentLoaded', function () {
    // 设置默认项目
    const currentProject = localStorage.getItem('currentProject') || '默认项目';
    updateProjectDisplay(currentProject);

    // 初始化工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// 切换项目
function switchProject(projectName) {
    // 保存当前项目到本地存储
    localStorage.setItem('currentProject', projectName);

    // 更新显示
    updateProjectDisplay(projectName);

    // 更新下拉菜单的激活状态
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    dropdownItems.forEach(item => {
        if (item.textContent.trim() === projectName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 触发项目切换事件
    const event = new CustomEvent('projectChange', {
        detail: { projectName }
    });
    document.dispatchEvent(event);

    // 刷新页面数据
    refreshDashboardData(projectName);
}

// 更新项目显示
function updateProjectDisplay(projectName) {
    // 更新标题
    const projectTitle = document.querySelector('h2.mb-0');
    if (projectTitle) {
        projectTitle.textContent = projectName;
    }

    // 更新按钮文本
    const switcherButton = document.getElementById('projectSwitcher');
    if (switcherButton) {
        switcherButton.textContent = '切换项目';
    }
}

// 刷新仪表板数据
function refreshDashboardData(projectName) {
    // TODO: 根据项目名称获取并更新相关数据
    console.log('正在刷新项目数据:', projectName);

    // 这里可以添加更新资源使用情况、集群状态等逻辑

    // 显示加载提示
    showToast('正在切换到项目: ' + projectName);
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

    toastEl.addEventListener('hidden.bs.toast', function () {
        document.body.removeChild(toastContainer);
    });
} 