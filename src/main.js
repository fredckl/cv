import Alpine from 'alpinejs';
import AOS from 'aos';
import emailjs from 'emailjs-com';
import { EMAILJS_CONFIG } from './emailjs-config';
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
  
  // Gestion du formulaire de contact avec EmailJS
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Désactiver le bouton pendant l'envoi
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...';
      }
      
      // Récupérer les valeurs du formulaire
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Préparer les données pour EmailJS
      const templateParams = {
        name: name,
        email: email,
        message: message
      };
      
      // Envoyer l'email via EmailJS
      emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.USER_ID
      )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        // Afficher un message de succès
        if (formStatus) {
          formStatus.innerHTML = '<div class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">Votre message a été envoyé avec succès !</div>';
          formStatus.classList.remove('hidden');
        } else {
          alert('Votre message a été envoyé avec succès !');
        }
        
        // Réactiver le bouton
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Envoyer';
        }
      })
      .catch((error) => {
        console.error('FAILED...', error);
        
        // Afficher un message d'erreur
        if (formStatus) {
          formStatus.innerHTML = '<div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.</div>';
          formStatus.classList.remove('hidden');
        } else {
          alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
        }
        
        // Réactiver le bouton
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Envoyer';
        }
      });
    });
  }
});
