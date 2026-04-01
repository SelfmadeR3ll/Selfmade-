// =============================================
//  SFX CLUB — script.js
// =============================================

// Newsletter subscribe
function handleSubscribe(e) {
  e.preventDefault();
  const confirm = document.getElementById('newsletter-confirm');
  confirm.classList.add('show');
  e.target.reset();
  setTimeout(() => confirm.classList.remove('show'), 4000);
}

// Add to cart feedback
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-card .btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const original = this.textContent;
      this.textContent = '✓ Added!';
      this.style.background = 'var(--lime)';
      this.style.color = 'var(--black)';
      this.style.borderColor = 'var(--lime)';
      setTimeout(() => {
        this.textContent = original;
        this.style.background = '';
        this.style.color = '';
        this.style.borderColor = '';
      }, 1800);
    });
  });

  // Sticky nav shadow on scroll
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.borderBottomColor = 'rgba(200, 241, 53, 0.1)';
    } else {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
    }
  });

  // Animate stats on scroll
  const stats = document.querySelectorAll('.stats__num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(10px)';
        entry.target.style.transition = 'all 0.4s ease';
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));

  // Fade-in sections on scroll
  const sections = document.querySelectorAll('.product-card, .ingredient-card, .testimonial-card');
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeInUp 0.5s ease ${(i % 6) * 0.08}s both`;
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  sections.forEach(s => {
    s.style.opacity = '0';
    fadeObserver.observe(s);
  });
});
