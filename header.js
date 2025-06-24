// Placeholder for header.js to resolve 404 error and allow script loading without issues. 

function checkLoginState() {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  const userEmail = localStorage.getItem('userEmail');
  const userData = localStorage.getItem('user');
  const loggedOutNav = document.getElementById('logged-out-nav');
  const loggedInNav = document.getElementById('logged-in-nav');
  const loggedOutMobile = document.getElementById('logged-out-mobile');
  const loggedInMobile = document.getElementById('logged-in-mobile');
  const userNameElement = document.getElementById('user-name');
  const userInitialElement = document.getElementById('user-initial');
  console.log('[checkLoginState] token:', token, 'userEmail:', userEmail, 'userData:', userData);
  console.log('[checkLoginState] Elements:', {
    loggedOutNav, loggedInNav, loggedOutMobile, loggedInMobile, userNameElement, userInitialElement
  });
  if (token && (userEmail || userData)) {
    console.log('[checkLoginState] User is logged in');
    if (loggedOutNav) loggedOutNav.classList.add('hidden');
    if (loggedInNav) loggedInNav.classList.remove('hidden');
    if (loggedOutMobile) loggedOutMobile.classList.add('hidden');
    if (loggedInMobile) loggedInMobile.classList.remove('hidden');
    let username = '';
    let firstName = '';
    if (userData) {
      try {
        const user = JSON.parse(userData);
        username = user.username || user.email.split('@')[0];
        firstName = user.first_name || user.username || user.email.split('@')[0];
      } catch (e) {
        username = userEmail ? userEmail.split('@')[0] : 'User';
        firstName = username;
      }
    } else if (userEmail) {
      username = userEmail.split('@')[0];
      firstName = username;
    }
    if (userNameElement) userNameElement.textContent = firstName;
    if (userInitialElement) userInitialElement.textContent = firstName.charAt(0).toUpperCase();
  } else {
    console.log('[checkLoginState] User is logged out');
    if (loggedOutNav) loggedOutNav.classList.remove('hidden');
    if (loggedInNav) loggedInNav.classList.add('hidden');
    if (loggedOutMobile) loggedOutMobile.classList.remove('hidden');
    if (loggedInMobile) loggedInMobile.classList.add('hidden');
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
} 