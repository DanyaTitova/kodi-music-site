document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       YANDEX MAP
    ===================================================== */

    if (typeof ymaps !== "undefined") {

        ymaps.ready(function () {

            const mapElement = document.getElementById("yandexMap");

            if (!mapElement) return;

            const map = new ymaps.Map("yandexMap", {
                center: [55.9495, 37.5143],
                zoom: 13,
                controls: [
                    "zoomControl"
                ]
            });

            /*
             * Долгопрудный
             */
            const dolgoprudny = new ymaps.Placemark(
                [55.9495, 37.5143],
                {
                    balloonContent:
                        "<strong>KODI MUSIC CLASS</strong><br>Долгопрудный, Новый бульвар, 22"
                },
                {
                    preset: "islands#orangeIcon"
                }
            );

            /*
             * Москва, Флотская
             */
            const moscow = new ymaps.Placemark(
                [55.8517, 37.4925],
                {
                    balloonContent:
                        "<strong>KODI MUSIC CLASS</strong><br>Москва, Флотская ул., 7, корп. 1"
                },
                {
                    preset: "islands#orangeIcon"
                }
            );

            map.geoObjects.add(dolgoprudny);
            map.geoObjects.add(moscow);

        });

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mainNav =
        document.getElementById("mainNav");


    if (mobileMenuButton && mainNav) {

        mobileMenuButton.addEventListener("click", function () {

            const isOpen =
                mainNav.classList.toggle("active");

            mobileMenuButton.classList.toggle(
                "active",
                isOpen
            );

            mobileMenuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        });


        /*
         * Закрываем меню после нажатия
         * на пункт навигации
         */

        const navLinks =
            mainNav.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("active");

                mobileMenuButton.classList.remove("active");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "menu-open"
                );

            });

        });

    }


    /* =====================================================
       FLIP CARDS
    ===================================================== */

    const flipContainers =
        document.querySelectorAll(".flip-container");


    flipContainers.forEach(function (container) {

        const card =
            container.querySelector(".flip-card");

        if (!card) return;


        /*
         * Кнопки "Педагоги" и "Назад"
         */

        const flipButtons =
            container.querySelectorAll(".flip-toggle");


        flipButtons.forEach(function (button) {

            button.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                card.classList.toggle("flipped");

            });

        });


        /*
         * На мобильном можно нажимать
         * на карточку целиком.
         */

        container.addEventListener(
            "click",
            function (event) {

                if (window.innerWidth > 768) {
                    return;
                }

                /*
                 * Если нажали на кнопку записи,
                 * карточку не переворачиваем.
                 */

                if (
                    event.target.closest(
                        ".open-modal-btn"
                    )
                ) {
                    return;
                }


                /*
                 * Если нажали на стрелку,
                 * обработчик выше уже сработал.
                 */

                if (
                    event.target.closest(
                        ".flip-toggle"
                    )
                ) {
                    return;
                }


                card.classList.toggle("flipped");

            }
        );

    });


    /* =====================================================
       BOOKING MODAL
    ===================================================== */

    const modalOverlay =
        document.getElementById("modalOverlay");

    const modalClose =
        document.getElementById("modalClose");

    const openModalButtons =
        document.querySelectorAll(".open-modal-btn");


    function openBookingModal(direction) {

        if (!modalOverlay) return;

        modalOverlay.classList.add("active");

        document.body.classList.add("modal-open");

        /*
         * Если нажали "Записаться" внутри
         * определённого направления —
         * автоматически выбираем его.
         */

        if (direction) {

            const directionSelect =
                document.getElementById("directionSelect");

            if (directionSelect) {

                const options =
                    directionSelect.options;

                for (let i = 0; i < options.length; i++) {

                    if (
                        options[i].value === direction ||
                        options[i].textContent === direction
                    ) {

                        directionSelect.selectedIndex = i;

                        break;
                    }

                }

            }

        }

    }


    function closeBookingModal() {

        if (!modalOverlay) return;

        modalOverlay.classList.remove("active");

        document.body.classList.remove("modal-open");

    }


    openModalButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const direction =
                button.getAttribute("data-direction");

            openBookingModal(direction);

        });

    });


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeBookingModal
        );

    }


    /*
     * Закрытие по клику на затемнение
     */

    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            function (event) {

                if (event.target === modalOverlay) {

                    closeBookingModal();

                }

            }
        );

    }


    /* =====================================================
       ESC — ЗАКРЫТИЕ МОДАЛОК
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeBookingModal();

            }

        }
    );


    /* =====================================================
       TELEGRAM
    ===================================================== */

    /*
     * ВСТАВЬ НОВЫЙ ТОКЕН СЮДА:
     *
     * const BOT_TOKEN = "123456:ABC...";
     *
     * Старый токен, который был раньше в коде,
     * лучше обязательно перевыпустить.
     */

    const BOT_TOKEN =
        "YOUR_BOT_TOKEN";

    const CHAT_ID =
        "1314400594";


    async function sendToTelegram(message) {

        if (
            !BOT_TOKEN ||
            BOT_TOKEN === "YOUR_BOT_TOKEN"
        ) {

            console.error(
                "Telegram BOT_TOKEN не указан."
            );

            return false;
        }


        const url =
            "https://api.telegram.org/bot" +
            BOT_TOKEN +
            "/sendMessage";


        try {

            const response =
                await fetch(url, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        chat_id: CHAT_ID,

                        text: message

                    })

                });


            const result =
                await response.json();


            if (!result.ok) {

                console.error(
                    "Telegram error:",
                    result
                );

                return false;
            }


            return true;

        } catch (error) {

            console.error(
                "Ошибка отправки в Telegram:",
                error
            );

            return false;
        }

    }


    /* =====================================================
       BOOKING FORM
    ===================================================== */

    const bookingForm =
        document.getElementById("bookingForm");


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const branch =
                    document.getElementById(
                        "branchSelect"
                    )?.value || "";


                const contactMethod =
                    document.getElementById(
                        "contactMethodSelect"
                    )?.value || "";


                const name =
                    document.getElementById(
                        "userNameInput"
                    )?.value || "";


                const contact =
                    document.getElementById(
                        "userContactInput"
                    )?.value || "";


                const direction =
                    document.getElementById(
                        "directionSelect"
                    )?.value || "";


                const message =
`🎵 НОВАЯ ЗАЯВКА KODI MUSIC CLASS

Имя: ${name}

Контакт: ${contact}

Способ связи: ${contactMethod}

Направление: ${direction}

Филиал: ${branch}`;


                const submitButton =
                    document.getElementById(
                        "submitBtn"
                    );


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Отправка...";

                }


                const success =
                    await sendToTelegram(message);


                if (success) {

                    alert(
                        "Спасибо! Заявка отправлена. Мы свяжемся с вами."
                    );


                    bookingForm.reset();

                    closeBookingModal();


                } else {

                    alert(
                        "Не удалось отправить заявку. Попробуйте ещё раз."
                    );

                }


                if (submitButton) {

                    submitButton.disabled = false;

                    /*
                     * После отправки возвращаем
                     * обычный текст кнопки.
                     *
                     * Язык кнопки устанавливается
                     * встроенным скриптом HTML.
                     */

                    const language =
                        document.documentElement.lang;

                    submitButton.textContent =
                        language === "en"
                            ? "Send request"
                            : "Отправить заявку";

                }

            }
        );

    }


    /* =====================================================
       FOOTER CONTACT FORM
    ===================================================== */

    const footerForm =
        document.getElementById(
            "footerContactsForm"
        );


    if (footerForm) {

        footerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "footerName"
                    )?.value || "";


                const phone =
                    document.getElementById(
                        "footerPhone"
                    )?.value || "";


                const method =
                    document.getElementById(
                        "footerMethod"
                    )?.value || "";


                const message =
`📩 НОВАЯ ЗАЯВКА С САЙТА KODI

Имя: ${name}

Телефон: ${phone}

Удобный способ связи: ${method}`;


                const submitButton =
                    document.getElementById(
                        "footerSubmitBtn"
                    );


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Отправка...";

                }


                const success =
                    await sendToTelegram(message);


                if (success) {

                    alert(
                        "Спасибо! Заявка отправлена. Мы свяжемся с вами."
                    );


                    footerForm.reset();


                } else {

                    alert(
                        "Не удалось отправить заявку. Попробуйте ещё раз."
                    );

                }


                if (submitButton) {

                    submitButton.disabled = false;

                    const language =
                        document.documentElement.lang;

                    submitButton.textContent =
                        language === "en"
                            ? "Send request"
                            : "Отправить заявку";

                }

            }
        );

    }


    /* =====================================================
       PHONE INPUT
    ===================================================== */

    const phoneInput =
        document.getElementById("footerPhone");


    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            function () {

                let value =
                    phoneInput.value.replace(
                        /\D/g,
                        ""
                    );


                if (value.startsWith("8")) {

                    value =
                        "7" + value.substring(1);

                }


                if (!value.startsWith("7")) {

                    value =
                        "7" + value;

                }


                value =
                    value.substring(0, 11);


                let formatted =
                    "+7";


                if (value.length > 1) {

                    formatted +=
                        " (" +
                        value.substring(1, 4);

                }


                if (value.length >= 4) {

                    formatted += ")";

                }


                if (value.length > 4) {

                    formatted +=
                        " " +
                        value.substring(4, 7);

                }


                if (value.length > 7) {

                    formatted +=
                        "-" +
                        value.substring(7, 9);

                }


                if (value.length > 9) {

                    formatted +=
                        "-" +
                        value.substring(9, 11);

                }


                phoneInput.value =
                    formatted;

            }
        );

    }


    /* =====================================================
       PREVENT BODY SCROLL WHEN MODAL OPEN
    ===================================================== */

    if (modalOverlay) {

        const observer =
            new MutationObserver(function () {

                if (
                    modalOverlay.classList.contains(
                        "active"
                    )
                ) {

                    document.body.style.overflow =
                        "hidden";

                } else {

                    document.body.style.overflow =
                        "";

                }

            });


        observer.observe(
            modalOverlay,
            {
                attributes: true,
                attributeFilter: ["class"]
            }
        );

    }

});