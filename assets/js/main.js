/**
 * Next.Innovation - JavaScript Optimizado y Combinado
 * Combina: main.js + optimized.js + funcionalidades adicionales
 * Versión: 2.0 Optimizada
 */

(function() {
  'use strict';

  // ========================================
  // CONFIGURACIÓN Y CONSTANTES
  // ========================================
  const CONFIG = {
    emailjs: {
      userId: '9fEq31igl6ix85uBP',
      serviceId: 'default_service',
      templateId: 'template_id'
    },
    animations: {
      duration: 300,
      easing: 'ease-in-out'
    },
    breakpoints: {
      mobile: 768,
      tablet: 992,
      desktop: 1200
    },
    swiper: {
      autoplayDelay: 5000,
      speed: 400
    }
  };

  // ========================================
  // UTILIDADES
  // ========================================
  const Utils = {
    // Selector simplificado
    select: (el, all = false) => {
      el = el.trim();
      if (all) {
        return [...document.querySelectorAll(el)];
      } else {
        return document.querySelector(el);
      }
    },

    // Event listener simplificado
    on: (type, el, listener, all = false) => {
      let selectEl = Utils.select(el, all);
      if (selectEl) {
        if (all) {
          selectEl.forEach(e => e.addEventListener(type, listener));
        } else {
          selectEl.addEventListener(type, listener);
        }
      }
    },

    // Debounce para performance
    debounce: function(func, wait, immediate) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    // Throttle para scroll events
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Verificar si elemento está en viewport
    isInViewport: function(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    // Obtener tamaño de pantalla
    getScreenSize: function() {
      const width = window.innerWidth;
      if (width < CONFIG.breakpoints.mobile) return 'mobile';
      if (width < CONFIG.breakpoints.tablet) return 'tablet';
      return 'desktop';
    },

    // Animar contador
    animateCounter: function(element, target, duration = 2000) {
      const start = parseInt(element.textContent) || 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current);
      }, 16);
    },

    // Cargar script dinámicamente
    loadScript: function(src, callback) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      document.head.appendChild(script);
    },

    // Validación de email
    isValidEmail: function(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // Validación de teléfono
    isValidPhone: function(phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      return phoneRegex.test(phone);
    },

    // Scroll suave hacia elemento
    scrollTo: function(el) {
      let header = Utils.select('#header');
      let offset = header ? header.offsetHeight : 80;
      let elementPos = Utils.select(el).offsetTop;
      
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      });
    }
  };

  // ========================================
  // CLASE PRINCIPAL DE LA APLICACIÓN
  // ========================================
  class NextInnovationApp {
    constructor() {
      this.isInitialized = false;
      this.components = {};
      this.init();
    }

    init() {
      if (this.isInitialized) return;
      
      this.bindEvents();
      this.setupAccessibility();
      this.loadEmailJS();
      this.isInitialized = true;
    }

    bindEvents() {
      // DOM Content Loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
      } else {
        this.onDOMReady();
      }

      // Window events
      window.addEventListener('scroll', Utils.throttle(() => this.onScroll(), 100));
      window.addEventListener('resize', Utils.debounce(() => this.onResize(), 250));
      window.addEventListener('load', () => this.onWindowLoad());
    }

    onDOMReady() {
      this.setupNavigation();
      this.setupForms();
      this.setupCounters();
      this.setupSmoothScrolling();
      this.setupBackToTop();
      this.updateFooterYear();
      this.initializeAnimations();
      this.setupWhatsAppTracking();
      this.initializeSwiper();
      this.setupPortfolio();
    }

    onScroll() {
      this.updateActiveNavigation();
      this.toggleBackToTop();
      this.animateOnScroll();
      this.updateHeaderScrolled();
    }

    onResize() {
      this.handleMobileNavigation();
    }

    onWindowLoad() {
      this.optimizeImages();
      this.removePreloader();
      this.initializeAOS();
      this.initializePureCounter();
    }

    // ========================================
    // NAVEGACIÓN
    // ========================================
    setupNavigation() {
      const navbar = Utils.select('#navbar');
      const mobileToggle = Utils.select('.mobile-nav-toggle');

      if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleMobileNav();
        });
      }

      // Cerrar menú mobile al hacer click en enlaces
      Utils.on('click', '.nav-link', () => {
        if (navbar && navbar.classList.contains('navbar-mobile')) {
          this.closeMobileNav();
        }
      }, true);

      // Cerrar menú mobile al hacer click fuera
      document.addEventListener('click', (e) => {
        if (navbar && mobileToggle && 
            !navbar.contains(e.target) && 
            !mobileToggle.contains(e.target) &&
            navbar.classList.contains('navbar-mobile')) {
          this.closeMobileNav();
        }
      });

      // Dropdowns en mobile
      Utils.on('click', '.navbar .dropdown > a', function(e) {
        if (Utils.select('#navbar').classList.contains('navbar-mobile')) {
          e.preventDefault();
          this.nextElementSibling.classList.toggle('dropdown-active');
        }
      }, true);
    }

    toggleMobileNav() {
      const navbar = Utils.select('#navbar');
      const toggle = Utils.select('.mobile-nav-toggle');
      
      if (!navbar || !toggle) return;
      
      navbar.classList.toggle('navbar-mobile');
      const isOpen = navbar.classList.contains('navbar-mobile');
      
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.innerHTML = isOpen ? '<i class="bi bi-x"></i>' : '<i class="bi bi-list"></i>';
      
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = isOpen ? 'hidden' : '';
      
      // Gestión de foco
      if (isOpen) {
        const firstLink = navbar.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    }

    closeMobileNav() {
      const navbar = Utils.select('#navbar');
      const toggle = Utils.select('.mobile-nav-toggle');
      
      if (!navbar || !toggle) return;
      
      navbar.classList.remove('navbar-mobile');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="bi bi-list"></i>';
      document.body.style.overflow = '';
    }

    // Actualizar navegación activa
    updateActiveNavigation() {
      let navbarlinks = Utils.select('#navbar .scrollto', true);
      let position = window.scrollY + 200;
      
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return;
        let section = Utils.select(navbarlink.hash);
        if (!section) return;
        
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active');
        } else {
          navbarlink.classList.remove('active');
        }
      });
    }

    // Header scrolled class
    updateHeaderScrolled() {
      let selectHeader = Utils.select('#header');
      if (selectHeader) {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled');
        } else {
          selectHeader.classList.remove('header-scrolled');
        }
      }
    }

    // ========================================
    // FORMULARIOS
    // ========================================
    setupForms() {
      const contactForm = Utils.select('#contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.addEventListener('blur', () => this.validateField(input));
          input.addEventListener('input', () => this.clearFieldError(input));
        });
      }
    }

    async handleFormSubmit(e) {
      e.preventDefault();
      
      const form = e.target;
      const isValid = this.validateForm(form);
      
      if (!isValid) {
        this.showError('Por favor, corrige los errores en el formulario.');
        return;
      }
      
      this.showLoadingState(true);
      
      try {
        const formData = this.getFormData(form);
        await this.sendEmail(formData);
        this.showSuccess();
        form.reset();
        this.trackEvent('form_submit', 'contact', 'success');
      } catch (error) {
        console.error('Error sending email:', error);
        this.showError('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctanos directamente por WhatsApp.');
        this.trackEvent('form_submit', 'contact', 'error');
      } finally {
        this.showLoadingState(false);
      }
    }

    validateForm(form) {
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      return isValid;
    }

    validateField(field) {
      const value = field.value.trim();
      const fieldType = field.type;
      const fieldName = field.name;
      let isValid = true;
      let errorMessage = '';

      // Limpiar errores previos
      this.clearFieldError(field);

      // Validación de campo requerido
      if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
      }

      // Validación de email
      if (fieldType === 'email' && value && !Utils.isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Por favor ingresa un email válido';
      }

      // Validación de teléfono
      if ((fieldType === 'tel' || fieldName === 'phone') && value && !Utils.isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Por favor ingresa un número de teléfono válido';
      }

      // Validación de nombre (mínimo 2 caracteres)
      if (fieldName === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'El nombre debe tener al menos 2 caracteres';
      }

      // Validación de mensaje (mínimo 10 caracteres)
      if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
      }

      if (!isValid) {
        this.showFieldError(field, errorMessage);
      }

      return isValid;
    }

    showFieldError(field, message) {
      field.classList.add('is-invalid');
      let feedback = field.nextElementSibling;
      
      if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.classList.add('invalid-feedback');
        field.parentNode.insertBefore(feedback, field.nextSibling);
      }
      
      feedback.textContent = message;
    }

    clearFieldError(field) {
      field.classList.remove('is-invalid');
      const feedback = field.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = '';
      }
    }

    getFormData(form) {
      const formData = new FormData(form);
      const data = {};
      
      for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
      }
      
      return data;
    }

    // ========================================
    // SERVICIO DE EMAIL
    // ========================================
    loadEmailJS() {
      if (typeof emailjs === 'undefined') {
        Utils.loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js', () => {
          if (typeof emailjs !== 'undefined') {
            emailjs.init(CONFIG.emailjs.userId);
          }
        });
      } else {
        emailjs.init(CONFIG.emailjs.userId);
      }
    }

    async sendEmail(data) {
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS no está disponible. Por favor, contacta directamente por WhatsApp.');
      }

      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject || 'Consulta desde sitio web de Next.Innovation',
        message: `Nombre: ${data.name}\nEmail: ${data.email}\nAsunto: ${data.subject || 'Sin asunto'}\n\nMensaje:\n${data.message}`,
        to_email: 'nextinnovationperu@gmail.com',
        reply_to: data.email
      };

      try {
        const response = await emailjs.send(
          CONFIG.emailjs.serviceId,
          CONFIG.emailjs.templateId,
          templateParams
        );
        
        if (response.status !== 200) {
          throw new Error('Error en el envío del email');
        }
        
        return response;
      } catch (error) {
        console.error('EmailJS Error:', error);
        throw error;
      }
    }

    // ========================================
    // GESTIÓN DE ESTADOS DE UI
    // ========================================
    showLoadingState(loading) {
      const button = Utils.select('.btn-submit');
      const btnText = button?.querySelector('.btn-text');
      const btnLoading = button?.querySelector('.btn-loading');
      const loadingDiv = Utils.select('.loading');
      
      if (loading) {
        if (button) {
          button.disabled = true;
          button.style.opacity = '0.7';
        }
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline-block';
        if (loadingDiv) loadingDiv.style.display = 'flex';
      } else {
        if (button) {
          button.disabled = false;
          button.style.opacity = '1';
        }
        if (btnText) btnText.style.display = 'inline-block';
        if (btnLoading) btnLoading.style.display = 'none';
        if (loadingDiv) loadingDiv.style.display = 'none';
      }
    }

    showSuccess() {
      this.hideMessages();
      const successMsg = Utils.select('.sent-message');
      if (successMsg) {
        successMsg.style.display = 'flex';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 8000);
      }
    }

    showError(message) {
      this.hideMessages();
      const errorMsg = Utils.select('.error-message');
      if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
          errorMsg.style.display = 'none';
        }, 8000);
      }
    }

    hideMessages() {
      const messages = document.querySelectorAll('.loading, .error-message, .sent-message');
      messages.forEach(msg => msg.style.display = 'none');
    }

    // ========================================
    // CONTADORES ANIMADOS
    // ========================================
    setupCounters() {
      const counters = Utils.select('.counter', true);
      if (counters.length === 0) return;

      const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            counter.setAttribute('data-counted', 'true');
            Utils.animateCounter(counter, target);
            observer.unobserve(counter);
          }
        });
      }, observerOptions);
      
      counters.forEach(counter => observer.observe(counter));
    }

    // ========================================
    // SCROLL SUAVE
    // ========================================
    setupSmoothScrolling() {
      // Scroll con offset en enlaces con clase .scrollto
      Utils.on('click', '.scrollto', function(e) {
        if (Utils.select(this.hash)) {
          e.preventDefault();

          let navbar = Utils.select('#navbar');
          if (navbar.classList.contains('navbar-mobile')) {
            navbar.classList.remove('navbar-mobile');
            let navbarToggle = Utils.select('.mobile-nav-toggle');
            navbarToggle.classList.toggle('bi-list');
            navbarToggle.classList.toggle('bi-x');
          }
          Utils.scrollTo(this.hash);
        }
      }, true);

      // Scroll al cargar página con hash
      window.addEventListener('load', () => {
        if (window.location.hash) {
          if (Utils.select(window.location.hash)) {
            Utils.scrollTo(window.location.hash);
          }
        }
      });
    }

    // ========================================
    // BOTÓN BACK TO TOP
    // ========================================
    setupBackToTop() {
      const backToTop = Utils.select('.back-to-top');
      
      if (backToTop) {
        backToTop.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          
          this.trackEvent('click', 'back_to_top', 'header');
        });
      }
    }

    toggleBackToTop() {
      const backToTop = Utils.select('.back-to-top');
      if (backToTop) {
        if (window.pageYOffset > 300) {
          backToTop.classList.add('active');
        } else {
          backToTop.classList.remove('active');
        }
      }
    }

    // ========================================
    // SWIPER/CAROUSELS
    // ========================================
    initializeSwiper() {
      // Testimonials Slider
      if (typeof Swiper !== 'undefined' && Utils.select('.testimonials-slider')) {
        new Swiper('.testimonials-slider', {
          speed: CONFIG.swiper.speed,
          loop: true,
          autoplay: {
            delay: CONFIG.swiper.autoplayDelay,
            disableOnInteraction: false
          },
          slidesPerView: 'auto',
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          }
        });
      }

      // Clients Slider
      if (typeof Swiper !== 'undefined' && Utils.select('.clients-slider')) {
        new Swiper('.clients-slider', {
          speed: CONFIG.swiper.speed,
          loop: true,
          autoplay: {
            delay: CONFIG.swiper.autoplayDelay,
            disableOnInteraction: false
          },
          slidesPerView: 'auto',
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          },
          breakpoints: {
            320: {
              slidesPerView: 2,
              spaceBetween: 40
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 60
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 80
            },
            992: {
              slidesPerView: 6,
              spaceBetween: 120
            }
          }
        });
      }

      // Portfolio Details Slider
      if (typeof Swiper !== 'undefined' && Utils.select('.portfolio-details-slider')) {
        new Swiper('.portfolio-details-slider', {
          speed: CONFIG.swiper.speed,
          loop: true,
          autoplay: {
            delay: CONFIG.swiper.autoplayDelay,
            disableOnInteraction: false
          },
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          }
        });
      }
    }

    // ========================================
    // PORTFOLIO
    // ========================================
    setupPortfolio() {
      window.addEventListener('load', () => {
        let portfolioContainer = Utils.select('.portfolio-container');
        if (portfolioContainer && typeof Isotope !== 'undefined') {
          let portfolioIsotope = new Isotope(portfolioContainer, {
            itemSelector: '.portfolio-item'
          });

          let portfolioFilters = Utils.select('#portfolio-flters li', true);

          Utils.on('click', '#portfolio-flters li', function(e) {
            e.preventDefault();
            portfolioFilters.forEach(function(el) {
              el.classList.remove('filter-active');
            });
            this.classList.add('filter-active');

            portfolioIsotope.arrange({
              filter: this.getAttribute('data-filter')
            });
            
            if (typeof AOS !== 'undefined') {
              portfolioIsotope.on('arrangeComplete', function() {
                AOS.refresh();
              });
            }
          }, true);
        }

        // Portfolio Lightbox
        if (typeof GLightbox !== 'undefined') {
          const portfolioLightbox = GLightbox({
            selector: '.portfolio-lightbox'
          });
        }
      });
    }

    // ========================================
    // WHATSAPP TRACKING
    // ========================================
    setupWhatsAppTracking() {
      const whatsappButtons = document.querySelectorAll('a[href*="whatsapp"], .iconwasath');
      
      whatsappButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.trackEvent('click', 'whatsapp', 'contact');
        });
      });
    }

    // ========================================
    // ACCESIBILIDAD
    // ========================================
    setupAccessibility() {
      // Navegación por teclado para menú móvil
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileNav();
        }
      });

      // Gestión de foco para menú móvil
      const navbar = Utils.select('#navbar');
      if (navbar) {
        navbar.addEventListener('keydown', (e) => {
          if (e.key === 'Tab' && navbar.classList.contains('navbar-mobile')) {
            const focusableElements = navbar.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
        });
      }

      // Skip link functionality
      const skipLink = Utils.select('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const target = Utils.select('#main');
          if (target) {
            target.scrollIntoView();
            target.focus();
          }
        });
      }
    }

    // ========================================
    // ANIMACIONES
    // ========================================
    animateOnScroll() {
      const elements = document.querySelectorAll('[data-aos]:not(.aos-animate)');
      
      elements.forEach(element => {
        if (Utils.isInViewport(element)) {
          element.classList.add('aos-animate');
        }
      });
    }

    initializeAnimations() {
      // Simple AOS-like functionality
      const elements = document.querySelectorAll('[data-aos]');
      
      elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });
    }

    initializeAOS() {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 1000,
          easing: "ease-in-out",
          once: true,
          mirror: false
        });
      }
    }

    initializePureCounter() {
      if (typeof PureCounter !== 'undefined') {
        new PureCounter();
      }
    }

    // ========================================
    // OPTIMIZACIÓN DE IMÁGENES
    // ========================================
    optimizeImages() {
      // Lazy loading para imágenes sin soporte nativo
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    }

    // ========================================
    // PRELOADER
    // ========================================
    removePreloader() {
      const preloader = Utils.select('#preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.remove();
        }, 300);
      }
    }

    // ========================================
    // UTILIDADES VARIAS
    // ========================================
    updateFooterYear() {
      const yearElement = Utils.select('#currentYear');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    }

    handleMobileNavigation() {
      const screenSize = Utils.getScreenSize();
      const navbar = Utils.select('#navbar');
      
      if (screenSize !== 'mobile' && navbar && navbar.classList.contains('navbar-mobile')) {
        this.closeMobileNav();
      }
    }

    // ========================================
    // TRACKING DE EVENTOS
    // ========================================
    trackEvent(action, category, label) {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', action, {
          event_category: category,
          event_label: label
        });
      }
      
      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', 'CustomEvent', {
          action: action,
          category: category,
          label: label
        });
      }
      
      // Console log para debugging
      console.log('Event tracked:', { action, category, label });
    }

    // ========================================
    // MÉTODOS PÚBLICOS
    // ========================================
    scrollToSection(sectionId) {
      const section = Utils.select(sectionId);
      if (section) {
        const header = Utils.select('#header');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }

    showNotification(message, type = 'info') {
      // Crear elemento de notificación si no existe
      let notification = Utils.select('.notification');
      if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 5px;
          color: white;
          font-weight: 500;
          z-index: 10000;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        `;
        document.body.appendChild(notification);
      }

      // Establecer estilo de notificación basado en tipo
      const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
      };

      notification.style.backgroundColor = colors[type] || colors.info;
      notification.textContent = message;
      notification.style.transform = 'translateX(0)';

      // Auto ocultar después de 5 segundos
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
      }, 5000);
    }
  }

  // ========================================
  // INICIALIZACIÓN
  // ========================================
  let app;

  // Esperar DOM o inicializar inmediatamente si está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      app = new NextInnovationApp();
    });
  } else {
    app = new NextInnovationApp();
  }

  // Exponer instancia de app globalmente para debugging
  window.NextInnovationApp = app;

  // ========================================
  // FUNCIONALIDADES ADICIONALES
  // ========================================
  
  // Inicializar EmailJS cuando esté disponible
  document.addEventListener('DOMContentLoaded', function() {
    // EmailJS initialization
    if (typeof emailjs !== 'undefined') {
      emailjs.init('9fEq31igl6ix85uBP');
    }
    
    // Establecer año actual en footer
    const currentYearEl = Utils.select('#currentYear');
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
    
    // Performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  });

  // ========================================
  // ESTILOS DINÁMICOS
  // ========================================
  
  // Agregar estilos mejorados para animaciones AOS
  const style = document.createElement('style');
  style.textContent = `
    [data-aos].aos-animate {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    .notification {
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      max-width: 300px;
      word-wrap: break-word;
    }
    
    /* Mejoras de smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Loading spinner mejorado */
    .spinner {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Focus mejorado para accesibilidad */
    .navbar a:focus,
    .btn-submit:focus,
    .back-to-top:focus {
      outline: 2px solid #47b2e4;
      outline-offset: 2px;
    }
    
    /* Transiciones suaves para mobile nav */
    .navbar-mobile {
      transition: transform 0.3s ease;
    }
    
    /* Mejoras de performance */
    .will-change-transform {
      will-change: transform;
    }
    
    .will-change-opacity {
      will-change: opacity;
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // FUNCIONES DE COMPATIBILIDAD
  // ========================================
  
  // Polyfill para IntersectionObserver si no está disponible
  if (!window.IntersectionObserver) {
    Utils.loadScript('https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver', () => {
      console.log('IntersectionObserver polyfill loaded');
    });
  }

  // Console message para desarrollo
  if (typeof console !== 'undefined' && console.log) {
    console.log('%c🚀 Next.Innovation App Initialized', 'color: #47b2e4; font-size: 16px; font-weight: bold;');
    console.log('%cVersion: 2.0 Optimized', 'color: #6c757d; font-size: 12px;');
  }

})();