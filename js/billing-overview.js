// 等待Chart.js加载完成
function waitForChartJs() {
    return new Promise((resolve) => {
        if (window.Chart) {
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            document.head.appendChild(script);
        }
    });
}

// 初始化页面
async function initializePage() {
    try {
        // 等待Chart.js加载完成
        await waitForChartJs();
        
        // 初始化工具提示
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // 初始化图表
        initCharts();
    } catch (error) {
        console.error('初始化图表失败:', error);
    }
}

// 确保在DOM加载完成后初始化页面
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// 初始化所有图表
function initCharts() {
    try {
        initCostTrendChart();
        initResourceDistributionChart();
        initProjectDistributionChart();
    } catch (error) {
        console.error('初始化图表失败:', error);
    }
}

// 初始化费用趋势图表
function initCostTrendChart() {
    const ctx = document.getElementById('costTrendChart');
    if (!ctx) {
        console.warn('找不到费用趋势图表元素');
        return;
    }

    try {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [{
                    label: '费用趋势',
                    data: [1200, 1900, 1500, 2100, 1800, 2300],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '费用 (元)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('初始化费用趋势图表失败:', error);
    }
}

// 初始化资源费用分布图表
function initResourceDistributionChart() {
    const ctx = document.getElementById('resourceDistributionChart');
    if (!ctx) {
        console.warn('找不到资源费用分布图表元素');
        return;
    }

    try {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['计算资源', '存储资源', '网络资源', '其他'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    } catch (error) {
        console.error('初始化资源费用分布图表失败:', error);
    }
}

// 初始化项目费用分布图表
function initProjectDistributionChart() {
    const ctx = document.getElementById('projectDistributionChart');
    if (!ctx) {
        console.warn('找不到项目费用分布图表元素');
        return;
    }

    try {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['默认项目', '清华大学', '北京大学实验项目', '其他项目'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    } catch (error) {
        console.error('初始化项目费用分布图表失败:', error);
    }
} 