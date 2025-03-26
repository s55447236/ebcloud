// 项目管理相关的通用函数
class ProjectManager {
    constructor() {
        this.currentProject = 'all';
        this.projectList = [];
        this.initProjectSelector();
    }

    // 初始化项目选择器
    initProjectSelector() {
        const selector = document.getElementById('projectSelector');
        if (!selector) return;

        // 加载项目列表
        this.loadProjects().then(() => {
            this.updateProjectSelector(selector);
        });

        // 监听项目切换事件
        selector.addEventListener('change', (e) => {
            this.currentProject = e.target.value;
            this.onProjectChange(this.currentProject);
        });
    }

    // 加载项目列表
    async loadProjects() {
        // TODO: 从后端API获取项目列表
        // 这里使用模拟数据
        this.projectList = [
            { id: 'project1', name: '项目一' },
            { id: 'project2', name: '项目二' },
            { id: 'project3', name: '项目三' }
        ];
    }

    // 更新项目选择器选项
    updateProjectSelector(selector) {
        // 保留"所有项目"选项
        selector.innerHTML = '<option value="all">所有项目</option>';
        
        // 添加项目选项
        this.projectList.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            selector.appendChild(option);
        });
    }

    // 项目切换时的回调函数
    onProjectChange(projectId) {
        // 触发自定义事件
        const event = new CustomEvent('projectChange', {
            detail: { projectId }
        });
        document.dispatchEvent(event);
    }

    // 获取当前项目
    getCurrentProject() {
        return this.currentProject;
    }

    // 检查资源是否属于当前项目
    isResourceInCurrentProject(resourceProjectId) {
        return this.currentProject === 'all' || this.currentProject === resourceProjectId;
    }
}

// 导出ProjectManager实例
const projectManager = new ProjectManager();
export default projectManager; 