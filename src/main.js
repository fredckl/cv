import Alpine from 'alpinejs';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './style.css';

// Initialiser AlpineJS
window.Alpine = Alpine;
Alpine.start();

// Initialiser AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
  });
  
  // Gestion du menu mobile
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Gestion du mode sombre
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile');
  
  // Fonction pour activer/désactiver le mode sombre
  const toggleDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };
  
  // Vérifier si le mode sombre est déjà activé
  const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                     localStorage.getItem('darkMode') === null);
  
  // Appliquer le mode initial
  toggleDarkMode(isDarkMode);
  
  // Mettre à jour les toggles
  if (darkModeToggle) {
    darkModeToggle.checked = isDarkMode;
    darkModeToggle.addEventListener('change', () => {
      toggleDarkMode(darkModeToggle.checked);
      if (darkModeToggleMobile) {
        darkModeToggleMobile.checked = darkModeToggle.checked;
      }
    });
  }
  
  if (darkModeToggleMobile) {
    darkModeToggleMobile.checked = isDarkMode;
    darkModeToggleMobile.addEventListener('change', () => {
      toggleDarkMode(darkModeToggleMobile.checked);
      if (darkModeToggle) {
        darkModeToggle.checked = darkModeToggleMobile.checked;
      }
    });
  }
  
  // Animation de la barre de progression des compétences
  const skillBars = document.querySelectorAll('.skill-bar');
  
  skillBars.forEach(bar => {
    const level = bar.getAttribute('data-level');
    setTimeout(() => {
      bar.style.width = `${level}%`;
    }, 300);
  });
});
