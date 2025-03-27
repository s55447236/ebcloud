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

// 节点数据示例
const nodeData = [
    {
        id: 1,
        name: 'node-001',
        spec: 'NVIDIA A100 40GB / 32核 / 128GB',
        status: 'running',
        resources: {
            cpu: 75,
            memory: 60
        },
        createdAt: '2024-03-15 10:30'
    },
    {
        id: 2,
        name: 'node-002',
        spec: 'NVIDIA A100 40GB / 32核 / 128GB',
        status: 'running',
        resources: {
            cpu: 65,
            memory: 55
        },
        createdAt: '2024-03-15 10:35'
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有模态框
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modalEl => {
        new bootstrap.Modal(modalEl);
    });

    // 初始化工具提示
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // 初始化其他功能
    initializeSearchBox();
    initializeClusterTable();
    initializeCreateClusterForm();
    initializeResourceMonitoring();
    initializeNodeManagement();
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
    try {
        const tbody = document.querySelector('.table tbody');
        if (!tbody) {
            console.error('Table body not found');
            return;
        }

        tbody.innerHTML = ''; // 清空现有内容
        
        // 添加集群数据
        clusterData.forEach(cluster => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-server me-2 text-primary"></i>
                        <div>
                            <div>${cluster.name}</div>
                            <small class="text-muted">训练集群</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-info">${cluster.location}</span>
                </td>
                <td>${cluster.nodeConfig.count}</td>
                <td>48 TFLOPS</td>
                <td>
                    <div class="d-flex flex-column">
                        <div class="mb-1">
                            <small>CPU: ${cluster.resources.cpu}%</small>
                            <div class="progress" style="height: 5px;">
                                <div class="progress-bar" role="progressbar" style="width: ${cluster.resources.cpu}%"></div>
                            </div>
                        </div>
                        <div>
                            <small>内存: ${cluster.resources.memory}%</small>
                            <div class="progress" style="height: 5px;">
                                <div class="progress-bar" role="progressbar" style="width: ${cluster.resources.memory}%"></div>
                            </div>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-success">运行中</span></td>
                <td>${cluster.createdAt}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-secondary" onclick="showClusterDetails('${cluster.name}')" data-bs-toggle="tooltip" data-bs-placement="top" title="查看集群详细信息">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="openNodeManagement('${cluster.name}')" data-bs-toggle="tooltip" data-bs-placement="top" title="管理集群节点">
                            <i class="fas fa-server"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="openMonitoring('${cluster.name}')" data-bs-toggle="tooltip" data-bs-placement="top" title="查看集群监控">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCluster('${cluster.name}')" data-bs-toggle="tooltip" data-bs-placement="top" title="删除集群">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // 重新初始化所有工具提示
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    } catch (error) {
        console.error('Error initializing cluster table:', error);
    }
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
    try {
        console.log('Opening node management for cluster:', clusterName);
        
        // 获取模态框元素
        const modalEl = document.getElementById('nodeManagementModal');
        if (!modalEl) {
            console.error('Modal element not found');
            return;
        }

        // 获取或创建模态框实例
        let modal = bootstrap.Modal.getInstance(modalEl);
        if (!modal) {
            modal = new bootstrap.Modal(modalEl);
        }

        // 更新模态框标题
        const titleEl = modalEl.querySelector('.modal-title');
        if (titleEl) {
            titleEl.textContent = `管理集群节点 - ${clusterName}`;
        }

        // 获取并显示该集群的节点数据
        const clusterNodes = nodeData.filter(node => node.name.startsWith(clusterName));
        
        // 初始化节点列表
        refreshNodeList(clusterNodes);

        // 显示模态框
        modal.show();
    } catch (error) {
        console.error('Error opening node management:', error);
        showError('打开节点管理失败：' + error.message);
    }
}

// 刷新节点列表
function refreshNodeList(nodes = nodeData) {
    const tbody = document.querySelector('#nodeTable tbody');
    tbody.innerHTML = '';
    
    nodes.forEach(node => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="checkbox" class="form-check-input node-select" data-node-id="${node.id}">
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-microchip me-2 text-primary"></i>
                    <div>
                        <div>${node.name}</div>
                        <small class="text-muted">ID: ${node.id}</small>
                    </div>
                </div>
            </td>
            <td>${node.spec}</td>
            <td><span class="badge bg-${node.status === 'running' ? 'success' : 'warning'}">${node.status}</span></td>
            <td>
                <div class="d-flex flex-column">
                    <div class="mb-1">
                        <small>CPU: ${node.resources.cpu}%</small>
                        <div class="progress" style="height: 5px;">
                            <div class="progress-bar" role="progressbar" style="width: ${node.resources.cpu}%"></div>
                        </div>
                    </div>
                    <div>
                        <small>内存: ${node.resources.memory}%</small>
                        <div class="progress" style="height: 5px;">
                            <div class="progress-bar" role="progressbar" style="width: ${node.resources.memory}%"></div>
                        </div>
                    </div>
                </div>
            </td>
            <td>${node.createdAt}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" onclick="restartNode(${node.id})" title="重启节点">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeNode(${node.id})" title="删除节点">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // 更新节点概览数据
    updateNodeOverview(nodes);
}

// 更新节点概览
function updateNodeOverview(nodes = nodeData) {
    const totalNodes = nodes.length;
    const runningNodes = nodes.filter(node => node.status === 'running').length;
    const avgCpuUsage = totalNodes > 0 ? Math.round(nodes.reduce((sum, node) => sum + node.resources.cpu, 0) / totalNodes) : 0;
    const avgMemoryUsage = totalNodes > 0 ? Math.round(nodes.reduce((sum, node) => sum + node.resources.memory, 0) / totalNodes) : 0;

    document.getElementById('totalNodes').textContent = totalNodes;
    document.getElementById('runningNodes').textContent = runningNodes;
    document.getElementById('cpuUsage').textContent = avgCpuUsage + '%';
    document.getElementById('memoryUsage').textContent = avgMemoryUsage + '%';
}

// 添加节点
function addNode() {
    const newNode = {
        id: nodeData.length + 1,
        name: `node-${String(nodeData.length + 1).padStart(3, '0')}`,
        spec: 'NVIDIA A100 40GB / 32核 / 128GB',
        status: 'initializing',
        resources: {
            cpu: 0,
            memory: 0
        },
        createdAt: new Date().toLocaleString()
    };
    
    nodeData.push(newNode);
    refreshNodeList();
    showSuccess('节点添加成功！');
}

// 删除节点
function removeNode(nodeId) {
    if (confirm('确定要删除该节点吗？')) {
        const index = nodeData.findIndex(node => node.id === nodeId);
        if (index !== -1) {
            nodeData.splice(index, 1);
            refreshNodeList();
            showSuccess('节点删除成功！');
        }
    }
}

// 重启节点
function restartNode(nodeId) {
    if (confirm('确定要重启该节点吗？')) {
        const node = nodeData.find(node => node.id === nodeId);
        if (node) {
            node.status = 'restarting';
            refreshNodeList();
            
            // 模拟重启过程
            setTimeout(() => {
                node.status = 'running';
                refreshNodeList();
                showSuccess('节点重启成功！');
            }, 3000);
        }
    }
}

// 删除选中的节点
function removeSelectedNodes() {
    const selectedNodes = document.querySelectorAll('.node-select:checked');
    if (selectedNodes.length === 0) {
        showError('请选择要删除的节点！');
        return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedNodes.length} 个节点吗？`)) {
        selectedNodes.forEach(checkbox => {
            const nodeId = parseInt(checkbox.getAttribute('data-node-id'));
            const index = nodeData.findIndex(node => node.id === nodeId);
            if (index !== -1) {
                nodeData.splice(index, 1);
            }
        });
        
        refreshNodeList();
        showSuccess(`已删除 ${selectedNodes.length} 个节点！`);
    }
}

// 初始化节点管理功能
function initializeNodeManagement() {
    // 全选/取消全选
    const selectAllCheckbox = document.getElementById('selectAllNodes');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const nodeCheckboxes = document.querySelectorAll('.node-select');
            nodeCheckboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }

    // 节点搜索功能
    const searchInput = document.getElementById('nodeSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#nodeTable tbody tr');
            
            rows.forEach(row => {
                const nodeName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                row.style.display = nodeName.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

// 监控页面
function openMonitoring(clusterName) {
    // 实现监控页面的逻辑
    console.log(`打开监控: ${clusterName}`);
} 