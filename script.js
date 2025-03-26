// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化菜单展开/收起功能
    initializeMenu();
    
    // 处理路由
    handleRoute();
    
    // 监听路由变化
    window.addEventListener('popstate', handleRoute);

    // 获取所有菜单项
    const menuItems = document.querySelectorAll('.menu-item a:not(.has-submenu)');
    
    // 为每个菜单项添加点击事件
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // 添加当前点击项的活动状态
            this.classList.add('active');
            
            // 获取链接地址并加载内容
            const href = this.getAttribute('href');
            if (href) {
                window.history.pushState({}, '', href);
                handleRoute();
            }
        });
    });

    // 警告横幅关闭功能
    const warningBanner = document.querySelector('.warning-banner');
    const closeBtn = document.querySelector('.close-btn');
    
    if (closeBtn && warningBanner) {
        closeBtn.addEventListener('click', function() {
            warningBanner.style.display = 'none';
        });
    }

    // 为所有卡片添加悬停效果
    const cards = document.querySelectorAll('.guide-card, .practice-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        });
    });

    // 为查看详情链接添加悬停效果
    const detailLinks = document.querySelectorAll('.guide-btn, .practice-link, .view-more');
    
    detailLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });

        link.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    });
});

// 初始化菜单
function initializeMenu() {
    const expandableItems = document.querySelectorAll('.expandable');
    
    expandableItems.forEach(item => {
        const submenuTrigger = item.querySelector('.has-submenu');
        const submenu = item.querySelector('.submenu');
        const arrow = item.querySelector('.arrow');
        
        if (submenuTrigger && submenu && arrow) {
            submenuTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                item.classList.toggle('expanded');
                submenu.style.maxHeight = item.classList.contains('expanded') ? 
                    submenu.scrollHeight + 'px' : '0';
                arrow.style.transform = item.classList.contains('expanded') ? 
                    'rotate(180deg)' : 'rotate(0)';
            });
        }
    });
}

// 处理路由
async function handleRoute() {
    const path = window.location.pathname;
    const mainContent = document.getElementById('main-content');
    
    // 如果是根路径，重定向到dashboard
    if (path === '/') {
        window.history.pushState({}, '', '/dashboard');
        window.location.reload();
        return;
    }
    
    // 直接重定向到对应的HTML页面
    window.location.href = path + '.html';
}

// 处理导航链接点击
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(link.href);
        window.history.pushState({}, '', url.pathname);
        handleRoute();
    }
}); 