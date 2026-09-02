document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    /*
     * =========================================================
     * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
     * =========================================================
     */

    function setText(selector, value, useHTML = false) {
        document.querySelectorAll(selector).forEach((element) => {
            if (useHTML) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        });
    }

    function updateBodyLock() {
        const hasOpenModal = document.querySelector('.modal-overlay.active');

        body.classList.toggle('modal-open', Boolean(hasOpenModal));
    }

    function openOverlay(overlay) {
        if (!overlay) return;

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        updateBodyLock();

        const focusTarget = overlay.querySelector(
            'select, input, button:not(.modal-close), textarea'
        );

        window.setTimeout(() => {
            focusTarget?.focus({ preventScroll: true });
        }, 50);
    }

    function closeOverlay(overlay) {
        if (!overlay) return;

        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        updateBodyLock();
    }


    /*
     * =========================================================
     * МОБИЛЬНОЕ МЕНЮ
     * =========================================================
     */
    /* Инициализация Яндекс Карт */
if (typeof ymaps !== 'undefined') {
    ymaps.ready(initMap);
}

function initMap() {
    const mapElement = document.getElementById('yandexMap');
    if (!mapElement) return;

    const map = new ymaps.Map('yandexMap', {
        center: [55.875, 37.485], // Центрирование между Москвой и Долгопрудным
        zoom: 11,
        controls: ['zoomControl']
    });

    // Филиал в Долгопрудном
    const dolgoprudnyPlacemark = new ymaps.Placemark([55.9398, 37.5142], {
        balloonContentHeader: 'KODI MUSIC CLASS',
        balloonContentBody: 'г. Долгопрудный, ул. Новый бульвар, д. 22',
        hintContent: 'KODI — Долгопрудный'
    }, {
        preset: 'islands#orangeDotIcon'
    });

    // Филиал в Москве
    const moscowPlacemark = new ymaps.Placemark([55.8562, 37.4862], {
        balloonContentHeader: 'KODI MUSIC CLASS',
        balloonContentBody: 'г. Москва, Флотская ул., 7, корп. 1',
        hintContent: 'KODI — Москва'
    }, {
        preset: 'islands#orangeDotIcon'
    });

    map.geoObjects.add(dolgoprudnyPlacemark);
    map.geoObjects.add(moscowPlacemark);
    map.behaviors.disable('scrollZoom');
}
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mainNav = document.getElementById('mainNav');

    function closeMobileMenu() {
        if (!mobileMenuButton || !mainNav) return;

        mainNav.classList.remove('mobile-open');
        mobileMenuButton.classList.remove('active');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-label', 'Открыть меню');
    }

    function openMobileMenu() {
        if (!mobileMenuButton || !mainNav) return;

        mainNav.classList.add('mobile-open');
        mobileMenuButton.classList.add('active');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        mobileMenuButton.setAttribute('aria-label', 'Закрыть меню');
    }

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (mainNav.classList.contains('mobile-open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mainNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', (event) => {
            if (
                mainNav.classList.contains('mobile-open') &&
                !mainNav.contains(event.target) &&
                !mobileMenuButton.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }


    /*
     * =========================================================
     * ПЕРЕВОРОТ КАРТОЧЕК
     * =========================================================
     */

    document.querySelectorAll('.flip-container').forEach((container) => {
        const toggles = container.querySelectorAll('.flip-toggle');

        toggles.forEach((toggle) => {
            toggle.setAttribute('role', 'button');
            toggle.setAttribute('tabindex', '0');
            toggle.setAttribute('aria-expanded', 'false');

            const flipCard = () => {
                const isFlipped = container.classList.toggle('flipped');

                toggles.forEach((item) => {
                    item.setAttribute('aria-expanded', String(isFlipped));
                });
            };

            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                flipCard();
            });

            toggle.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    flipCard();
                }
            });
        });
    });


    /*
     * =========================================================
     * МОДАЛЬНОЕ ОКНО ЗАПИСИ
     * =========================================================
     */

    const bookingModal = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const directionSelect = document.getElementById('directionSelect');

    if (bookingModal) {
        bookingModal.setAttribute('aria-hidden', 'true');
    }

    function openBookingModal(directionValue = '') {
        if (!bookingModal) return;

        /*
         * Значения option не переводятся.
         * Благодаря этому выбор направления работает как
         * в русской, так и в английской версии.
         */
        if (directionValue && directionSelect) {
            const matchingOption = Array.from(directionSelect.options).find(
                (option) => option.value === directionValue
            );

            if (matchingOption) {
                directionSelect.value = matchingOption.value;
            }
        }

        closeMobileMenu();
        openOverlay(bookingModal);
    }

    function closeBookingModal() {
        closeOverlay(bookingModal);
    }

    document.querySelectorAll('.open-modal-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const direction = button.dataset.direction || '';
            openBookingModal(direction);
        });
    });

    modalClose?.addEventListener('click', closeBookingModal);

    bookingModal?.addEventListener('click', (event) => {
        if (event.target === bookingModal) {
            closeBookingModal();
        }
    });


    /*
     * =========================================================
     * МОДАЛЬНОЕ ОКНО ПОЛИТИКИ
     * =========================================================
     */

    const privacyModal = document.getElementById('privacyModal');
    const privacyClose = document.querySelector('.privacy-modal-close');

    if (privacyModal) {
        privacyModal.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.open-privacy-modal').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            closeMobileMenu();
            openOverlay(privacyModal);
        });
    });

    privacyClose?.addEventListener('click', () => {
        closeOverlay(privacyModal);
    });

    privacyModal?.addEventListener('click', (event) => {
        if (event.target === privacyModal) {
            closeOverlay(privacyModal);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        closeMobileMenu();
        closeOverlay(bookingModal);
        closeOverlay(privacyModal);
    });


    /*
     * =========================================================
     * ЛОКАЛИЗАЦИЯ
     * =========================================================
     */

    const languageSwitch = document.getElementById('languageSwitch');
    let currentLanguage = 'ru';

    const translations = {
        ru: {
            nav: [
                'О СТУДИИ',
                'НАПРАВЛЕНИЯ',
                'СЕРТИФИКАТЫ',
                'ОТЗЫВЫ',
                'КОНТАКТЫ'
            ],

            heroTop: 'MUSIC / PEOPLE / HOME',
            heroSubtitle: 'Музыкальная школа в Москве и Долгопрудном',
            heroButton: 'Записаться на урок',
            freeLesson: '• ПЕРВЫЙ УРОК БЕСПЛАТНО •',
            location: 'МОСКВА / ДОЛГОПРУДНЫЙ',
            scroll: 'SCROLL ↓',

            aboutLabel: '01 / О СТУДИИ',
            aboutTitle: 'МУЗЫКА<br><span>- твой дом.</span>',
            aboutP1:
                '<strong>KODI</strong> в переводе с финского «ДОМ». И это не случайно: мы создали пространство, где не страшно ошибаться, а обучение приносит удовольствие и быстрые результаты.',
            aboutP2:
                'Руководитель студии — Василий Рыбин, известный музыкант и режиссёр. Музыка появилась в его жизни в 3 года — всё началось с барабанов, именно эта искренняя любовь к инструменту легла в основу его подхода.',
            aboutP3:
                'В KODI мы помогаем раскрыть вкус и стиль: не учим «как правильно», а учим «как твоё».',
            aboutP4: 'Добро пожаловать домой, в KODI!',
            founderRole: 'Основатель &amp; Руководитель KODI',

            directionsLabel: '02 / НАПРАВЛЕНИЯ',
            teachers: 'Педагоги',
            back: 'Назад',
            teachersHeading: 'ПЕДАГОГИ',
            book: 'Записаться',

            cards: [
                {
                    title: 'Вокал',
                    description:
                        'Раскрывает эмоциональную выразительность и артистизм.',
                    teacher: 'Илья Мичурин',
                    experience: 'Преподаватель вокала / Опыт сцены'
                },
                {
                    title: 'Гитара (Электро/Акустика)',
                    description:
                        'Тренирует мелкую моторику и понимание гармонии.',
                    teacher: 'Преподаватель гитары',
                    experience: 'Концертный музыкант'
                },
                {
                    title: 'Фортепиано',
                    description:
                        'Совершенствует музыкальный слух и синхронную работу обеих рук.',
                    teacher: 'Преподаватель фортепиано',
                    experience: 'Лауреат конкурсов'
                },
                {
                    title: 'Ударные',
                    description:
                        'Развивают чувство ритма и координацию движений.',
                    teacher: 'Константин',
                    experience: 'Преподаватель ударных / Сессионный барабанщик'
                }
            ],

            certificatesLabel: '03 / СЕРТИФИКАТЫ',
            certLessons: ['4 занятия', '8 занятий'],
            cert1: 'ДОЛГОПРУДНЫЙ',
            cert2: 'МОСКВА (ФЛОТСКАЯ)',
            certTitle: 'ПОДАРОЧНЫЙ<br>СЕРТИФИКАТ',

            reviewsLabel: '04 / ОТЗЫВЫ',
            reviewsTitle: 'ОТЗЫВЫ УЧЕНИКОВ',

            reviews: [
                '«Хорошая музыкальная школа с классным обучением! Преподаватели внимательные и профессиональные, занятия проходят интересно и вдохновляюще. Результаты заметны быстро, рекомендую для всех, кто хочет научиться музыке.»',
                '«Хорошая школа. Современный ремонт, приятно находиться внутри. Очень творческая атмосфера, современное оборудование. Хожу на вокал к Илье Мичурину. Очень нравится подход педагога, объясняет все очень понятно. С первых занятий уже был небольшой результат и прогресс»',
                '«Я очень довольна уроками, которые я получаю в музыкальной школе KODI. Преподаватель по барабанам — Константин профессионально подходит к обучению и создаёт тёплую и поддерживающую атмосферу. Очень рекомендую эту школу всем, кто хочет развивать свой музыкальный талант! 😍❤️»'
            ],

            posterBy: 'by Vasilii Rybin',

            contactsLabel: '05 / КОНТАКТЫ',
            namePlaceholder: 'Ваше Имя',
            methodLabel: 'Удобный способ связи',
            consentPrefix: 'Я ознакомлен(а) с',
            privacy: 'Политикой обработки персональных данных',
            send: 'Отправить заявку',

            modalTitle: 'БЕСПЛАТНЫЙ УРОК',
            modalSubtitle:
                'Заполните форму и выберите удобный способ связи.',
            branch: 'Филиал',
            contactHow: 'Как с вами связаться?',
            yourName: 'Ваше имя',
            phoneNick: 'Номер телефона / никнейм',
            direction: 'Направление',
            callback: 'Обратный звонок',

            branches: [
                'г. Долгопрудный, ул. Новый бульвар, д. 22',
                'г. Москва, Флотская ул., 7, корп. 1'
            ],

            methods: [
                'Обратный звонок',
                'Telegram',
                'Max'
            ],

            directionOptions: [
                'Вокал',
                'Гитара (Электро/Акустика)',
                'Фортепиано',
                'Барабаны'
            ]
        },

        en: {
            nav: [
                'ABOUT',
                'DIRECTIONS',
                'CERTIFICATES',
                'REVIEWS',
                'CONTACTS'
            ],

            heroTop: 'MUSIC / PEOPLE / HOME',
            heroSubtitle: 'Music school in Moscow and Dolgoprudny',
            heroButton: 'Book a lesson',
            freeLesson: '• FIRST LESSON FREE •',
            location: 'MOSCOW / DOLGOPRUDNY',
            scroll: 'SCROLL ↓',

            aboutLabel: '01 / ABOUT',
            aboutTitle: 'MUSIC<br><span>- feels like home.</span>',
            aboutP1:
                '<strong>KODI</strong> means “HOME” in Finnish. We created a space where everyone feels comfortable making mistakes and learning brings joy and fast results.',
            aboutP2:
                'The studio is led by Vasilii Rybin, a musician and director. Music entered his life at age three — it all started with drums, and this sincere love for the instrument became the foundation of his approach.',
            aboutP3:
                'At KODI, we help discover taste and style: we do not teach “what is right”, we teach “what is yours”.',
            aboutP4: 'Welcome home, to KODI!',
            founderRole: 'Founder &amp; Head of KODI',

            directionsLabel: '02 / DIRECTIONS',
            teachers: 'Teachers',
            back: 'Back',
            teachersHeading: 'TEACHERS',
            book: 'Book now',

            cards: [
                {
                    title: 'Vocal',
                    description:
                        'Develops emotional expression and stage presence.',
                    teacher: 'Ilya Michurin',
                    experience: 'Vocal teacher / Stage experience'
                },
                {
                    title: 'Guitar (Electric/Acoustic)',
                    description:
                        'Develops fine motor skills and understanding of harmony.',
                    teacher: 'Guitar teacher',
                    experience: 'Concert musician'
                },
                {
                    title: 'Piano',
                    description:
                        'Improves musical hearing and coordination of both hands.',
                    teacher: 'Piano teacher',
                    experience: 'Competition laureate'
                },
                {
                    title: 'Drums',
                    description:
                        'Develops rhythm and movement coordination.',
                    teacher: 'Konstantin',
                    experience: 'Drums teacher / Session drummer'
                }
            ],

            certificatesLabel: '03 / CERTIFICATES',
            certLessons: ['4 lessons', '8 lessons'],
            cert1: 'DOLGOPRUDNY',
            cert2: 'MOSCOW (FLOTSKAYA)',
            certTitle: 'GIFT<br>CERTIFICATE',

            reviewsLabel: '04 / REVIEWS',
            reviewsTitle: 'STUDENT REVIEWS',

            reviews: [
                '“A great music school with excellent teaching! The teachers are attentive and professional, and the lessons are interesting and inspiring. The results come quickly.”',
                '“A great school with a modern interior, creative atmosphere and modern equipment. I take vocal lessons with Ilya Michurin and really like his approach.”',
                '“I am very happy with the lessons at KODI. The drum teacher Konstantin is professional and creates a warm, supportive atmosphere. I highly recommend this school!”'
            ],

            posterBy: 'by Vasilii Rybin',

            contactsLabel: '05 / CONTACTS',
            namePlaceholder: 'Your name',
            methodLabel: 'Preferred contact method',
            consentPrefix: 'I have read and agree to',
            privacy: 'Privacy Policy',
            send: 'Send request',

            modalTitle: 'FREE LESSON',
            modalSubtitle:
                'Fill in the form and choose a convenient way to contact you.',
            branch: 'Branch',
            contactHow: 'How can we contact you?',
            yourName: 'Your name',
            phoneNick: 'Phone number / username',
            direction: 'Direction',
            callback: 'Phone call',

            branches: [
                'Dolgoprudny, Novy Boulevard, 22',
                'Moscow, Flotskaya St., 7, bldg. 1'
            ],

            methods: [
                'Phone call',
                'Telegram',
                'Max'
            ],

            directionOptions: [
                'Vocal',
                'Guitar (Electric/Acoustic)',
                'Piano',
                'Drums'
            ]
        }
    };


    /*
     * Обновляет текст option, но сохраняет исходные value.
     * Это устраняет конфликт между локализацией и
     * data-direction у кнопок карточек.
     */
    function updateSelectOptions(select, labels) {
        if (!select || !labels) return;

        Array.from(select.options).forEach((option, index) => {
            if (labels[index]) {
                option.textContent = labels[index];
            }
        });
    }

    function applyLanguage(language) {
        const t = translations[language];

        if (!t) return;

        currentLanguage = language;
        document.documentElement.lang = language;

        if (languageSwitch) {
            languageSwitch.textContent = language === 'ru' ? 'EN' : 'RU';
        }

        document.querySelectorAll('.nav a').forEach((element, index) => {
            if (t.nav[index]) {
                element.textContent = t.nav[index];
            }
        });

        setText('.hero-top', t.heroTop);
        setText('.hero-subtitle', t.heroSubtitle);
        setText('.hero-booking-button', t.heroButton);
        setText('.btn-round-text textPath', t.freeLesson);
        setText('.hero-bottom span:nth-child(1)', t.location);
        setText('.hero-bottom span:nth-child(2)', t.scroll);

        const sectionLabels = document.querySelectorAll('.section-label');

        if (sectionLabels[0]) {
            sectionLabels[0].textContent = t.aboutLabel;
        }

        if (sectionLabels[1]) {
            sectionLabels[1].textContent = t.directionsLabel;
        }

        if (sectionLabels[2]) {
            sectionLabels[2].textContent = t.certificatesLabel;
        }

        if (sectionLabels[3]) {
            sectionLabels[3].textContent = t.reviewsLabel;
        }

        if (sectionLabels[4]) {
            sectionLabels[4].textContent = t.contactsLabel;
        }

        setText('.about-info h2', t.aboutTitle, true);
        setText('.about-text p:nth-child(1)', t.aboutP1, true);
        setText('.about-text p:nth-child(2)', t.aboutP2);
        setText('.about-text p:nth-child(3)', t.aboutP3);
        setText('.about-text p:nth-child(4)', t.aboutP4);
        setText('.founder-role', t.founderRole, true);

        document.querySelectorAll('.flip-container').forEach(
            (card, index) => {
                const cardTranslation = t.cards[index];

                if (!cardTranslation) return;

                const frontTeacherLabel = card.querySelector(
                    '.card-front .teachers-btn-label'
                );

                const backTeacherLabel = card.querySelector(
                    '.card-back .teachers-btn-label'
                );

                const backHeading = card.querySelector(
                    '.card-back .course-number'
                );

                const title = card.querySelector(
                    '.card-front .course-title'
                );

                const description = card.querySelector(
                    '.card-front .course-desc'
                );

                const teacherName = card.querySelector(
                    '.card-back .teacher-info h4'
                );

                const teacherExperience = card.querySelector(
                    '.card-back .teacher-info p'
                );

                if (frontTeacherLabel) {
                    frontTeacherLabel.textContent = t.teachers;
                }

                if (backTeacherLabel) {
                    backTeacherLabel.textContent = t.back;
                }

                if (backHeading) {
                    backHeading.textContent = t.teachersHeading;
                }

                if (title) {
                    title.textContent = cardTranslation.title;
                }

                if (description) {
                    description.textContent =
                        cardTranslation.description;
                }

                if (teacherName) {
                    teacherName.textContent = cardTranslation.teacher;
                }

                if (teacherExperience) {
                    teacherExperience.textContent =
                        cardTranslation.experience;
                }
            }
        );

        setText('.course-submit-btn', t.book);

        const certificateHeaders = document.querySelectorAll(
            '.cert-header-title'
        );

        if (certificateHeaders[0]) {
            certificateHeaders[0].textContent = t.cert1;
        }

        if (certificateHeaders[1]) {
            certificateHeaders[1].textContent = t.cert2;
        }

        setText('.cert-main-title', t.certTitle, true);

        document.querySelectorAll('.cert-price-item > span').forEach(
            (element, index) => {
                /*
                 * В каждой карточке повторяются 4 и 8 занятий,
                 * поэтому используется остаток от деления.
                 */
                const lessonIndex = index % t.certLessons.length;

                element.textContent = t.certLessons[lessonIndex];
            }
        );

        const reviewsTitle = document.getElementById('reviewsTitle');

        if (reviewsTitle) {
            reviewsTitle.textContent = t.reviewsTitle;
        }

        document.querySelectorAll('.review-text').forEach(
            (element, index) => {
                if (t.reviews[index]) {
                    element.textContent = t.reviews[index];
                }
            }
        );

        setText('.poster-by', t.posterBy);

        const consentPrefix = document.querySelector('.consent-prefix');

        if (consentPrefix) {
            consentPrefix.textContent = t.consentPrefix;
        }

        const privacyLink = document.querySelector(
            '.open-privacy-modal'
        );

        if (privacyLink) {
            privacyLink.textContent = t.privacy;
        }

        const footerLabel = document.querySelector(
            '.field-label-small'
        );

        if (footerLabel) {
            footerLabel.textContent = t.methodLabel;
        }

        const footerName = document.getElementById('footerName');

        if (footerName) {
            footerName.placeholder = t.namePlaceholder;
        }

        const footerSubmit = document.getElementById(
            'footerSubmitBtn'
        );

        if (footerSubmit) {
            footerSubmit.textContent = t.send;
        }

        const modalTitle = document.querySelector(
            '#modalOverlay .modal-title'
        );

        const modalSubtitle = document.querySelector(
            '#modalOverlay .modal-subtitle'
        );

        if (modalTitle) {
            modalTitle.textContent = t.modalTitle;
        }

        if (modalSubtitle) {
            modalSubtitle.textContent = t.modalSubtitle;
        }

        const modalLabels = document.querySelectorAll(
            '#bookingForm .form-label'
        );

        const formLabelTexts = [
            t.branch,
            t.contactHow,
            t.yourName,
            t.phoneNick,
            t.direction
        ];

        modalLabels.forEach((label, index) => {
            if (formLabelTexts[index]) {
                label.textContent = formLabelTexts[index];
            }
        });

        const modalSubmit = document.getElementById('submitBtn');

        if (modalSubmit) {
            modalSubmit.textContent = t.send;
        }

        const userName = document.getElementById('userNameInput');

        if (userName) {
            userName.placeholder =
                language === 'ru' ? 'Иван' : 'John';
        }

        const userContact = document.getElementById(
            'userContactInput'
        );

        if (userContact) {
            userContact.placeholder =
                language === 'ru'
                    ? '+7 (999) 000-00-00 или @username'
                    : '+7 (999) 000-00-00 or @username';
        }

        updateSelectOptions(
            document.getElementById('branchSelect'),
            t.branches
        );

        updateSelectOptions(
            document.getElementById('contactMethodSelect'),
            t.methods
        );

        updateSelectOptions(
            document.getElementById('footerMethod'),
            [
                'Telegram',
                'WhatsApp',
                t.callback
            ]
        );

        updateSelectOptions(directionSelect, t.directionOptions);

        const addresses = document.querySelectorAll(
            '.contact-address'
        );

        if (addresses[0]) {
            addresses[0].textContent =
                language === 'ru'
                    ? 'г. Москва, Флотская ул., 7, корп. 1'
                    : 'Moscow, Flotskaya St., 7, bldg. 1';
        }

        if (addresses[1]) {
            addresses[1].textContent =
                language === 'ru'
                    ? 'г. Долгопрудный, ул. Новый бульвар, д. 22'
                    : 'Dolgoprudny, Novy Boulevard, 22';
        }

        const legalElements = document.querySelectorAll(
            '.contacts-legal span'
        );

        const legalTexts =
            language === 'ru'
                ? [
                    'ИП Рыбин Василий Викторович',
                    'ИНН: 504712859516',
                    'ОГРНИП: 325508100451723',
                    'Юр. адрес: г. Долгопрудный, ул. Новый бульвар, д. 22, этаж 1, кв. 1'
                ]
                : [
                    'IE Vasilii Rybin',
                    'TIN: 504712859516',
                    'PSRNIP: 325508100451723',
                    'Legal address: Dolgoprudny, Novy Boulevard, 22, floor 1, apt. 1'
                ];

        legalElements.forEach((element, index) => {
            if (legalTexts[index]) {
                element.textContent = legalTexts[index];
            }
        });

        if (mobileMenuButton) {
            const isOpen =
                mainNav?.classList.contains('mobile-open');

            mobileMenuButton.setAttribute(
                'aria-label',
                language === 'ru'
                    ? isOpen
                        ? 'Закрыть меню'
                        : 'Открыть меню'
                    : isOpen
                        ? 'Close menu'
                        : 'Open menu'
            );
        }
    }

    languageSwitch?.addEventListener('click', () => {
        applyLanguage(
            currentLanguage === 'ru' ? 'en' : 'ru'
        );
    });

    applyLanguage('ru');


    /*
     * =========================================================
     * ФОРМЫ И ОТПРАВКА В TELEGRAM
     * =========================================================
     */

    const TELEGRAM_BOT_TOKEN = '8860439275:AAFZP25yCAgSgJqacUja4pfs_vKTzdR5atU'; 
    const TELEGRAM_CHAT_ID = '1314400594';

    async function sendToTelegram(messageText) {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: messageText,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка отправки сообщения');
        }
        return await response.json();
    }

    // 1. Форма в модальном окне
    const bookingForm = document.getElementById('bookingForm');

    bookingForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = true;

        const branch = document.getElementById('branchSelect')?.value || '-';
        const contactMethod = document.getElementById('contactMethodSelect')?.value || '-';
        const name = document.getElementById('userNameInput')?.value || '-';
        const contact = document.getElementById('userContactInput')?.value || '-';
        const direction = document.getElementById('directionSelect')?.value || '-';

        const text = `<b>🔥 Заявка на бесплатный урок!</b>\n\n` +
                     `<b>Филиал:</b> ${branch}\n` +
                     `<b>Направление:</b> ${direction}\n` +
                     `<b>Имя:</b> ${name}\n` +
                     `<b>Контакт:</b> ${contact}\n` +
                     `<b>Способ связи:</b> ${contactMethod}`;

        try {
            await sendToTelegram(text);
            alert('Заявка успешно отправлена!');
            closeBookingModal();
            bookingForm.reset();
        } catch (error) {
            console.error(error);
            alert('Не удалось отправить заявку. Попробуйте еще раз.');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });

    // 2. Форма в футере сайта
    const footerContactsForm = document.getElementById('footerContactsForm');

    footerContactsForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!footerContactsForm.checkValidity()) {
            footerContactsForm.reportValidity();
            return;
        }

        const submitBtn = document.getElementById('footerSubmitBtn');
        if (submitBtn) submitBtn.disabled = true;

        const name = document.getElementById('footerName')?.value || '-';
        const contact = document.getElementById('footerContact')?.value || '-';
        const method = document.getElementById('footerMethod')?.value || '-';

        const text = `<b>📩 Заявка из футера</b>\n\n` +
                     `<b>Имя:</b> ${name}\n` +
                     `<b>Контакт:</b> ${contact}\n` +
                     `<b>Способ связи:</b> ${method}`;

        try {
            await sendToTelegram(text);
            alert('Заявка успешно отправлена!');
            footerContactsForm.reset();
        } catch (error) {
            console.error(error);
            alert('Не удалось отправить заявку. Попробуйте еще раз.');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});