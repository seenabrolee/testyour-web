// Smart Language Recommendation Banner + Leorio Superfan Easter Egg for TESTYOUR
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
        if (!isEnPage && !isKoreanUser && localStorage.getItem('dismiss_lang_banner_en') !== 'true') {
            var target = '/en/';
            if (path.startsWith('/nen')) target = '/en/nen/';
            else if (path.startsWith('/hxh')) target = '/en/hxh/';
            else if (path.startsWith('/mbti')) target = '/en/mbti/';
            else if (path.startsWith('/picker')) target = '/en/picker/';
            else if (path.startsWith('/column/leorio-love')) target = '/en/column/leorio-love.html';
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
        else if (isEnPage && isKoreanUser && localStorage.getItem('dismiss_lang_banner_kr') !== 'true') {
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

        // ============================================================
        // 💼 Leorio Paradinight Site-Wide Easter Egg 🕶️
        // ============================================================
        if (typeof console !== 'undefined' && console.log) {
            console.log(
                '%c💼 [TESTYOUR] 참고로 이 사이트 주인장도 레오리오 팬입니다. %c(어디서든 leorio 치거나 푸터 💼 클릭)',
                'background:#eab308; color:#0f172a; font-weight:900; padding:4px 8px; border-radius:4px;',
                'color:#fde047; font-weight:600;'
            );
        }

        window.showLeorioEasterEgg = function() {
            var old = document.getElementById('leorio-easter-modal');
            if (old) old.remove();

            var overlay = document.createElement('div');
            overlay.id = 'leorio-easter-modal';
            overlay.style.cssText =
                'position:fixed; inset:0; background:rgba(0,0,0,0.78); backdrop-filter:blur(4px);' +
                'z-index:9999999; display:flex; align-items:center; justify-content:center; padding:20px;';

            var colUrl = isEnPage ? '/en/column/leorio-love.html' : '/column/leorio-love.html';
            var docUrl = isEnPage ? '/en/hxh/leorio.html' : '/hxh/leorio.html';

            overlay.innerHTML = isEnPage
                ? '<div style="background:#161a24; border:2px solid #eab308; border-radius:18px; max-width:410px; width:100%; padding:28px 24px; text-align:center; box-shadow:0 20px 50px rgba(234,179,8,0.22); position:relative; font-family:Inter, sans-serif;">' +
                    '<button type="button" id="leorio-egg-close" style="position:absolute; top:12px; right:14px; background:transparent; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">✕</button>' +
                    '<img src="/hxh/images/leorio.jpg" alt="Leorio Paradinight" style="width:88px; height:88px; border-radius:50%; object-fit:cover; border:3px solid #eab308; margin-bottom:12px;">' +
                    '<div style="display:inline-block; background:rgba(234,179,8,0.18); color:#fde047; border:1px solid #eab308; border-radius:20px; padding:3px 12px; font-size:11.5px; font-weight:800; margin-bottom:10px;">💼 EASTER EGG</div>' +
                    '<h3 style="margin:0 0 10px 0; color:#f8fafc; font-size:20px; font-weight:900;">Owner\'s Pick: Leorio</h3>' +
                    '<p style="margin:0 0 16px 0; color:#cbd5e1; font-size:14px; line-height:1.65;">A quiet note from the site creator.<br>Among everyone in <em>Hunter x Hunter</em>, <strong>Leorio Paradinight</strong> has always been my favorite character.</p>' +
                    '<div style="display:flex; flex-direction:column; gap:8px;">' +
                        '<a href="' + colUrl + '" style="background:#eab308; color:#0f172a; text-decoration:none; padding:11px 16px; border-radius:10px; font-weight:800; font-size:14px;">📖 Essay: Why Leorio Stands Out &rarr;</a>' +
                        '<a href="' + docUrl + '" style="background:#1e293b; color:#e2e8f0; border:1px solid #334155; text-decoration:none; padding:10px 16px; border-radius:10px; font-weight:700; font-size:13px;">🕶️ Leorio Character Dossier</a>' +
                    '</div>' +
                  '</div>'
                : '<div style="background:#161a24; border:2px solid #eab308; border-radius:18px; max-width:410px; width:100%; padding:28px 24px; text-align:center; box-shadow:0 20px 50px rgba(234,179,8,0.22); position:relative; font-family:\'Noto Sans KR\', sans-serif; word-break:keep-all;">' +
                    '<button type="button" id="leorio-egg-close" style="position:absolute; top:12px; right:14px; background:transparent; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">✕</button>' +
                    '<img src="/hxh/images/leorio.jpg" alt="레오리오" style="width:88px; height:88px; border-radius:50%; object-fit:cover; border:3px solid #eab308; margin-bottom:12px;">' +
                    '<div style="display:inline-block; background:rgba(234,179,8,0.18); color:#fde047; border:1px solid #eab308; border-radius:20px; padding:3px 12px; font-size:11.5px; font-weight:800; margin-bottom:10px;">💼 이스터에그</div>' +
                    '<h3 style="margin:0 0 10px 0; color:#f8fafc; font-size:20px; font-weight:900;">주인장은 레오리오 팬입니다</h3>' +
                    '<p style="margin:0 0 16px 0; color:#cbd5e1; font-size:14px; line-height:1.7;">그냥 사소한 얘기 하나.<br>이 사이트 만든 사람도 헌터×헌터에서는 <strong>레오리오</strong>를 제일 좋아합니다.</p>' +
                    '<div style="display:flex; flex-direction:column; gap:8px;">' +
                        '<a href="' + colUrl + '" style="background:#eab308; color:#0f172a; text-decoration:none; padding:11px 16px; border-radius:10px; font-weight:800; font-size:14px;">📖 레오리오 관련 칼럼 보러가기 &rarr;</a>' +
                        '<a href="' + docUrl + '" style="background:#1e293b; color:#e2e8f0; border:1px solid #334155; text-decoration:none; padding:10px 16px; border-radius:10px; font-weight:700; font-size:13px;">🕶️ 레오리오 도감 페이지</a>' +
                    '</div>' +
                  '</div>';

            overlay.addEventListener('click', function(e) {
                if (e.target === overlay || e.target.id === 'leorio-egg-close') {
                    overlay.remove();
                }
            });
            document.body.appendChild(overlay);
        };

        // Typing "leorio" anywhere outside form inputs triggers the Easter egg
        var keyBuf = '';
        document.addEventListener('keydown', function(e) {
            if (!e.key || e.key.length !== 1) return;
            var tag = (document.activeElement && document.activeElement.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            keyBuf = (keyBuf + e.key.toLowerCase()).slice(-6);
            if (keyBuf === 'leorio') {
                keyBuf = '';
                window.showLeorioEasterEgg();
            }
        });

        // Append subtle footer briefcase trigger across pages (not admin.html)
        function attachFooterEasterEgg() {
            if (path.indexOf('admin.html') !== -1 || document.getElementById('leorio-footer-egg')) return;
            var targetFooter = document.querySelector('.footer-links, .footer-nav, footer.footer, div.footer');
            if (!targetFooter) {
                var privLink = document.querySelector('a[href*="privacy.html"]');
                if (privLink && privLink.parentElement) targetFooter = privLink.parentElement;
            }
            if (!targetFooter) return;

            var btn = document.createElement('button');
            btn.id = 'leorio-footer-egg';
            btn.type = 'button';
            btn.textContent = isEnPage ? ' · 💼 Leorio' : ' · 💼 레오리오';
            btn.title = isEnPage ? 'Owner note: Leorio fan' : '이스터에그: 주인장은 레오리오 팬';
            btn.style.cssText =
                'background:transparent; border:none; color:#94a3b8; opacity:0.62; font-size:11.5px;' +
                'cursor:pointer; padding:2px 4px; transition:opacity 0.2s, color 0.2s; vertical-align:baseline;';
            btn.onmouseenter = function() { btn.style.opacity = '1'; btn.style.color = '#facc15'; };
            btn.onmouseleave = function() { btn.style.opacity = '0.62'; btn.style.color = '#94a3b8'; };
            btn.onclick = window.showLeorioEasterEgg;

            targetFooter.appendChild(btn);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachFooterEasterEgg);
        } else {
            attachFooterEasterEgg();
        }
    } catch (e) {
        // fail gracefully
    }
})();
