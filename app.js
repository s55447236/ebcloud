// 路由配置
const routes = {
    '/': 'dashboard.html',
    '/dashboard': 'dashboard.html',
    '/cluster': 'cluster.html',
    '/block-storage': 'block-storage.html',
    '/shared-storage': 'shared-storage.html',
    '/file-storage': 'file-storage.html',
    '/dev-machines': 'dev-machines.html',
    '/images': 'images.html',
    '/account-settings': 'account-settings.html',
    '/billing-overview': 'billing-overview.html',
    '/billing-details': 'billing-details.html',
    '/vouchers': 'vouchers.html',
    '/access-control': 'access-control.html',
    '/contact': 'contact.html',
    '/faq': 'faq.html',
    '/tasks': 'tasks.html',
    '/storage': 'storage.html',
    '/settings': 'settings.html'
};

// 当前活动的页面路径
let currentPath = window.location.pathname;

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 如果是根路径，重定向到dashboard
    if (currentPath === '/' || currentPath === '/index.html') {
        currentPath = '/dashboard';
    }

    // 创建主内容区域容器（如果不存在）
    if (!document.querySelector('.main-content')) {
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        document.querySelector('.app-container').appendChild(mainContent);
    }

    // 加载侧边栏
    loadSidebar().then(() => {
        // 初始化路由
        handleRoute(currentPath);
        // 设置活动菜单项
        setActiveMenuItem(currentPath);
    });

    // 监听浏览器后退/前进按钮
    window.addEventListener('popstate', (event) => {
        handleRoute(window.location.pathname);
    });
});

// 加载侧边栏
async function loadSidebar() {
    try {
        const response = await fetch('layout.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const sidebar = doc.querySelector('.sidebar');
        
        // 检查是否已存在侧边栏
        const existingSidebar = document.querySelector('.sidebar');
        if (existingSidebar) {
            existingSidebar.remove();
        }
        
        document.getElementById('sidebar-container').appendChild(sidebar);

        // 为侧边栏菜单项添加点击事件
        initializeMenuItems();
    } catch (error) {
        console.error('加载侧边栏失败:', error);
    }
}

// 初始化菜单项点击事件
function initializeMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item a');
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href !== '#') {
            item.addEventListener('click', (e) => {
                console.log('点击了', href);
                e.preventDefault();
                navigateTo(href);
            });
        }
    });

    // 处理可展开菜单
    const expandableItems = document.querySelectorAll('.menu-item.expandable');
    expandableItems.forEach(item => {
        const trigger = item.querySelector('a');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                item.classList.toggle('expanded');
            });
        }

        // 为子菜单项添加点击事件
        const submenuItems = item.querySelectorAll('.submenu a');
        submenuItems.forEach(subItem => {
            subItem.addEventListener('click', (e) => {
                e.preventDefault();
                const path = subItem.getAttribute('href');
                navigateTo(path);
            });
        });
    });
}

// 页面导航
function navigateTo(path) {
    // 更新浏览器历史记录
    window.history.pushState({}, '', path);
    // 处理路由变化
    handleRoute(path);
    // 更新活动菜单项
    setActiveMenuItem(path);
}

// 处理路由变化
async function handleRoute(path) {
    currentPath = path;
    const route = routes[path] || routes['/'];
    
    try {
        // 加载页面内容
        const response = await fetch(route);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 获取主要内容区域
        const newContent = doc.querySelector('.main-content');
        if (newContent) {
            // 更新主内容区域
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                // 清除旧的事件监听器
                const oldButtons = mainContent.querySelectorAll('button');
                oldButtons.forEach(button => {
                    button.replaceWith(button.cloneNode(true));
                });

                // 更新内容
                mainContent.innerHTML = newContent.innerHTML;

                // 处理模态框
                const modals = doc.querySelectorAll('.modal');
                modals.forEach(modal => {
                    // 移除旧的模态框
                    const oldModal = document.querySelector(`#${modal.id}`);
                    if (oldModal) {
                        oldModal.remove();
                    }
                    // 添加新的模态框到body
                    document.body.appendChild(modal.cloneNode(true));
                });
                
                // 先加载页面特定的JS文件
                await loadPageScript(path);
                
                // 初始化Bootstrap组件
                initializeBootstrapComponents();
                
                // 初始化模态框
                initializeModals();
            }
        }
    } catch (error) {
        console.error('加载页面失败:', error);
    }
}

// 加载页面特定的JavaScript文件
async function loadPageScript(path) {
    // 移除之前加载的页面特定脚本
    const oldScripts = document.querySelectorAll('script[data-page-script]');
    oldScripts.forEach(script => script.remove());

    // 根据路径确定要加载的脚本
    let scriptPath = '';
    switch (path) {
        case '/cluster':
            scriptPath = 'js/cluster.js';
            break;
        case '/shared-storage':
            scriptPath = 'js/shared-storage.js';
            break;
        case '/file-storage':
            scriptPath = 'js/file-storage.js';
            break;
        case '/billing-overview':
            scriptPath = 'js/billing-overview.js';
            break;
        case '/dev-machines':
            scriptPath = 'js/dev-machines.js';
            break;
        // 可以添加更多页面的脚本
    }

    if (scriptPath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.setAttribute('data-page-script', 'true');
            script.onload = () => {
                // 脚本加载完成后初始化页面
                initializePageScripts(path);
                resolve();
            };
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
    return Promise.resolve();
}

// 设置活动菜单项
function setActiveMenuItem(path) {
    // 移除所有活动状态
    document.querySelectorAll('.menu-item a').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前活动项
    const activeItem = document.querySelector(`.menu-item a[href="${path}"], .submenu a[href="${path}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        
        // 如果在子菜单中，展开父菜单
        const parentItem = activeItem.closest('.menu-item.expandable');
        if (parentItem) {
            parentItem.classList.add('expanded');
        }
    }
}

// 初始化页面特定的JavaScript
function initializePageScripts(path) {
    switch (path) {
        case '/cluster':
            if (typeof initializeClusterPage === 'function') {
                initializeClusterPage();
            }
            break;
        case '/dashboard':
            if (typeof initializeDashboard === 'function') {
                initializeDashboard();
            }
            break;
        case '/shared-storage':
            if (typeof initSharedStorage === 'function') {
                initSharedStorage();
            }
            break;
        case '/file-storage':
            if (typeof initFileStorage === 'function') {
                initFileStorage();
            }
            break;
        case '/dev-machines':
            if (typeof initDevMachines === 'function') {
                initDevMachines();
            }
            // 确保初始化模态框
            initializeModals();
            break;
        // 可以添加更多页面的初始化
    }

    // 初始化Bootstrap组件
    initializeBootstrapComponents();
}

// 初始化Bootstrap组件
function initializeBootstrapComponents() {
    // 初始化所有的工具提示
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // 初始化所有的弹出框
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(popover => {
        new bootstrap.Popover(popover);
    });
}

// 初始化模态框
function initializeModals() {
    // 获取所有带有data-bs-toggle="modal"属性的元素
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    modalTriggers.forEach(trigger => {
        // 获取目标模态框ID
        const targetId = trigger.getAttribute('data-bs-target');
        if (targetId) {
            const modalElement = document.querySelector(targetId);
            if (modalElement) {
                // 初始化Bootstrap模态框
                const modal = new bootstrap.Modal(modalElement);
                
                // 为触发器添加点击事件
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.show();
                });
            }
        }
    });
}

// 导出公共函数
window.app = {
    navigateTo,
    handleRoute,
    setActiveMenuItem
}; 