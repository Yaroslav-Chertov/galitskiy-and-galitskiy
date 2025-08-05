import Welcome from '#_/components/Welcome.jsx';

const Layout = ({ children, title, bodyClass }) => {
    return (
        <html lang="ru" data-season="summer" data-weather="sun">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="icon" href="https://galitskiy-galitskiy.ru/favicon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/favicon.png" />
                <meta property="og:image" content="/upload/social.png" />
                <link rel="stylesheet" href={'/assets/styles/styles.css?v=' + +new Date()} />
                <meta name="ahrefs-site-verification" content="f75600bb29d2520aa9a5617bf6657a667c981acab89913dc12c1fb242e9250b8" data-vue-router-controlled="" />
                <meta name="description" content="Премиальные вина краснодарского края от винодельни Галицкий и Галицкий. Насладитесь уникальными терруарными винами." data-vue-router-controlled="" />
                <meta property="og:description" content="Премиальные вина краснодарского края от винодельни Галицкий и Галицкий. Насладитесь уникальными терруарными винами." data-vue-router-controlled="" />
                <meta property="keywords" content="русское вино/российское вино/российские вина, премиальное русское/российское вино, терруарные вина, лучшее российское вино, достойное российское вино, вина краснодарского края, краснодарское вино, хорошее российское вино/хорошие русские вина, галицкий вино, галицкий и галицкий вино, вино галицкого, вино сергея галицкого, галицкий cosaque, галицкий казак, галицкий розе, вина россии, русское розе, российское розе, российское розовое вино, красное российское вино, красное краснодарское вино, белое российское вино, белое краснодарское вино, белое русское вино, российские винодельни, сорта винограда России, виноградники краснодарского края, винные дегустации в России, дегустации российского вина, российские вина с оригинальным дизайном" data-vue-router-controlled="" />
                <style __raw={`.custom-span::after { content: ""; position: absolute; bottom: -10px !important; } .menu-main.link--hover.custom-link, .menu-main.link--hover.custom-link:visited, .menu-main.link--hover.custom-link:hover, .menu-main.link--hover.custom-link:focus { text-decoration: none !important; color: #fff !important; outline: none !important; }`}></style>

                {/* <!-- Yandex.Metrika counter --> */}
                {/* INFO: чтобы записать в теге скрипт или стили, необходимо использовать __raw аттрибут */}
                <script type="text/javascript" __raw={`
                    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                        var z = null;m[i].l=1*new Date();
                        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                    ym(89633066, "init", {
                        defer:true,
                        clickmap:true,
                        trackLinks:true,
                        accurateTrackBounce:true,
                        webvisor:true
                    });
                `}>
                </script>
                <noscript><div><img src="https://mc.yandex.ru/watch/89633066" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
                {/* <!-- /Yandex.Metrika counter --> */}
                {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-235213084-1"></script>
                <script __raw={`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'UA-235213084-1');
                `}>
                </script>
            </head>

            {/* TODO:
            классы состояний step-0
            data-step= start navigation
        */}
            <body class={bodyClass} data-step="start" data-popup="">
                <Welcome />
                <script src={'/assets/js/app.js?v=' + +new Date()} type="module"></script>
            </body>
        </html>
    );
};

export default Layout;
