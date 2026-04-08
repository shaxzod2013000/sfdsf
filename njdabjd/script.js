// 1
const loader = document.getElementById('loader')
const loaderFill = document.getElementById('loaderFill')
let progress = 0;


const loaderInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    loaderFill.style.width = '100%';
    clearInterval(loaderInterval);
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => {
        document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
      }, 200);
    }, 400);
  }
  loaderFill.style.width = progress + '%';
}, 80);

// 2
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
// 3
(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .proj-card, .value-card, .skill-card, .tl-card, .about-tags span, .ustoz-trait').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    ring.style.width = '56px'; ring.style.height = '56px';
    ring.style.borderColor = 'rgba(212,168,75,.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '32px'; ring.style.height = '32px';
    ring.style.borderColor = 'rgba(212,168,75,.5)';
  });
});

const nav       = document.getElementById('nav');
const navMenu   = document.getElementById('navMenu');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

navMenu.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  const spans  = navMenu.querySelectorAll('span');
  const isOpen = mobileNav.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

document.querySelectorAll('.mnav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navMenu.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// 4
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// 5
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.querySelectorAll) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          if (!el.dataset.animated) {
            el.dataset.animated = '1';
            animateCounter(el, parseInt(el.dataset.count), 1400);
          }
        });
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// 6
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach(c => skillObs.observe(c));

const projObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.proj-card').forEach((card, i) => {
  card.style.transitionDelay = (i % 3 * 0.12) + 's';
  projObs.observe(card);
});

// 7
function animateCounter(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// 8
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards  = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projCards.forEach((card, i) => {
      const cat  = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      if (show) {
        card.classList.remove('hidden');
        card.style.opacity   = '0';
        card.style.transform = 'translateY(24px)';
        setTimeout(() => {
          card.style.transition = 'opacity .5s ease, transform .5s ease';
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// 9
document.querySelectorAll('.proj-card, .skill-card, .ustoz-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-8px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.orb').forEach((o, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    o.style.transform = `translateY(${sy * 0.06 * dir}px)`;
  });
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && sy < window.innerHeight) {
    heroContent.style.transform = `translateY(${sy * 0.12}px)`;
    heroContent.style.opacity   = 1 - sy / (window.innerHeight * 0.7);
  }
});

// 10
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    const btn     = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Yuborilmoqda...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = "Yuborildi! 🤍";
      success.classList.add('show');
      contactForm.reset();
      setTimeout(() => { btn.disabled = false; btn.textContent = 'Xabar Yuborish 💌'; success.classList.remove('show'); }, 5000);
    }, 1200);
  });
}

// 11
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.style.opacity = window.scrollY > 600 ? '1' : '0.3';
  });
}


const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');
        link.style.color = 'var(--gold)';
      }
    }
  });
});

// 12
const ustozImg = document.querySelector('.ustoz-img');
if (ustozImg) {
  ustozImg.addEventListener('mouseenter', () => {
    ustozImg.style.transform = 'translateY(-6px) scale(1.02)';
  });
  ustozImg.addEventListener('mouseleave', () => {
    ustozImg.style.transform = '';
  });
}

console.log('%c✦ Shahzodbek Portfolio — Sevgi bilan yaratilgan 🤍', 'color:#d4a84b;font-size:14px;font-weight:bold;font-family:serif');