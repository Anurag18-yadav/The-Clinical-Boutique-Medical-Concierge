// PASTE THIS SCRIPT into dashboard.html just before </body>
// Also add data-user-name attribute to the name element:
//   <span data-user-name>Dr. Julian Vance</span>
// Add data-user-avatar to the avatar div:
//   <div data-user-avatar class="avatar">JV</div>
// Add onclick="logoutUser()" to any logout/sign-out button

(function() {
  // ── Auth guard — redirect to login if no active session
  const activeUser  = sessionStorage.getItem('activeUser');
  const activeEmail = sessionStorage.getItem('activeEmail');

  if (!activeUser) {
    window.location.href = 'login.html';
    return;
  }

  // ── Personalize the dashboard on load
  window.addEventListener('DOMContentLoaded', function() {

    // Replace doctor name wherever it appears (data-user-name attribute)
    const nameEls = document.querySelectorAll('[data-user-name]');
    nameEls.forEach(el => { el.textContent = activeUser; });

    // Fallback: also try to find and replace the static text
    const allEls = document.querySelectorAll('*');
    allEls.forEach(el => {
      if (el.children.length === 0 && el.textContent.trim() === 'Dr. Julian Vance') {
        el.textContent = activeUser;
      }
    });

    // Set initials in avatar circle (data-user-avatar attribute)
    const avatarEls = document.querySelectorAll('[data-user-avatar]');
    const initials = activeUser.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    avatarEls.forEach(el => { el.textContent = initials; });

    // Show a brief welcome toast notification
    showWelcomeToast(activeUser);
  });

  // ── Welcome toast
  function showWelcomeToast(name) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: #0A1628; color: white; border-radius: 12px;
      padding: 14px 20px; font-family: Inter, sans-serif; font-size: 14px;
      border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      display: flex; align-items: center; gap: 10px;
      animation: slideInToast 0.4s ease forwards;
      max-width: 300px;
    `;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    toast.innerHTML = `
      <div style="width:36px;height:36px;border-radius:50%;background:#D94E1F;
        display:grid;place-items:center;font-weight:700;font-size:13px;flex-shrink:0;">
        ${initials}
      </div>
      <div>
        <div style="font-weight:600;margin-bottom:2px;">Welcome back, ${name.split(' ')[0]}!</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);">Clinical session started</div>
      </div>
    `;

    // Inject toast keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInToast {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ── Logout handler — call from any logout button via onclick="logoutUser()"
  window.logoutUser = function() {
    sessionStorage.removeItem('activeUser');
    sessionStorage.removeItem('activeEmail');
    window.location.href = 'login.html';
  };

})();
