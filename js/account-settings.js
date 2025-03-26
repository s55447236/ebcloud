document.addEventListener('DOMContentLoaded', function() {
    // 个人信息表单提交
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(profileForm);
        const data = Object.fromEntries(formData.entries());
        
        // 模拟API调用
        console.log('更新个人信息:', data);
        showToast('个人信息更新成功');
    });

    // 修改密码
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changePasswordBtn = document.getElementById('changePasswordBtn');

    changePasswordBtn.addEventListener('click', function() {
        if (!validatePasswordForm()) return;
        
        const formData = new FormData(changePasswordForm);
        const data = Object.fromEntries(formData.entries());
        
        // 模拟API调用
        console.log('修改密码:', data);
        showToast('密码修改成功');
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
        modal.hide();
        
        // 重置表单
        changePasswordForm.reset();
    });

    // 密码表单验证
    function validatePasswordForm() {
        const currentPassword = changePasswordForm.querySelector('[name="currentPassword"]').value;
        const newPassword = changePasswordForm.querySelector('[name="newPassword"]').value;
        const confirmPassword = changePasswordForm.querySelector('[name="confirmPassword"]').value;

        if (!currentPassword) {
            showToast('请输入当前密码', 'error');
            return false;
        }

        if (!newPassword) {
            showToast('请输入新密码', 'error');
            return false;
        }

        if (newPassword.length < 8) {
            showToast('新密码长度不能小于8位', 'error');
            return false;
        }

        if (newPassword === currentPassword) {
            showToast('新密码不能与当前密码相同', 'error');
            return false;
        }

        if (newPassword !== confirmPassword) {
            showToast('两次输入的密码不一致', 'error');
            return false;
        }

        return true;
    }

    // 两步验证开关
    const twoFactorAuth = document.getElementById('twoFactorAuth');
    twoFactorAuth.addEventListener('change', function() {
        const status = this.checked ? '启用' : '禁用';
        console.log('两步验证:', status);
        showToast(`两步验证已${status}`);
    });

    // 退出设备
    document.querySelectorAll('.device-list .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const deviceName = this.closest('.device-item').querySelector('div > div').textContent;
            if (confirm(`确定要退出 ${deviceName} 的登录吗？`)) {
                console.log('退出设备:', deviceName);
                showToast('设备已退出登录');
                this.closest('.device-item').remove();
            }
        });
    });

    // 通知设置
    document.querySelectorAll('.notification-settings input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const type = this.id.replace('Notification', '');
            const status = this.checked ? '开启' : '关闭';
            console.log('通知设置:', type, status);
            showToast(`${type}通知已${status}`);
        });
    });

    // 头像上传
    const avatarUploadBtn = document.querySelector('.avatar-upload button');
    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/jpeg,image/png';
    avatarInput.style.display = 'none';
    document.body.appendChild(avatarInput);

    avatarUploadBtn.addEventListener('click', function() {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showToast('文件大小不能超过2MB', 'error');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            showToast('只支持jpg、png格式的图片', 'error');
            return;
        }

        // 模拟上传
        console.log('上传头像:', file);
        showToast('头像上传成功');
    });

    // 工具函数
    function showToast(message, type = 'info') {
        const toastContainer = document.createElement('div');
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(toastContainer);

        const toast = document.createElement('div');
        toast.className = `toast align-items-center ${type === 'error' ? 'bg-danger' : 'bg-primary'} text-white border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        toastContainer.appendChild(toast);

        const bsToast = new bootstrap.Toast(toast, {
            animation: true,
            autohide: true,
            delay: 3000
        });
        bsToast.show();

        toast.addEventListener('hidden.bs.toast', function() {
            toastContainer.remove();
        });
    }
}); 