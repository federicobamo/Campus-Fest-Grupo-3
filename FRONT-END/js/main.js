

// Toggle menú móvil
function toggleMobileMenu() {
  const links = document.getElementById('navbarLinks');
  if (links) links.classList.toggle('mobile-open');
}

// Mostrar toast de notificación (RF-INS-06)
function showToast(title, message, duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('strong').textContent = title;
  toast.querySelector('p').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// FAQ accordion
document.addEventListener('click', function (e) {
  const question = e.target.closest('.faq-question');
  if (question) {
    const item = question.closest('.faq-item');
    item.classList.toggle('open');
  }
});

// Modal helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('show');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('show');
}
