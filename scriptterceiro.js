// Configurações do WhatsApp
const WHATSAPP_CONFIG = {
    number: "5511999999999", // Número fictício
    message: "Olá! Gostaria de agendar uma consulta."
};

// Função para abrir WhatsApp
function openWhatsApp() {
    const url = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.message)}`;
    window.open(url, '_blank');
}

// Smooth scroll para links internos
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar smooth scroll para links de âncora
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação de entrada para elementos quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Adicionar transição ao header
    header.style.transition = 'transform 0.3s ease';

    // Lazy loading para imagens
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        imageObserver.observe(img);
    });

    // Adicionar efeito de hover nos cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Validação e feedback para formulários (se houver)
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Adicionar feedback visual ao clicar
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Detectar se é mobile para ajustes específicos
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Ajustes específicos para mobile
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) {
            heroButtons.style.flexDirection = 'column';
            heroButtons.style.alignItems = 'center';
        }
    }

    // Resize handler para responsividade
    window.addEventListener('resize', function() {
        const currentIsMobile = window.innerWidth <= 768;
        
        if (currentIsMobile !== isMobile) {
            // Recarregar a página se mudou de desktop para mobile ou vice-versa
            // location.reload();
        }
    });

    // Preloader simples (opcional)
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    });

    // Inicializar com opacity 0 para smooth loading
    document.body.style.opacity = '0';
});

// Função para copiar texto (útil para contatos)
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copiado para a área de transferência!');
        });
    } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copiado para a área de transferência!');
    }
}

// Função para mostrar notificações
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adicionar funcionalidade de clique nos contatos para copiar
document.addEventListener('DOMContentLoaded', function() {
    const contactDetails = document.querySelectorAll('.contact-detail');
    contactDetails.forEach(detail => {
        detail.style.cursor = 'pointer';
        detail.title = 'Clique para copiar';
        
        detail.addEventListener('click', function() {
            const text = this.textContent.trim();
            copyToClipboard(text);
        });
    });
});

// Função para analytics (Google Analytics, etc.) - placeholder
function trackEvent(eventName, eventData = {}) {
    // Implementar tracking de eventos aqui
    console.log('Event tracked:', eventName, eventData);
    
    // Exemplo para Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Rastrear cliques no WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButtons = document.querySelectorAll('[onclick="openWhatsApp()"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('whatsapp_click', {
                button_location: this.closest('section')?.id || 'unknown'
            });
        });
    });
});
