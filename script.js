/**
 * Visit Taniti Island - Official Tourism Guide & Travel Prototype
 * Scripting for interactive functionality, filtering, accessible modals, and navigation
 * Course: WGU D479 User Experience Design Tasks 1 & 2
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State
  let lastActiveElement = null;

  // -------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle
  // -------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  const navLinks = document.querySelectorAll('.primary-nav .nav-link');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      primaryNav.classList.toggle('is-open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          primaryNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 2. Active Navigation Scroll Spy
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('main > section');

  const updateActiveNavLink = () => {
    let currentSectionId = 'home';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const linkSection = link.getAttribute('data-section');
      if (linkSection === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // -------------------------------------------------------------------------
  // 3. Activity Filtering (Usability Task 2)
  //    Allows user to filter by "Nature", "Adventure", "Sightseeing", "All"
  //    Tester can filter to "Nature" and immediately identify the Active Volcano
  // -------------------------------------------------------------------------
  const activityFilterBtns = document.querySelectorAll('.filter-btn');
  const activityCards = document.querySelectorAll('.activity-card');
  const activityCountEl = document.getElementById('activity-count');

  if (activityFilterBtns.length > 0 && activityCards.length > 0) {
    activityFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');

        // Update active filter button state
        activityFilterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Filter activity cards
        let visibleCount = 0;
        activityCards.forEach((card) => {
          const cardCategories = card.getAttribute('data-category') || '';
          const categoryList = cardCategories.split(' ');

          if (filterValue === 'all' || categoryList.includes(filterValue)) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Update announcement count for screen readers & visual users
        if (activityCountEl) {
          const filterName = filterValue === 'all' ? 'activities' : `${btn.textContent.trim()} activities`;
          activityCountEl.textContent = `Showing ${visibleCount} ${filterName}`;
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Lodging Filtering (Supports Usability Task 3)
  //    Allows filtering between Four-Star Resort, Family-Owned Hotels, B&Bs, Hostel
  // -------------------------------------------------------------------------
  const lodgingFilterBtns = document.querySelectorAll('.lodging-filter-btn');
  const lodgingCards = document.querySelectorAll('.lodging-card');
  const lodgingCountEl = document.getElementById('lodging-count');

  if (lodgingFilterBtns.length > 0 && lodgingCards.length > 0) {
    lodgingFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedType = btn.getAttribute('data-lodging');

        lodgingFilterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        let visibleLodging = 0;
        lodgingCards.forEach((card) => {
          const cardType = card.getAttribute('data-lodging-type');
          if (selectedType === 'all' || cardType === selectedType) {
            card.style.display = 'flex';
            visibleLodging++;
          } else {
            card.style.display = 'none';
          }
        });

        if (lodgingCountEl) {
          const typeLabel = selectedType === 'all' ? 'options' : `${btn.textContent.trim()} options`;
          lodgingCountEl.textContent = `Showing ${visibleLodging} ${typeLabel}`;
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Accessible Modal System (Usability Tasks 1 & 2)
  //    Supports opening detailed Rainforest, Volcano, and other activity details
  // -------------------------------------------------------------------------
  const openModalBtns = document.querySelectorAll('.btn-open-modal');
  const allModals = document.querySelectorAll('.modal-overlay');

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;

    lastActiveElement = document.activeElement;
    targetModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Focus the close button or first focusable element inside modal
    const closeBtn = targetModal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.focus();
    }
  };

  const closeModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.setAttribute('hidden', '');
    document.body.style.overflow = '';

    // Restore focus to original triggering button
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  // Attach open listeners
  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-target-modal');
      const genericTitle = btn.getAttribute('data-generic-title');
      const genericDesc = btn.getAttribute('data-generic-desc');

      if (targetModalId === 'modal-generic') {
        const titleEl = document.getElementById('modal-generic-title');
        const descEl = document.getElementById('modal-generic-body-text');
        const inquireBtn = document.getElementById('btn-generic-inquire');
        if (titleEl && genericTitle) titleEl.textContent = genericTitle;
        if (descEl && genericDesc) descEl.textContent = genericDesc;
        if (inquireBtn && genericTitle) inquireBtn.setAttribute('data-title', genericTitle);
      }

      if (targetModalId) {
        openModal(targetModalId);
      }
    });
  });

  // Attach close listeners for all modals
  allModals.forEach((modal) => {
    // Close on clicking backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    // Close buttons inside modal
    const closeButtons = modal.querySelectorAll('[data-close-modal]');
    closeButtons.forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => {
        closeModal(modal);
      });
    });
  });

  // Global ESC key listener to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach((modal) => {
        if (!modal.hasAttribute('hidden')) {
          closeModal(modal);
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 6. Simulated Prototype Action Handler
  //    Handles reservation inquiry clicks with academic UX disclaimer
  // -------------------------------------------------------------------------
  const prototypeActionBtns = document.querySelectorAll('.btn-prototype-action');
  const noticeModal = document.getElementById('modal-prototype-notice');
  const noticeMessage = document.getElementById('prototype-feedback-message');

  prototypeActionBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemTitle = btn.getAttribute('data-title') || 'this item';

      if (noticeMessage) {
        noticeMessage.innerHTML = `
          <strong>Inquiry Simulated:</strong> You selected <em>${itemTitle}</em>.<br><br>
          This is an interactive usability prototype developed for <strong>WGU D479 User Experience Design</strong>. No external booking provider is integrated, and no real reservation is processed.
        `;
      }

      if (noticeModal) {
        openModal('modal-prototype-notice');
      }
    });
  });
});
