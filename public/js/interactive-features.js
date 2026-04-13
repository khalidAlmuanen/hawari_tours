// ═══════════════════════════════════════════════════════════════════════
//  🎯 JavaScript للتفاعلات - Hawari Tours
//     Interactive Features & Enhancements
// ═══════════════════════════════════════════════════════════════════════

// انتظر تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
  
  // ═══════════════════════════════════════════════════════════════════
  // 1️⃣ شريط التقدم العلوي (Progress Bar)
  // ═══════════════════════════════════════════════════════════════════
  
  const progressBar = document.getElementById('progress-bar');
  
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height);
      progressBar.style.transform = `scaleX(${scrolled})`;
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 2️⃣ زر العودة للأعلى (Back to Top)
  // ═══════════════════════════════════════════════════════════════════
  
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 3️⃣ شاشة التحميل (Loading Screen)
  // ═══════════════════════════════════════════════════════════════════
  
  const loadingScreen = document.getElementById('loading-screen');
  
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 1000);
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 4️⃣ Lazy Loading للصور
  // ═══════════════════════════════════════════════════════════════════
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 5️⃣ Smooth Scroll للروابط الداخلية
  // ═══════════════════════════════════════════════════════════════════
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // 6️⃣ تأثيرات الظهور عند التمرير (Scroll Animations)
  // ═══════════════════════════════════════════════════════════════════
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.fade-on-scroll').forEach(el => {
    observer.observe(el);
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // 7️⃣ Mobile Menu Toggle
  // ═══════════════════════════════════════════════════════════════════
  
  const mobileMenuBtn = document.querySelector('[data-mobile-menu-btn]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 8️⃣ تتبع النقرات على أزرار الحجز (Analytics)
  // ═══════════════════════════════════════════════════════════════════
  
  document.querySelectorAll('[data-track-booking]').forEach(btn => {
    btn.addEventListener('click', function() {
      const tourName = this.dataset.tourName || 'Unknown';
      
      // Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'booking_click', {
          'event_category': 'Booking',
          'event_label': tourName,
          'value': 1
        });
      }
      
      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
          content_name: tourName,
          content_category: 'Tour'
        });
      }
    });
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // 9️⃣ Form Validation Enhancement
  // ═══════════════════════════════════════════════════════════════════
  
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      // التحقق من الحقول المطلوبة
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('border-red-500');
          
          // إضافة رسالة خطأ
          let errorMsg = field.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('p');
            errorMsg.className = 'error-message text-red-500 text-sm mt-1';
            errorMsg.textContent = 'هذا الحقل مطلوب';
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
          }
        } else {
          field.classList.remove('border-red-500');
          const errorMsg = field.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
          }
        }
      });
      
      // التحقق من البريد الإلكتروني
      const emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach(field => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value && !emailRegex.test(field.value)) {
          isValid = false;
          field.classList.add('border-red-500');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
    
    // إزالة رسائل الخطأ عند الكتابة
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', function() {
        this.classList.remove('border-red-500');
        const errorMsg = this.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      });
    });
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // 🔟 Header Shrink on Scroll
  // ═══════════════════════════════════════════════════════════════════
  
  const header = document.querySelector('header');
  let lastScroll = 0;
  
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 100) {
        header.classList.add('shadow-lg');
      } else {
        header.classList.remove('shadow-lg');
      }
      
      // إخفاء Header عند التمرير للأسفل
      if (currentScroll > lastScroll && currentScroll > 500) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 1️⃣1️⃣ Parallax Effect (اختياري)
  // ═══════════════════════════════════════════════════════════════════
  
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      parallaxElements.forEach(el => {
        const speed = el.dataset.parallaxSpeed || 0.5;
        const yPos = -(window.scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 1️⃣2️⃣ Counter Animation
  // ═══════════════════════════════════════════════════════════════════
  
  const counters = document.querySelectorAll('[data-counter]');
  
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter);
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    };
    
    updateCounter();
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
  
  // ═══════════════════════════════════════════════════════════════════
  // 1️⃣3️⃣ Copy to Clipboard
  // ═══════════════════════════════════════════════════════════════════
  
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async function() {
      const textToCopy = this.dataset.copy;
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // عرض رسالة نجاح
        const originalText = this.textContent;
        this.textContent = 'تم النسخ!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
  
  // ═══════════════════════════════════════════════════════════════════
  // 1️⃣4️⃣ Toast Notifications
  // ═══════════════════════════════════════════════════════════════════
  
  window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[9999] px-6 py-4 rounded-lg shadow-xl transform translate-x-full transition-transform duration-300 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    } text-white`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(150%)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };
  
  // ═══════════════════════════════════════════════════════════════════
  // 1️⃣5️⃣ Image Gallery Lightbox (بسيط)
  // ═══════════════════════════════════════════════════════════════════
  
  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', function() {
      const src = this.dataset.lightbox || this.src;
      
      const lightbox = document.createElement('div');
      lightbox.className = 'fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4';
      lightbox.innerHTML = `
        <button class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">&times;</button>
        <img src="${src}" alt="" class="max-w-full max-h-full object-contain">
      `;
      
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      lightbox.addEventListener('click', function(e) {
        if (e.target === this || e.target.tagName === 'BUTTON') {
          this.remove();
          document.body.style.overflow = '';
        }
      });
    });
  });
  
});

// ═══════════════════════════════════════════════════════════════════
// Performance Optimization
// ═══════════════════════════════════════════════════════════════════

// Defer non-critical JavaScript
window.addEventListener('load', () => {
  // Load non-critical scripts here
});

// ═══════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ═══════════════════════════════════════════════════════════════════
// Console Message (اختياري)
// ═══════════════════════════════════════════════════════════════════

console.log('%c🌴 Hawari Tours - Socotra Island', 'color: #00A86B; font-size: 20px; font-weight: bold;');
console.log('%cMade with ❤️ for Socotra Tourism', 'color: #666; font-size: 12px;');