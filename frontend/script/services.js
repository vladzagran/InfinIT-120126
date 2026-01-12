// Фильтрация услуг по категориям
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const serviceCategories = document.querySelectorAll('.service-category');

    // Показываем все услуги при загрузке
    showAllServices();

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Убираем активный класс у всех кнопок
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            if (category === 'all') {
                showAllServices();
            } else {
                filterServices(category);
            }
        });
    });

    function showAllServices() {
        serviceCategories.forEach(category => {
            category.style.display = 'block';
            category.style.opacity = '1';
        });
    }

    function filterServices(selectedCategory) {
        serviceCategories.forEach(category => {
            const categoryType = category.getAttribute('data-category');

            if (categoryType === selectedCategory) {
                category.style.display = 'block';
                setTimeout(() => {
                    category.style.opacity = '1';
                }, 50);
            } else {
                category.style.opacity = '0';
                setTimeout(() => {
                    category.style.display = 'none';
                }, 300);
            }
        });
    }

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация появления карточек при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Применяем анимацию к карточкам услуг
    document.querySelectorAll('.detailed-service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});