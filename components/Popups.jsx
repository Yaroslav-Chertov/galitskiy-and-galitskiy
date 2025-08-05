export default ({ children, complex, inner }) => {
    return (
        <>
            <div class="popup" id="contacts">
                <div class="popup__title">Контакты</div>
                <a href="#" class="popup__close js-popup-close">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 23.8182L24.3182 9.50007L25 10.1819L10.6819 24.5L10 23.8182Z" fill="white"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.3198 24.5L10.0017 10.1818L10.6835 9.5L25.0016 23.8181L24.3198 24.5Z" fill="white"></path>
                    </svg>
                </a>
                <div class="popup__content">
                    <div class="contacts">
                        <div class="contacts__email">
                            <a href="mailto:hello@galitskiy-galitskiy.ru" class="link--hover">
                                <span>hello@galitskiy-galitskiy.ru</span>
                            </a>
                        </div>
                        <div class="contacts__map-link">
                            <a href="https://t.me/galitskiy_galitskiy" target="_blank" class="link--hover-2">
                                <span>Мы в Telegram</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="popup" data-popup-class="yellow" id="spaces">
                <div class="popup__title">Пространства</div>
                <a href="#" class="popup__close js-popup-close">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 23.8182L24.3182 9.50007L25 10.1819L10.6819 24.5L10 23.8182Z" fill="white"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.3198 24.5L10.0017 10.1818L10.6835 9.5L25.0016 23.8181L24.3198 24.5Z" fill="white"></path>
                    </svg>
                </a>
                <div class="popup__content">
                    <div class="spaces">
                        <div class="spaces__title">скоро</div>
                    </div>
                </div>
            </div>

            <div class="popup" id="buy">
                <div class="popup__title">Где купить</div>
                <a href="#" class="popup__close js-popup-close">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 23.8182L24.3182 9.50007L25 10.1819L10.6819 24.5L10 23.8182Z" fill="white"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.3198 24.5L10.0017 10.1818L10.6835 9.5L25.0016 23.8181L24.3198 24.5Z" fill="white"></path>
                    </svg>
                </a>
                <div class="popup__content">
                    <div class="buy">
                        <div class="buy-item">
                            <div class="buy-item__title">Simple Wine</div>
                            <div class="buy-item__text">В винотеках и онлайн-магазине</div>
                            <div class="buy-item__link">
                                <a href="https://simplewine.ru/catalog/vino/filter/manufacturer-galitskiy_i_galitskiy/" target="_blank" class="link--hover-2">
                                    <span>перейти в магазин</span>
                                </a>
                            </div>
                        </div>
                        <div class="buy-notes">Мы осознанно не идем в ритейл. Создавая мало вина мы хотим, чтобы бóльшая его часть была продана через диалог. Нам важно, чтобы о проекте, о терруаре, о самом вине человеку смогли рассказать. Это могут сделать сомелье в ресторанах и кависты в винотеках.</div>
                    </div>
                </div>
            </div>
        </>
    )
}
