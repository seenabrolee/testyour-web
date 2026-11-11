// Smart Language Recommendation Banner for TESTYOUR
(function() {
    try {
        // 1. Crawler / Bot exemption (Prevent any AdSense / Search crawling issues)
        var isBot = /bot|google|crawl|spider|mediapartners|slurp|bing|yandex/i.test(navigator.userAgent);
        if (isBot) return;

        var path = window.location.pathname;
        var isEnPage = path.startsWith('/en/') || path === '/en';
        var userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        var isKoreanUser = userLang.startsWith('ko');

        // Case 1: On Korean page & user browser is non-Korean -> Suggest English
        if (!isEnPage && !isKoreanUser) {
            if (localStorage.getItem('dismiss_lang_banner_en') === 'true') return;

            var target = '/en/';
            if (path.startsWith('/nen')) target = '/en/nen/';
            else if (path.startsWith('/hxh')) target = '/en/hxh/';
            else if (path.startsWith('/mbti')) target = '/en/mbti/';
            else if (path.startsWith('/picker')) target = '/en/picker/';
            else if (path.startsWith('/column')) target = '/en/column/';
            else if (path.includes('privacy')) target = '/en/privacy.html';
            else if (path.includes('terms')) target = '/en/terms.html';
            else if (path.includes('about')) target = '/en/about.html';

            initBanner({
                text: "Looking for English version?",
                btnText: "Switch to English →",
                target: target,
                storageKey: "dismiss_lang_banner_en"
            });
        }
        // Case 2: On English page & user browser is Korean -> Suggest Korean
        else if (isEnPage && isKoreanUser) {
            if (localStorage.getItem('dismiss_lang_banner_kr') === 'true') return;

            var krTarget = path.replace(/^\/en/, '') || '/';
            initBanner({
                text: "한국어 페이지로 이동하시겠습니까?",
                btnText: "한국어로 전환 →",
                target: krTarget,
                storageKey: "dismiss_lang_banner_kr"
            });
        }

        function initBanner(cfg) {
            function render() {
                if (document.getElementById('smart-lang-banner')) return;

                // Add keyframes style
                if (!document.getElementById('lang-banner-style')) {
                    var st = document.createElement('style');
                    st.id = 'lang-banner-style';
                    st.textContent = '@keyframes slideDownLangBanner { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }' +
                        '#smart-lang-banner a:hover { background: #7c3aed !important; }';
                    document.head.appendChild(st);
                }

                var banner = document.createElement('div');
                banner.id = 'smart-lang-banner';
                banner.style.cssText = 
                    'position: sticky;' +
                    'top: 0;' +
                    'left: 0;' +
                    'right: 0;' +
                    'width: 100%;' +
                    'box-sizing: border-box;' +
                    'flex-shrink: 0;' +
                    'background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);' +
                    'color: #e2e8f0;' +
                    'border-bottom: 1px solid rgba(139, 92, 246, 0.4);' +
                    'box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5);' +
                    'padding: 10px 16px;' +
                    'display: flex;' +
                    'align-items: center;' +
                    'justify-content: center;' +
                    'gap: 12px;' +
                    'flex-wrap: wrap;' +
                    'font-size: 13.5px;' +
                    'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
                    'z-index: 999999;' +
                    'animation: slideDownLangBanner 0.3s ease-out;';

                banner.innerHTML = 
                    '<span style="display:inline-flex; align-items:center; gap:6px;">' +
                        '<span style="font-size:16px;">🌐</span>' +
                        '<span style="font-weight: 500;">' + cfg.text + '</span>' +
                    '</span>' +
                    '<a href="' + cfg.target + '" style="' +
                        'background: #8b5cf6;' +
                        'color: #ffffff;' +
                        'font-weight: 700;' +
                        'text-decoration: none;' +
                        'padding: 5px 12px;' +
                        'border-radius: 6px;' +
                        'font-size: 12.5px;' +
                        'transition: background 0.2s;' +
                        'box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);' +
                        'white-space: nowrap;' +
                    '">' + cfg.btnText + '</a>' +
                    '<button type="button" id="close-lang-banner-btn" style="' +
                        'background: transparent;' +
                        'border: none;' +
                        'color: #94a3b8;' +
                        'font-size: 18px;' +
                        'line-height: 1;' +
                        'cursor: pointer;' +
                        'padding: 4px 8px;' +
                        'margin-left: 4px;' +
                    '" aria-label="Close">✕</button>';

                var bodyStyle = window.getComputedStyle(document.body);
                if (bodyStyle && bodyStyle.display === 'flex') {
                    document.body.style.flexDirection = 'column';
                    document.body.style.alignItems = 'center';
                    document.body.style.justifyContent = 'flex-start';
                }

                document.body.prepend(banner);

                var closeBtn = document.getElementById('close-lang-banner-btn');
                if (closeBtn) {
                    closeBtn.onclick = function() {
                        localStorage.setItem(cfg.storageKey, 'true');
                        banner.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
                        banner.style.transform = 'translateY(-100%)';
                        banner.style.opacity = '0';
                        setTimeout(function() {
                            banner.remove();
                        }, 250);
                    };
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', render);
            } else {
                render();
            }
        }
    } catch (e) {
        // fail gracefully
    }
})();
