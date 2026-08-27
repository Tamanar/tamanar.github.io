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

// =====================================================================
// ÉTIQUETTES DE TYPE DE LOGEMENT — couleur automatique
// Plus besoin d'ajouter une classe tag--hotel / tag--studio / etc. à la
// main dans le HTML : la couleur est déduite du texte de l'étiquette.
// Il suffit d'écrire <span class="tag">Chambre d'hôtes</span>, par exemple.
// =====================================================================
function colorLodgingTags() {
  const tags = document.querySelectorAll('.lodging-table .tag');

  tags.forEach((tag) => {
    // normalise : minuscules + supprime les accents (é/è/ê -> e, î -> i...)
    const text = tag.textContent
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    tag.classList.remove('tag--hotel', 'tag--studio', 'tag--chambre', 'tag--gite');

    if (text.includes('hotel')) {
      tag.classList.add('tag--hotel');
    } else if (text.includes('chambre')) {
      tag.classList.add('tag--chambre');
    } else if (text.includes('studio')) {
      tag.classList.add('tag--studio');
    } else if (text.includes('gite')) {
      tag.classList.add('tag--gite');
    }
    // aucun mot-clé reconnu -> reste gris neutre (style .tag par défaut)
  });
}

colorLodgingTags();

// =====================================================================
// BLOC "PRIX" — génération automatique
// Le HTML ne contient que la liste brute des tarifs (<li data-price="...">)
// et, éventuellement, un code promo (data-code sur le .price). Ce script :
//  - s'il n'y a qu'un seul tarif et pas de code promo : affiche juste le prix
//  - sinon : calcule le tarif le plus bas, construit le bouton "à partir
//    de X €" et déplie le détail (code promo + tous les tarifs) au clic.
// Ainsi le prix affiché ne peut jamais être désynchronisé des tarifs réels.
// =====================================================================
function buildPriceBlocks() {
  document.querySelectorAll('.lodging-table .price').forEach((block) => {
    if (block.dataset.built === 'true') return; // déjà construit

    const list = block.querySelector('.price__list');
    const items = list ? Array.from(list.querySelectorAll('li[data-price]')) : [];
    if (!items.length) return;

    const prices = items
      .map((li) => parseFloat(li.dataset.price.replace(',', '.')))
      .filter((n) => !isNaN(n));
    if (!prices.length) return;

    const min = Math.min(...prices);
    const minFormatted = min.toFixed(2).replace('.', ',').replace(',00', ',00');
    const code = block.dataset.code;

    // Un seul tarif et pas de code promo -> affichage simple, pas de bouton
    if (items.length === 1 && !code) {
      block.innerHTML = `<span class="price__single">${minFormatted}&nbsp;€</span>`;
      block.dataset.built = 'true';
      return;
    }

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'price__toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = `<span>À partir de <strong>${minFormatted}&nbsp;€</strong></span><span class="price__chevron" aria-hidden="true">▾</span>`;

    const details = document.createElement('div');
    details.className = 'price__details';
    details.hidden = true;

    if (code) {
      const codeEl = document.createElement('p');
      codeEl.className = 'price__code';
      codeEl.innerHTML = `Code promo : <strong>${code}</strong>`;
      details.appendChild(codeEl);
    }

    details.appendChild(list); // déplace la liste existante dans le panneau déplié

    toggle.addEventListener('click', () => {
      const isOpen = !details.hidden;
      details.hidden = isOpen;
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    block.innerHTML = '';
    block.appendChild(toggle);
    block.appendChild(details);
    block.dataset.built = 'true';
  });
}

buildPriceBlocks();