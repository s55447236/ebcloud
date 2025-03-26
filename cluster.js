// 集群数据示例
const clusterData = [
    {
        name: 'gpu-cluster-01',
        location: '上海',
        version: 'v1.24.8',
        nodeConfig: {
            type: 'A100 40GB',
            count: 4
        },
        network: {
            type: 'VPC',
            cidr: '10.0.0.0/16'
        },
        resources: {
            cpu: 75,
            memory: 60
        },
        status: 'running',
        createdAt: '2024-03-15 10:30'
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    initializeSearchBox();
    initializeClusterTable();
    initializeCreateClusterForm();
    initializeResourceMonitoring();
});

// 搜索框功能
function initializeSearchBox() {
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.table tbody tr');
        
        rows.forEach(row => {
            const clusterName = row.querySelector('td:first-child').textContent.toLowerCase();
            row.style.display = clusterName.includes(searchTerm) ? '' : 'none';
        });
    });
}

// 集群表格功能
function initializeClusterTable() {
    // 添加表格排序功能
    const headers = document.querySelectorAll('.table th');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.cellIndex;
            sortTable(column);
        });
    });

    // 添加操作按钮事件
    const actionButtons = document.querySelectorAll('.btn-group .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const action = button.getAttribute('title');
            const clusterName = button.closest('tr').querySelector('td:first-child').textContent;
            handleClusterAction(action, clusterName);
        });
    });
}

// 创建集群表单处理
function initializeCreateClusterForm() {
    const form = document.querySelector('#createClusterModal form');
    const submitButton = document.querySelector('#createClusterModal .btn-primary');

    // GPU类型变更时更新配置选项
    const gpuTypeSelect = form.querySelector('select[name="gpuType"]');
    gpuTypeSelect?.addEventListener('change', (e) => {
        updateNodeConfigurations(e.target.value);
    });

    // 表单提交处理
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        createCluster(Object.fromEntries(formData));
    });
}

// 资源监控初始化
function initializeResourceMonitoring() {
    // 使用Chart.js创建资源使用趋势图
    const ctx = document.getElementById('resourceTrend');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'CPU使用率',
                    data: generateRandomData(24),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.4
                }, {
                    label: '内存使用率',
                    data: generateRandomData(24),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '资源使用趋势'
                    }
                }
            }
        });
    }
}

// 集群操作处理
async function handleClusterAction(action, clusterName) {
    try {
        switch (action) {
            case '查看详情':
                showClusterDetails(clusterName);
                break;
            case '节点管理':
                openNodeManagement(clusterName);
                break;
            case '监控':
                openMonitoring(clusterName);
                break;
            default:
                console.log(`未处理的操作: ${action}`);
        }
    } catch (error) {
        showError(`操作失败: ${error.message}`);
    }
}

// 创建集群
async function createCluster(formData) {
    try {
        // 这里添加创建集群的API调用
        console.log('创建集群:', formData);
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 成功后关闭模态框并刷新列表
        const modal = bootstrap.Modal.getInstance(document.getElementById('createClusterModal'));
        modal.hide();
        
        showSuccess('集群创建成功！');
        refreshClusterList();
    } catch (error) {
        showError(`创建集群失败: ${error.message}`);
    }
}

// 辅助函数
function showSuccess(message) {
    // 实现成功提示
    alert(message);
}

function showError(message) {
    // 实现错误提示
    alert(message);
}

function generateRandomData(count) {
    return Array.from({length: count}, () => Math.floor(Math.random() * 100));
}

function refreshClusterList() {
    // 实现刷新集群列表的逻辑
    console.log('刷新集群列表');
}

// 表格排序功能
function sortTable(column) {
    const table = document.querySelector('.table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
        const aCol = a.cells[column].textContent.trim();
        const bCol = b.cells[column].textContent.trim();
        return aCol.localeCompare(bCol);
    });

    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
}

// 集群详情页面
function showClusterDetails(clusterName) {
    // 实现查看集群详情的逻辑
    console.log(`查看集群详情: ${clusterName}`);
}

// 节点管理页面
function openNodeManagement(clusterName) {
    // 实现节点管理的逻辑
    console.log(`打开节点管理: ${clusterName}`);
}

// 监控页面
function openMonitoring(clusterName) {
    // 实现监控页面的逻辑
    console.log(`打开监控: ${clusterName}`);
} 