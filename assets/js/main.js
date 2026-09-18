const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuToggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

document.querySelectorAll('.flip-card').forEach((card) => {
  const frontTrigger = card.querySelector('.flip-front .flip-trigger');
  const backTrigger = card.querySelector('.flip-back .flip-trigger');

  const setFlipped = (flipped, moveFocus = false) => {
    card.classList.toggle('flipped', flipped);

    if (frontTrigger) {
      frontTrigger.setAttribute('aria-pressed', String(flipped));
      frontTrigger.tabIndex = flipped ? -1 : 0;
    }

    if (backTrigger) {
      backTrigger.tabIndex = flipped ? 0 : -1;
    }

    if (moveFocus) {
      const target = flipped ? backTrigger : frontTrigger;
      if (target) target.focus();
    }
  };

  if (frontTrigger) {
    frontTrigger.setAttribute('aria-pressed', 'false');
    frontTrigger.tabIndex = 0;
    frontTrigger.addEventListener('click', () => setFlipped(true, true));
  }

  if (backTrigger) {
    backTrigger.tabIndex = -1;
    backTrigger.addEventListener('click', () => setFlipped(false, true));
  }

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && card.classList.contains('flipped')) {
      event.preventDefault();
      setFlipped(false, true);
    }
  });
});

// Use the approved NF Epoxy logo in the header on every page.
const logoLink = document.querySelector('.logo');
if (logoLink) {
  const logoPath = window.location.pathname.includes('/pages/')
    ? '../assets/images/nf-epoxy-logo-header.webp'
    : 'assets/images/nf-epoxy-logo-header.webp';
  logoLink.innerHTML = '<img src="' + logoPath + '" alt="NF Epoxy" style="display:block;width:auto;height:72px;max-width:225px;object-fit:contain;">';
  const logoImage = logoLink.querySelector('img');
  if (logoImage) {
    logoImage.addEventListener('error', () => {
      logoLink.innerHTML = 'NF <span>Epoxy</span>';
    }, { once: true });
  }
  logoLink.setAttribute('aria-label', 'NF Epoxy home');
}
