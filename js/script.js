// 侧边栏功能
document.addEventListener('DOMContentLoaded', function() {
    // 处理子菜单展开/折叠
    const menuItems = document.querySelectorAll('.menu-item.expandable');
    menuItems.forEach(item => {
        const link = item.querySelector('.has-submenu');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            item.classList.toggle('expanded');
        });
    });
    
    // 设置当前页面对应的菜单项为激活状态
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.menu-item a');
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.parentElement.classList.add('active');
        }
    });
}); 