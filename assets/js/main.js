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

// Add the official Terms & Conditions document to the Resources footer on every page.
const footerResources = document.querySelector('.footer-links');
if (footerResources && !footerResources.querySelector('[data-terms-link]')) {
  const termsLink = document.createElement('a');
  termsLink.href = window.location.pathname.includes('/pages/')
    ? '../assets/documents/NF-Epoxy-Terms-and-Conditions.pdf'
    : 'assets/documents/NF-Epoxy-Terms-and-Conditions.pdf';
  termsLink.target = '_blank';
  termsLink.rel = 'noopener noreferrer';
  termsLink.textContent = 'Terms & Conditions';
  termsLink.setAttribute('data-terms-link', 'true');
  footerResources.appendChild(termsLink);
}


 // Workshop schedule and time-limited Black Friday offer (South African time).
(() => {
  const schedule = [
    {id:'braai-workshop',name:'Braai Plankie Workshop',dates:['2026-12-14','2027-01-23','2027-02-27'],price:'R1,950',sale:'R1,560'},
    {id:'arts-crafts-workshop',name:'Arts & Crafts Workshop',dates:['2026-12-12','2027-01-09','2027-02-06'],price:'R1,240',sale:'R992'},
    {id:'flooring-workshop',name:'Epoxy DIY Flooring Workshop',dates:['2026-12-15','2027-01-16','2027-02-20']}
  ];
  const fmt = (date, month='short') => new Intl.DateTimeFormat('en-GB',{day:'numeric',month,year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
  const today = () => new Date(Date.now()+7200000).toISOString().slice(0,10);
  const hero = document.querySelector('main .hero');
  const relevant = document.querySelector('.workshop-grid, .workshop-preview-grid');
  if (!relevant) return;
  const banner = document.createElement('section');
  banner.hidden = true;
  banner.style.cssText='padding:24px 0;background:#111;color:white;border-bottom:5px solid #FDB913';
  const workshopPage = !!document.querySelector('.workshop-grid');
  banner.innerHTML='<div class="container" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px"><div><div style="color:#FDB913;font-weight:800;letter-spacing:2px">BLACK FRIDAY SPECIAL</div><h2 style="font-size:clamp(26px,5vw,44px);line-height:1.2">SAVE 20% ON SELECTED WORKSHOPS</h2><p>Braai Plankie: R1,560 · Arts &amp; Crafts: R992</p><small>Offer ends 30 November 2026. Enquire to confirm availability.</small></div><a class="btn primary" href="'+(workshopPage?'#braai-workshop':'pages/workshops.html')+'">View Workshop Deals</a></div>';
  if(hero) hero.after(banner);
  function refresh(){
    const day=today();
    const active=day>='2026-11-25' && day<='2026-11-30';
    banner.hidden=!active;
    schedule.forEach(w=>{
      const upcoming=w.dates.filter(d=>d>=day);
      const next=upcoming[0];
      const card=document.getElementById(w.id);
      const previewLink=document.querySelector('.workshop-preview a[href$="#'+w.id+'"]');
      const preview=previewLink?.closest('.workshop-preview');
      [card,preview].filter(Boolean).forEach(el=>{
        const badge=el.querySelector('.workshop-date, .date-badge');
        if(badge){
          badge.hidden=!next;
          if(next){const parts=fmt(next).split(' ');badge.querySelector('strong').textContent=parts[0];badge.querySelector('span').textContent=parts.slice(1).join(' ').toUpperCase();}
        }
        const list=el.querySelector('.workshop-dates');
        if(list){list.replaceChildren(...(upcoming.length?upcoming.map(d=>fmt(d)):['New dates coming soon']).map(s=>{const span=document.createElement('span');span.textContent=s;return span;}));}
        if(preview===el){el.querySelector('p').textContent='09h00–14h00 · '+(next?'Next: '+fmt(next)+(upcoming.length>1?' · More: '+upcoming.slice(1).map(d=>fmt(d)).join(', '):''):'New dates coming soon');}
        const link=el.querySelector('a[href*="wa.me"]');
        if(link)link.href='https://wa.me/27764037621?text='+encodeURIComponent('Hi NF Epoxy, I would like to enquire about the '+w.name+(next?' on '+fmt(next,'long'):' and future dates')+(active&&w.sale?' (Black Friday special)':'')+'. Please confirm availability.');
        if(w.sale){
          let promo=el.querySelector('[data-workshop-promo]');
          if(!promo){promo=document.createElement('div');promo.dataset.workshopPromo='true';promo.style.cssText='color:#D62828;font-weight:800;margin:0 0 12px';promo.innerHTML='BLACK FRIDAY · <del style="color:#64748B;font-weight:500">'+w.price+'</del> '+w.sale;el.querySelector('h3').after(promo);}
          promo.hidden=!active;
          const price=el.querySelector('.price-row > div:first-child strong');
          if(price){price.textContent=active?w.sale:w.price;let old=price.parentElement.querySelector('del');if(!old){old=document.createElement('del');old.textContent=w.price;old.style.cssText='color:#64748B;font-size:13px';price.before(old);}old.hidden=!active;}
        }
      });
    });
  }
  refresh();
  setInterval(refresh,60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
