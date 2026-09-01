/**
 * ==============================================================================
 * GAREEMA — PORTFOLIO INTERACTION SCRIPT
 * Computer Science Engineering Student
 * Lovely Professional University (LPU)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Scroll Progress & Sticky Header
     -------------------------------------------------------------------------- */
  const scrollProgress = document.getElementById('scroll-progress');
  const siteHeader = document.querySelector('.site-header');

  function updateScrollMetrics() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (siteHeader) {
      if (scrollTop > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateScrollMetrics, { passive: true });

  /* --------------------------------------------------------------------------
     2. Scroll Reveal Observer (.reveal-item)
     -------------------------------------------------------------------------- */
  const revealItems = document.querySelectorAll('.reveal-item');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
  );

  revealItems.forEach(item => revealObserver.observe(item));

  /* --------------------------------------------------------------------------
     3. Active Navigation Link Highlighting on Scroll
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveSection() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(sec => {
      const secH = sec.offsetHeight;
      const secT = sec.offsetTop - 140;
      const secId = sec.getAttribute('id');

      if (scrollPos >= secT && scrollPos < secT + secH) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });

  /* --------------------------------------------------------------------------
     4. Mobile Navigation Drawer Toggle
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Button Actions: Explore Projects, Let's Connect
     -------------------------------------------------------------------------- */
  const exploreBtn = document.getElementById('btn-explore-projects');
  const connectBtn = document.getElementById('btn-lets-connect');

  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('projects');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (connectBtn) {
    connectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('contact');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. Certificate Lightbox Modal Viewer
     -------------------------------------------------------------------------- */
  const certModal = document.getElementById('cert-modal');
  const certModalClose = document.getElementById('cert-modal-close');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalTitle = document.getElementById('cert-modal-title');

  const certTriggers = document.querySelectorAll('.cert-lightbox-trigger, .cert-lightbox-btn');

  certTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const title = trigger.getAttribute('data-cert-title') || 'CERTIFICATION CREDENTIAL';
      const imgSrc = trigger.getAttribute('data-cert-src') || 'assets/certificate-placeholder.svg';

      if (certModal && certModalImg && certModalTitle) {
        certModalImg.src = imgSrc;
        certModalTitle.textContent = title;
        certModal.classList.add('open');
        certModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (certModalClose && certModal) {
    certModalClose.addEventListener('click', () => {
      certModal.classList.remove('open');
      certModal.setAttribute('aria-hidden', 'true');
    });

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        certModal.classList.remove('open');
        certModal.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('open')) {
        certModal.classList.remove('open');
        certModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. Contact Form Handler
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        showFeedback('Please complete all required fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>SENDING MESSAGE...</span>';
      }

      setTimeout(() => {
        showFeedback(
          `Thank you, ${name}! Your message regarding "${subject}" has been received. For direct correspondence, feel free to email GAREEMA at gareemajoshi07@gmail.com.`,
          'success'
        );

        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>SEND MESSAGE</span>';
        }
      }, 600);
    });
  }

  function showFeedback(msg, type) {
    formFeedback.textContent = msg;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';
  }

});
