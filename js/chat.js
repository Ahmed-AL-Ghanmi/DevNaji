/**
 * DevNaji Live Chat Widget — v2.0 Elite
 * ═══════════════════════════════════════════════════════════
 * ✅ Smart AI-like conversation flow
 * ✅ Step progress indicator
 * ✅ Auto-open with delay
 * ✅ Multilingual AR/EN/TR
 * ✅ WhatsApp + Web3Forms routing
 * ✅ Premium UX with micro-animations
 * ═══════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ── Config ─────────────────────────────────────────────────
    const WA_NUMBER     = '905355255446';
    const EMAIL         = 'hello@devnaji.com';
    const WEB3FORMS_KEY = '477c15ca-fe8b-4efe-a5ee-f531c0171185';
    const TYPING_DELAY  = 900;   // ms before bot "types" reply
    const AUTO_OPEN_DELAY = 8000; // ms before auto-showing badge prompt

    // ── State ───────────────────────────────────────────────────
    let chatOpen       = false;
    let chatTopic      = '';
    let userName       = '';
    let userContact    = '';
    let userMessage    = '';
    let chatStep       = 0;   // 0=Name, 1=Contact, 2=Message, 3=Done
    let badgeDismissed = false;
    let autoOpenShown  = false;

    // ── DOM Refs ────────────────────────────────────────────────
    const widget       = document.getElementById('chat-widget');
    const toggleBtn    = document.getElementById('chatToggleBtn');
    const panel        = document.getElementById('chatPanel');
    const closeBtn     = document.getElementById('chatCloseBtn');
    const badge        = document.getElementById('chatBadge');

    const welcome      = document.getElementById('chatWelcome');
    const formState    = document.getElementById('chatFormState');
    const channelState = document.getElementById('chatChannelState');

    const chatMessages        = document.getElementById('chatMessages');
    const chatChannelMessages = document.getElementById('chatChannelMessages');

    const nameInput    = document.getElementById('chatNameInput');
    const contactInput = document.getElementById('chatContactInput');
    const msgInput     = document.getElementById('chatMessageInput');
    const sendNameBtn  = document.getElementById('chatSendNameBtn');

    const sendWABtn    = document.getElementById('chatSendWA');
    const sendEmailBtn = document.getElementById('chatSendEmail');

    const quickBtns = {
        about:   document.getElementById('chatQuickAbout'),
        project: document.getElementById('chatQuickProject'),
        price:   document.getElementById('chatQuickPrice'),
        other:   document.getElementById('chatQuickOther'),
    };

    // ── Guard: abort if chat widget not present ─────────────────
    if (!widget || !panel || !toggleBtn) return;

    // ── Translation helper ──────────────────────────────────────
    function t(key) {
        const lang = localStorage.getItem('selectedLang') || 'ar';
        return (window.translations && window.translations[lang] && window.translations[lang][key]) || '';
    }

    // ── Update all data-i18n inside chat panel ──────────────────
    function refreshChatTranslations() {
        if (!panel) return;
        panel.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (val) el.innerHTML = val;
        });
        panel.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const val = t(key);
            if (val) el.placeholder = val;
        });
        if (chatStep > 0 && sendNameBtn) {
            sendNameBtn.textContent = chatStep === 2
                ? (t('chat_send') || 'إرسال')
                : (t('chat_next') || 'التالي');
        }
    }

    // ── Render step progress bar ────────────────────────────────
    function updateStepProgress(step) {
        const bar = document.getElementById('chatStepBar');
        const steps = document.querySelectorAll('.chat-step-dot');
        if (!bar || !steps.length) return;

        const pct = Math.min(((step) / 3) * 100, 100);
        bar.style.width = pct + '%';

        steps.forEach((dot, i) => {
            dot.classList.toggle('done', i < step);
            dot.classList.toggle('active', i === step);
        });
    }

    // ── Open / Close chat ───────────────────────────────────────
    function openChat() {
        chatOpen = true;
        panel.classList.add('open');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.classList.add('active');
        }
        if (!badgeDismissed && badge) {
            badge.style.transform = 'scale(0)';
            badgeDismissed = true;
        }
        refreshChatTranslations();
        // Show auto-prompt tooltip if not yet shown
        hideAutoPrompt();
    }

    function closeChat() {
        chatOpen = false;
        panel.classList.remove('open');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.classList.remove('active');
        }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', () => chatOpen ? closeChat() : openChat());
    if (closeBtn)  closeBtn.addEventListener('click', closeChat);

    // Expose globally for mobile bottom nav
    window.toggleChat       = (e) => { if (e && e.stopPropagation) e.stopPropagation(); chatOpen ? closeChat() : openChat(); };
    window.openChatWidget   = openChat;
    window.closeChatWidget  = closeChat;
    window.refreshChatLang  = refreshChatTranslations;

    // Close on outside click
    document.addEventListener('click', (e) => {
        const mobNavBtn = document.getElementById('mobChatNavBtn');
        if (chatOpen && widget && !widget.contains(e.target) && !(mobNavBtn && mobNavBtn.contains(e.target))) {
            closeChat();
        }
    });

    // ── Auto-open prompt (tooltip bubble) ──────────────────────
    function showAutoPrompt() {
        if (autoOpenShown || chatOpen || badgeDismissed) return;
        autoOpenShown = true;

        // Show badge
        if (badge) badge.style.transform = 'scale(1)';

        // Show tooltip
        const tip = document.createElement('div');
        tip.className = 'chat-auto-tip';
        tip.innerHTML = `<span>${t('chat_auto_msg') || '👋 مرحباً! كيف يمكنني مساعدتك؟'}</span><button class="chat-auto-close" aria-label="close">✕</button>`;
        if (widget) widget.appendChild(tip);

        setTimeout(() => tip.classList.add('visible'), 50);

        tip.querySelector('.chat-auto-close')?.addEventListener('click', (e) => {
            e.stopPropagation();
            tip.classList.remove('visible');
            setTimeout(() => tip.remove(), 400);
        });

        tip.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-auto-close')) return;
            tip.classList.remove('visible');
            setTimeout(() => tip.remove(), 400);
            openChat();
        });

        // Auto-hide tip after 8s
        setTimeout(() => {
            if (tip.parentNode) {
                tip.classList.remove('visible');
                setTimeout(() => { if (tip.parentNode) tip.remove(); }, 400);
            }
        }, 8000);
    }

    function hideAutoPrompt() {
        const tip = widget?.querySelector('.chat-auto-tip');
        if (tip) {
            tip.classList.remove('visible');
            setTimeout(() => { if (tip.parentNode) tip.remove(); }, 400);
        }
    }

    setTimeout(showAutoPrompt, AUTO_OPEN_DELAY);

    // ── Quick Action Buttons ────────────────────────────────────
    function startConversation(topic) {
        chatTopic = topic;
        chatStep  = 0;

        welcome.style.display  = 'none';
        formState.style.display = 'flex';

        // Show progress bar
        const progressEl = formState.querySelector('.chat-progress-wrap');
        if (progressEl) progressEl.style.display = 'flex';

        nameInput.style.display    = '';
        contactInput.style.display = 'none';
        msgInput.style.display     = 'none';

        if (sendNameBtn) {
            sendNameBtn.textContent = t('chat_next') || 'التالي';
            sendNameBtn.style.display = '';
        }

        chatMessages.innerHTML = '';
        updateStepProgress(0);

        // Add user topic bubble
        addUserMessage(chatMessages, topic);

        addBotMessage(chatMessages,
            t('chat_bot_greeting') || 'مرحباً! 👋 سعيد بتواصلك معي. ما اسمك الكريم؟', true);

        setTimeout(() => nameInput.focus(), TYPING_DELAY + 300);
    }

    function startAboutConversation() {
        chatTopic = 'about';
        welcome.style.display   = 'none';
        formState.style.display = 'flex';

        const progressEl = formState.querySelector('.chat-progress-wrap');
        if (progressEl) progressEl.style.display = 'none';

        nameInput.style.display    = 'none';
        contactInput.style.display = 'none';
        msgInput.style.display     = 'none';
        if (sendNameBtn) sendNameBtn.style.display = 'none';

        chatMessages.innerHTML = '';
        addUserMessage(chatMessages, t('chat_quick_about') || 'من أنا؟');

        setTimeout(() => {
            addBotMessage(chatMessages, t('chat_bot_about_1') || 'أنا أحمد الغانمي، مهندس برمجيات متخصص في بناء المنصات الرقمية المتكاملة، وتطبيقات الجوال، وتصميم الواجهات (UI/UX).', true);

            setTimeout(() => {
                addBotMessage(chatMessages, t('chat_bot_about_2') || 'أهدف لتحويل الأفكار إلى واقع رقمي ملموس يخدم طموحاتك. يمكنك التمرير لأسفل لمعرفة المزيد.', true);

                setTimeout(() => {
                    const linkWrap = document.createElement('div');
                    linkWrap.className = 'chat-about-actions';
                    linkWrap.innerHTML = `
                        <a href="#bento-master" class="chat-action-link" onclick="window.closeChatWidget()">
                            <i class="fa-solid fa-user-tie"></i>
                            <span>${t('nav_about') || 'اقرأ المزيد عني'}</span>
                        </a>
                        <a href="#portfolio" class="chat-action-link" onclick="window.closeChatWidget()">
                            <i class="fa-solid fa-briefcase"></i>
                            <span>${t('nav_portfolio') || 'شاهد الأعمال'}</span>
                        </a>
                        <button class="chat-back-btn" onclick="window.resetChatWidget()">
                            <i class="fa-solid fa-rotate-left"></i>
                            <span>${t('chat_back_menu') || 'العودة للقائمة'}</span>
                        </button>
                    `;
                    chatMessages.appendChild(linkWrap);
                    scrollToBottom(chatMessages);
                }, TYPING_DELAY + 400);
            }, TYPING_DELAY + 1500);
        }, 500);
    }

    // Bind quick buttons
    Object.entries(quickBtns).forEach(([key, btn]) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            if (key === 'about') {
                startAboutConversation();
            } else {
                const topicMap = {
                    project: t('chat_quick_project') || 'مناقشة مشروع جديد',
                    price:   t('chat_quick_price')   || 'الاستفسار عن الأسعار',
                    other:   t('chat_quick_other')   || 'سؤال آخر',
                };
                startConversation(topicMap[key] || key);
            }
        });
    });

    // ── Send logic ──────────────────────────────────────────────
    if (sendNameBtn) sendNameBtn.addEventListener('click', handleSend);
    if (nameInput)    nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
    if (contactInput) contactInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
    if (msgInput)     msgInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); });

    function shake(el) {
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 600);
    }

    function handleSend() {
        if (chatStep === 0) {
            const name = nameInput.value.trim();
            if (!name) { shake(nameInput); return; }
            userName = name;
            chatStep = 1;

            addUserMessage(chatMessages, name);
            nameInput.style.display    = 'none';
            contactInput.style.display = '';
            updateStepProgress(1);

            const askContact = (t('chat_bot_ask_contact') || 'تشرفنا بك يا {name}! 😊 يرجى إدخال بريدك الإلكتروني أو رقم هاتفك:')
                .replace('{name}', `<strong>${name}</strong>`);
            addBotMessage(chatMessages, askContact, true);
            setTimeout(() => contactInput.focus(), TYPING_DELAY + 200);

        } else if (chatStep === 1) {
            const contact = contactInput.value.trim();
            if (!contact) { shake(contactInput); return; }
            userContact = contact;
            chatStep = 2;

            addUserMessage(chatMessages, contact);
            contactInput.style.display = 'none';
            msgInput.style.display     = '';
            updateStepProgress(2);

            if (sendNameBtn) sendNameBtn.textContent = t('chat_send') || 'إرسال';

            const askMsg = t('chat_bot_ask_msg') || 'ممتاز! 🎯 حدثني عن تفاصيل طلبك أو استفسارك.';
            addBotMessage(chatMessages, askMsg, true);
            setTimeout(() => msgInput.focus(), TYPING_DELAY + 200);

        } else if (chatStep === 2) {
            const msg = msgInput.value.trim();
            if (!msg) { shake(msgInput); return; }
            userMessage = msg;
            chatStep = 3;

            addUserMessage(chatMessages, msg);
            msgInput.disabled   = true;
            if (sendNameBtn) sendNameBtn.disabled = true;
            updateStepProgress(3);

            sendChatViaWeb3Forms();
        }
    }

    // ── Web3Forms submission ────────────────────────────────────
    function sendChatViaWeb3Forms() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'chat-msg bot typing-indicator';
        loadingEl.innerHTML = `<span></span><span></span><span></span>`;
        chatMessages.appendChild(loadingEl);
        scrollToBottom(chatMessages);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                access_key:   WEB3FORMS_KEY,
                name:         userName,
                email:        userContact,
                phone:        userContact,
                project_type: chatTopic,
                message:      userMessage,
                subject:      `[ DevNaji Chat ] ${chatTopic} — من ${userName}`,
                from_name:    'DevNaji Chat Widget',
                redirect:     false,
            }),
        })
        .then(r => r.json())
        .then(data => {
            loadingEl.remove();
            if (data.success) {
                showFinalSuccess();
            } else {
                throw new Error(data.message || 'Failed');
            }
        })
        .catch(err => {
            loadingEl.remove();
            console.warn('Web3Forms fallback:', err);
            // Fallback: open WhatsApp
            const topic   = chatTopic  ? `\n• الموضوع: ${chatTopic}` : '';
            const contact = userContact ? `\n• التواصل: ${userContact}` : '';
            const waText  = `*[ رسالة من DevNaji Chat ]*\n──────────────────\n• الاسم: ${userName}${contact}${topic}\n──────────────────\n${userMessage}`;
            window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank');
            showFinalSuccess();
        });
    }

    // ── Channel buttons (fallback) ──────────────────────────────
    if (sendWABtn) sendWABtn.addEventListener('click', () => {
        const topic   = chatTopic  ? `\n• الموضوع: ${chatTopic}` : '';
        const contact = userContact ? `\n• التواصل: ${userContact}` : '';
        const waText  = `*[ رسالة من DevNaji Chat ]*\n──────────────────\n• الاسم: ${userName}${contact}${topic}\n──────────────────\n${userMessage}`;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank');
        showFinalSuccess();
    });
    if (sendEmailBtn) sendEmailBtn.addEventListener('click', () => sendChatViaWeb3Forms());

    // ── Final success state ─────────────────────────────────────
    function showFinalSuccess() {
        const inputArea = formState.querySelector('.chat-input-area');
        if (inputArea) inputArea.style.display = 'none';
        const progressWrap = formState.querySelector('.chat-progress-wrap');
        if (progressWrap) progressWrap.style.display = 'none';

        const successEl = document.createElement('div');
        successEl.className = 'chat-success-state';
        successEl.innerHTML = `
            <div class="chat-success-icon">
                <i class="fa-solid fa-circle-check"></i>
            </div>
            <h4>${t('success_title') || 'تم الإرسال! ✅'}</h4>
            <p>${t('success_desc') || 'سأتواصل معك قريباً.'}</p>
            <div class="chat-success-socials">
                <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener noreferrer" class="chat-soc-pill wa">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
                <a href="mailto:${EMAIL}" class="chat-soc-pill em">
                    <i class="fa-solid fa-envelope"></i> Email
                </a>
            </div>
            <button class="chat-restart-btn" id="chatRestartBtn">
                <i class="fa-solid fa-rotate-left"></i>
                ${t('chat_back_menu') || 'إرسال رسالة أخرى'}
            </button>
        `;
        chatMessages.appendChild(successEl);
        scrollToBottom(chatMessages);
        document.getElementById('chatRestartBtn')?.addEventListener('click', resetChat);
    }

    // ── Reset chat ──────────────────────────────────────────────
    function resetChat() {
        userName    = '';
        userContact = '';
        userMessage = '';
        chatTopic   = '';
        chatStep    = 0;

        if (msgInput)     { msgInput.value    = ''; msgInput.disabled    = false; msgInput.style.display    = 'none'; }
        if (nameInput)    { nameInput.value   = ''; nameInput.disabled   = false; nameInput.style.display   = ''; }
        if (contactInput) { contactInput.value = ''; contactInput.disabled = false; contactInput.style.display = 'none'; }
        if (sendNameBtn)  { sendNameBtn.disabled = false; sendNameBtn.style.display = ''; sendNameBtn.textContent = t('chat_next') || 'التالي'; }

        const inputArea = formState.querySelector('.chat-input-area');
        if (inputArea) inputArea.style.display = '';
        const progressWrap = formState.querySelector('.chat-progress-wrap');
        if (progressWrap) progressWrap.style.display = 'none';

        channelState.style.display = 'none';
        formState.style.display    = 'none';
        welcome.style.display      = 'flex';

        updateStepProgress(0);
        refreshChatTranslations();
    }

    // Expose for inline onclick
    window.resetChatWidget = resetChat;

    // ── Message bubble builders ─────────────────────────────────
    function addBotMessage(container, text, withTyping) {
        if (withTyping) {
            const typingEl = document.createElement('div');
            typingEl.className = 'chat-msg bot typing-indicator';
            typingEl.innerHTML = `<span></span><span></span><span></span>`;
            container.appendChild(typingEl);
            scrollToBottom(container);

            setTimeout(() => {
                typingEl.remove();
                appendBubble(container, text, 'bot');
            }, TYPING_DELAY);
        } else {
            appendBubble(container, text, 'bot');
        }
    }

    function addUserMessage(container, text) {
        appendBubble(container, text, 'user');
    }

    function appendBubble(container, text, role) {
        const div = document.createElement('div');
        div.className = `chat-msg ${role}`;
        if (role === 'bot') {
            div.innerHTML = text; // allow HTML for bold names/links
        } else {
            div.textContent = text;
        }
        container.appendChild(div);
        scrollToBottom(container);
    }

    function scrollToBottom(el) {
        if (el) el.scrollTop = el.scrollHeight;
    }

    // ── Badge pulse after delay ─────────────────────────────────
    setTimeout(() => {
        if (!chatOpen && !badgeDismissed && badge) {
            badge.style.transform = 'scale(1)';
        }
    }, 3000);

    // ── Initial translation sync ────────────────────────────────
    refreshChatTranslations();

})();
