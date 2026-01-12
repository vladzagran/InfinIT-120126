// Оптимизированный script.js
document.addEventListener('DOMContentLoaded', function() {
    // Дебаунсинг функций
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

    // Мобильное меню
    function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileMenuContent = document.querySelector('.mobile-menu-content');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        const body = document.body;

        function openMenu() {
            mobileMenuToggle.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuContent.classList.add('active');
            body.style.overflow = 'hidden';
        }

        function closeMenu() {
            mobileMenuToggle.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuContent.classList.remove('active');
            body.style.overflow = 'auto';
        }

        // Открытие меню
        mobileMenuToggle.addEventListener('click', openMenu);

        // Закрытие меню
        mobileMenuClose.addEventListener('click', closeMenu);
        mobileMenuOverlay.addEventListener('click', closeMenu);

        // Закрытие при клике на ссылку
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                closeMenu();

                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    setTimeout(() => {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        history.pushState(null, null, targetId);
                    }, 400);
                }
            });
        });

        // Закрытие при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuContent.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Слайдер отзывов
    const track = document.querySelector('.reviews-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.review-card');
    const indicators = document.querySelectorAll('.indicator');
    let currentPosition = 0;
    let cardsPerView = 3;
    let maxPosition = Math.ceil(cards.length / cardsPerView) - 1;
    let cardWidth = null;

    // Кэширование ширины карточки
    function getCardWidth() {
        if (!cardWidth && cards.length > 0) {
            cardWidth = cards[0].offsetWidth + 30;
        }
        return cardWidth || 0;
    }

    // Определяем количество карточек в зависимости от ширины экрана
    function updateCardsPerView() {
        if (window.innerWidth < 768) {
            cardsPerView = 1;
        } else if (window.innerWidth < 1200) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
        maxPosition = Math.ceil(cards.length / cardsPerView) - 1;
        cardWidth = null;
        updateSlider();
    }

    function updateSlider() {
        const width = getCardWidth();
        track.style.transform = `translateX(-${currentPosition * width * cardsPerView}px)`;
        updateButtons();
        updateIndicators();
    }

    function updateButtons() {
        prevBtn.disabled = currentPosition === 0;
        nextBtn.disabled = currentPosition >= maxPosition;
    }

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPosition);
        });
    }

    nextBtn.addEventListener('click', function() {
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentPosition > 0) {
            currentPosition--;
            updateSlider();
        }
    });

    // Клик по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentPosition = index;
            updateSlider();
        });
    });

    // Обработка свайпов на мобильных устройствах
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentPosition < maxPosition) {
                currentPosition++;
            } else if (diff < 0 && currentPosition > 0) {
                currentPosition--;
            }
            updateSlider();
        }
    }

    // Плавная прокрутка к секциям
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // Закрываем мобильное меню если оно открыто
                    const mobileMenuContent = document.querySelector('.mobile-menu-content');
                    if (mobileMenuContent && mobileMenuContent.classList.contains('active')) {
                        mobileMenuContent.classList.remove('active');
                        document.querySelector('.mobile-menu-overlay').classList.remove('active');
                        document.querySelector('.mobile-menu-toggle').classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Обновляем активные ссылки
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    history.pushState(null, null, targetId);
                }
            });
        });

        // Подсветка активного раздела при скролле
        function updateActiveSection() {
            const sections = document.querySelectorAll('section');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const scrollPosition = window.scrollY + headerHeight + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', debounce(updateActiveSection, 100));
        window.addEventListener('load', updateActiveSection);
    }

    // Автопрокрутка отзывов
    let autoScroll = setInterval(function() {
        if (currentPosition < maxPosition) {
            currentPosition++;
        } else {
            currentPosition = 0;
        }
        updateSlider();
    }, 5000);

    // Останавливаем автопрокрутку при наведении
    const sliderContainer = document.querySelector('.reviews-container');
    sliderContainer.addEventListener('mouseenter', function() {
        clearInterval(autoScroll);
    });

    sliderContainer.addEventListener('mouseleave', function() {
        autoScroll = setInterval(function() {
            if (currentPosition < maxPosition) {
                currentPosition++;
            } else {
                currentPosition = 0;
            }
            updateSlider();
        }, 5000);
    });

    // Анимация появления футера при скролле
    function initFooterAnimation() {
        const footer = document.querySelector('.footer');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.style.opacity = '1';
                    footer.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(footer);
    }

    // Инициализация формы контактов
    // В функции initContactForm обновляем обработчик отправки
    function initContactForm() {
        const contactForm = document.querySelector('#contactForm');

        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Получаем чекбокс
            const checkbox = this.querySelector('.checkbox-input');

            // Валидация чекбокса
            if (!checkbox.checked) {
                checkbox.reportValidity();
                checkbox.focus();
                return;
            }

            // Получаем данные формы
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                phone: this.querySelector('input[type="tel"]').value,
                email: this.querySelector('input[type="email"]').value,
                message: this.querySelector('textarea').value,
                privacyAgreed: true
            };

            // Валидация остальных полей
            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }

            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitButton.disabled = true;

            try {
                // Отправка на сервер
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showFormMessage(this, result.message, 'success');
                    this.reset();
                    // Сбрасываем чекбокс
                    checkbox.checked = false;
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                showFormMessage(this, error.message || 'Ошибка отправки сообщения', 'error');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });

        function showFormMessage(form, message, type) {
            const existingMessage = form.querySelector('.form-status');
            if (existingMessage) {
                existingMessage.remove();
            }

            const statusDiv = document.createElement('div');
            statusDiv.className = `form-status form-status-${type}`;
            statusDiv.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                ${message}
            `;

            form.appendChild(statusDiv);

            setTimeout(() => {
                statusDiv.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => statusDiv.remove(), 300);
            }, 5000);
        }
    }

    // Инициализация
    updateCardsPerView();
    updateButtons();
    updateIndicators();
    initSmoothScroll();
    initFooterAnimation();
    initContactForm();

    // Инициализация мобильного меню
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile || window.innerWidth <= 1280) {
        initMobileMenu();
    }

    // Обновление при изменении размера окна
    window.addEventListener('resize', debounce(function() {
        updateCardsPerView();

        if (isMobile || window.innerWidth <= 1280) {
            initMobileMenu();
        }
    }, 250));
});