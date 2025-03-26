// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 初始化工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    initializeSearchBox();
    initializeClusterTable();
    initializeCreateClusterForm();
    initializeResourceMonitoring();
}); 