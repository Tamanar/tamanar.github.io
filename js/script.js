// =====================================================================
// MENU MOBILE
// =====================================================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Ferme le menu après avoir cliqué sur un lien (mobile)
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =====================================================================
// COMPTE À REBOURS
// La date est lue depuis l'attribut data-wedding-date de #weddingDate
// dans index.html (format AAAA-MM-JJTHH:MM:SS).
// =====================================================================
const dateEl = document.getElementById('weddingDate');
const weddingDate = dateEl ? new Date(dateEl.dataset.weddingDate) : null;

const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMinutes = document.getElementById('cd-minutes');
const cdSeconds = document.getElementById('cd-seconds');
const countdownEl = document.getElementById('countdown');

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  if (!weddingDate || isNaN(weddingDate.getTime())) return;

  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    if (countdownEl) {
      countdownEl.innerHTML = '<p class="countdown__done">C\'est le grand jour !</p>';
    }
    clearInterval(timer);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (cdDays) cdDays.textContent = pad(days);
  if (cdHours) cdHours.textContent = pad(hours);
  if (cdMinutes) cdMinutes.textContent = pad(minutes);
  if (cdSeconds) cdSeconds.textContent = pad(seconds);
}

updateCountdown();
const timer = setInterval(updateCountdown, 1000);