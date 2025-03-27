// 集群页面初始化函数
function initializeClusterPage() {
    console.log('初始化集群页面');
    
    // 初始化工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 绑定全选/取消全选事件
    const selectAllNodes = document.getElementById('selectAllNodes');
    if (selectAllNodes) {
        selectAllNodes.addEventListener('change', function(e) {
            const nodeCheckboxes = document.querySelectorAll('.node-select');
            nodeCheckboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }

    // 绑定节点搜索事件
    const nodeSearch = document.getElementById('nodeSearch');
    if (nodeSearch) {
        nodeSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#nodeTable tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

// 打开节点管理模态框
function openNodeManagement(clusterName) {
    // 获取模态框实例
    const nodeManagementModal = new bootstrap.Modal(document.getElementById('nodeManagementModal'));
    
    // 在这里可以根据clusterName加载具体的节点数据
    loadNodeData(clusterName);
    
    // 显示模态框
    nodeManagementModal.show();
}

// 加载节点数据
function loadNodeData(clusterName) {
    // 这里模拟一些测试数据
    const mockNodes = [
        {
            name: 'node-1',
            spec: 'A100 GPU / 32核 / 128GB',
            status: 'running',
            cpuUsage: '75%',
            memoryUsage: '60%',
            createTime: '2024-03-15 10:30'
        },
        {
            name: 'node-2',
            spec: 'A100 GPU / 32核 / 128GB',
            status: 'running',
            cpuUsage: '65%',
            memoryUsage: '55%',
            createTime: '2024-03-15 10:30'
        }
    ];

    // 获取表格tbody
    const tbody = document.querySelector('#nodeTable tbody');
    tbody.innerHTML = ''; // 清空现有内容

    // 填充节点数据
    mockNodes.forEach(node => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="form-check-input node-select"></td>
            <td>${node.name}</td>
            <td>${node.spec}</td>
            <td><span class="badge bg-success">${node.status}</span></td>
            <td>
                <div class="d-flex flex-column">
                    <div class="mb-1">
                        <small>CPU: ${node.cpuUsage}</small>
                        <div class="progress" style="height: 5px;">
                            <div class="progress-bar" role="progressbar" style="width: ${node.cpuUsage}"></div>
                        </div>
                    </div>
                    <div>
                        <small>内存: ${node.memoryUsage}</small>
                        <div class="progress" style="height: 5px;">
                            <div class="progress-bar" role="progressbar" style="width: ${node.memoryUsage}"></div>
                        </div>
                    </div>
                </div>
            </td>
            <td>${node.createTime}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" title="重启节点">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="删除节点">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 添加节点
function addNode() {
    // TODO: 实现添加节点的逻辑
    alert('添加节点功能即将上线');
}

// 删除选中的节点
function removeSelectedNodes() {
    const selectedNodes = document.querySelectorAll('.node-select:checked');
    if (selectedNodes.length === 0) {
        alert('请先选择要删除的节点');
        return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedNodes.length} 个节点吗？`)) {
        // TODO: 实现删除节点的逻辑
        alert('删除节点功能即将上线');
    }
}

// 如果不是通过SPA加载，则直接初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClusterPage);
} else {
    initializeClusterPage();
}

// 导出初始化函数，供SPA使用
window.initializeClusterPage = initializeClusterPage; 