/**
 * RAJIV GANDHI DEGREE COLLEGE - MASTER JAVASCRIPT
 * Responsive navigation, animations, filters, lightbox, form validation & UX
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Mobile Navigation & Drawer Handling
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const mobileClose = document.getElementById('mobileClose');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMenu() {
    if (navMenu && navOverlay) {
      navMenu.classList.add('open');
      navOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMenu() {
    if (navMenu && navOverlay) {
      navMenu.classList.remove('open');
      navOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  /* ==========================================================================
     2. Sticky Header with Shadow on Scroll
     ========================================================================== */
  const header = document.querySelector('.header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollPos > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     3. Active Nav Link Detection
     ========================================================================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (href !== 'index.html' && currentPath.includes(href)) {
      link.classList.add('active');
    }
  });

  /* ==========================================================================
     4. Animated Statistics Counter (IntersectionObserver)
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    let animated = false;

    const runCounterAnimation = () => {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const prefix = stat.getAttribute('data-prefix') || '';
        const suffix = stat.getAttribute('data-suffix') || '';
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let stepCount = 0;

        const timer = setInterval(() => {
          stepCount++;
          current += increment;
          if (stepCount >= steps) {
            stat.textContent = prefix + target.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            stat.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
          }
        }, duration / steps);
      });
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            runCounterAnimation();
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      observer.observe(statsSection);
    } else if (statNumbers.length > 0) {
      // Fallback
      runCounterAnimation();
    }
  }

  /* ==========================================================================
     5. Filter Tabs System (Courses, Faculty, Gallery)
     ========================================================================== */
  function setupFilterSystem(containerId, itemSelector, filterDataAttr) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filterBtns = container.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll(itemSelector);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        items.forEach(item => {
          const itemCategory = item.getAttribute(filterDataAttr);
          if (filterValue === 'all' || itemCategory === filterValue || (itemCategory && itemCategory.includes(filterValue))) {
            item.style.display = '';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.transition = 'opacity 0.4s ease';
              item.style.opacity = '1';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Setup tabs
  setupFilterSystem('coursesFilter', '.course-card', 'data-category');
  setupFilterSystem('facultyFilter', '.faculty-card', 'data-department');
  setupFilterSystem('galleryFilter', '.gallery-item', 'data-category');

  /* ==========================================================================
     6. Course Live Search Filter (If search input exists)
     ========================================================================== */
  const courseSearchInput = document.getElementById('courseSearchInput');
  if (courseSearchInput) {
    courseSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const courseCards = document.querySelectorAll('.course-card');

      courseCards.forEach(card => {
        const title = (card.querySelector('.course-title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.course-desc')?.textContent || '').toLowerCase();
        const tag = (card.querySelector('.course-tag')?.textContent || '').toLowerCase();

        if (title.includes(term) || desc.includes(term) || tag.includes(term)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  /* ==========================================================================
     7. Gallery Lightbox Modal
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const galleryList = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('.gallery-img');
    const title = item.querySelector('.gallery-title')?.textContent || 'Rajiv Gandhi Degree College';
    const tag = item.querySelector('.gallery-tag')?.textContent || '';
    
    if (img) {
      galleryList.push({
        src: img.getAttribute('src') || img.src,
        caption: `${title} - ${tag}`
      });

      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    if (!lightboxModal || galleryList.length === 0) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    if (!galleryList[currentGalleryIndex]) return;
    const current = galleryList[currentGalleryIndex];
    if (lightboxImg) lightboxImg.src = current.src;
    if (lightboxCaption) lightboxCaption.textContent = current.caption;
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryList.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryList.length) % galleryList.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

  /* ==========================================================================
     8. FAQ Accordion Toggle
     ========================================================================== */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all open accordion items in the same container
      const parentList = item.parentElement;
      if (parentList) {
        parentList.querySelectorAll('.accordion-item').forEach(otherItem => {
          otherItem.classList.remove('active');
        });
      }

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     9. Contact Form Interactive Validation & Toast
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formToast = document.getElementById('formToast');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message, isSuccess = true) {
    if (!formToast) return;
    if (toastMessage) toastMessage.textContent = message;
    formToast.style.borderLeftColor = isSuccess ? 'var(--success)' : 'var(--danger)';
    formToast.classList.add('show');
    setTimeout(() => {
      formToast.classList.remove('show');
    }, 5000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const course = document.getElementById('courseInterest');
      const message = document.getElementById('message');

      // Helper validation
      const validateField = (input, condition) => {
        const formGroup = input.closest('.form-group');
        if (!condition) {
          formGroup.classList.add('has-error');
          isValid = false;
        } else {
          formGroup.classList.remove('has-error');
        }
      };

      if (fullName) {
        validateField(fullName, fullName.value.trim().length >= 3);
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(email, emailRegex.test(email.value.trim()));
      }

      if (phone) {
        const phoneRegex = /^[0-9+() -]{7,15}$/;
        validateField(phone, phoneRegex.test(phone.value.trim()));
      }

      if (course) {
        validateField(course, course.value !== '');
      }

      if (message) {
        validateField(message, message.value.trim().length >= 10);
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        // Simulate successful client-side submission
        setTimeout(() => {
          const refNo = 'RGDC-' + Math.floor(100000 + Math.random() * 900000);
          showToast(`Thank you! Your enquiry has been received. Reference ID: ${refNo}. Our admissions team will contact you shortly.`);
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 800);
      }
    });

    // Remove error class on user input
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  /* ==========================================================================
     10. Dynamic Current Year Updater
     ========================================================================== */
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

});

