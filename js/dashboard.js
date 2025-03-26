// 项目管理相关功能
class ProjectManager {
    constructor() {
        this.currentProject = '默认项目';
        this.projects = ['默认项目'];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 创建项目表单提交
        const createProjectBtn = document.getElementById('createProjectBtn');
        if (createProjectBtn) {
            createProjectBtn.addEventListener('click', () => this.handleCreateProject());
        }

        // 项目切换
        const projectDropdown = document.getElementById('projectDropdown');
        if (projectDropdown) {
            projectDropdown.addEventListener('click', (e) => {
                if (e.target.classList.contains('dropdown-item') && !e.target.dataset.bsToggle) {
                    this.switchProject(e.target.textContent.trim());
                }
            });
        }

        // 警告横幅关闭
        const alertClose = document.querySelector('.alert .btn-close');
        if (alertClose) {
            alertClose.addEventListener('click', () => {
                document.querySelector('.alert').remove();
            });
        }
    }

    handleCreateProject() {
        const form = document.getElementById('createProjectForm');
        const projectName = form.querySelector('input[type="text"]').value;
        const projectDesc = form.querySelector('textarea').value;
        const quotas = {
            cpu: form.querySelector('input[value="4"]').value,
            memory: form.querySelector('input[value="8"]').value,
            storage: form.querySelector('input[value="100"]').value
        };

        if (!projectName) {
            this.showToast('请输入项目名称', 'error');
            return;
        }

        // 模拟创建项目
        console.log('创建项目:', {
            name: projectName,
            description: projectDesc,
            quotas: quotas
        });

        // 添加到项目列表
        this.projects.push(projectName);
        this.updateProjectDropdown();
        
        // 关闭模态框并重置表单
        const modal = bootstrap.Modal.getInstance(document.getElementById('createProjectModal'));
        modal.hide();
        form.reset();

        this.showToast('项目创建成功');
    }

    switchProject(projectName) {
        this.currentProject = projectName;
        
        // 更新UI显示
        document.querySelector('.project-header h2').textContent = projectName;
        
        // 更新下拉菜单状态
        this.updateProjectDropdown();
        
        // 更新页面标题
        document.title = `${projectName} - 工作台 - 英博云平台`;
    }

    updateProjectDropdown() {
        const dropdown = document.querySelector('.dropdown-menu');
        if (!dropdown) return;

        const items = this.projects.map(project => `
            <li><a class="dropdown-item ${project === this.currentProject ? 'active' : ''}" href="#">${project}</a></li>
        `).join('');

        dropdown.innerHTML = items + `
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#createProjectModal">
                <i class="fas fa-plus me-2"></i>创建新项目
            </a></li>
        `;
    }

    showToast(message, type = 'success') {
        // 简单的消息提示
        alert(message);
    }
}

// 初始化项目管理
document.addEventListener('DOMContentLoaded', () => {
    window.projectManager = new ProjectManager();
}); 