/**
 * DevNaji Live Chat Widget — v1.0
 * Multilingual (AR/EN/TR) | WhatsApp + Email routing
 * Premium UX with typing indicators and smooth transitions
 */

(function () {
    'use strict';

    // ── Config ──────────────────────────────────────────────────────────────
    const WA_NUMBER = '905355255446';
    const EMAIL     = 'hello@devnaji.com';
    const TYPING_DELAY = 1000; // ms before bot "types" reply

    // ── State ────────────────────────────────────────────────────────────────
    let chatOpen       = false;
    let chatTopic      = '';
    let userName       = '';
    let userMessage    = '';
    let awaitingName   = true; // true = waiting for name, false = waiting for message
    let badgeDismissed = false;

    // ── DOM Refs ─────────────────────────────────────────────────────────────
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
    const msgInput     = document.getElementById('chatMessageInput');
    const sendNameBtn  = document.getElementById('chatSendNameBtn');

    const sendWABtn    = document.getElementById('chatSendWA');
    const sendEmailBtn = document.getElementById('chatSendEmail');

    const quickBtns = {
        project: document.getElementById('chatQuickProject'),
        price:   document.getElementById('chatQuickPrice'),
        other:   document.getElementById('chatQuickOther'),
    };

    // ── Helper: get current lang & translations ──────────────────────────────
    function t(key) {
        const lang = localStorage.getItem('selectedLang') || 'ar';
        return (window.translations && window.translations[lang] && window.translations[lang][key]) || '';
    }

    // ── Helper: update all data-i18n inside chat panel ───────────────────────
    function refreshChatTranslations() {
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
        // Update send button label based on current state
        if (!awaitingName && sendNameBtn) {
            sendNameBtn.textContent = t('chat_send') || 'إرسال';
        }
    }

    // ── Toggle open / close ───────────────────────────────────────────────────
    function openChat() {
        chatOpen = true;
        panel.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.classList.add('active');
        // Kill badge on open
        if (!badgeDismissed) {
            badge.style.transform = 'scale(0)';
            badgeDismissed = true;
        }
        refreshChatTranslations();
        // Focus first input if in form state
        if (formState.style.display !== 'none') {
            (awaitingName ? nameInput : msgInput).focus();
        }
    }

    function closeChat() {
        chatOpen = false;
        panel.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
    }

    toggleBtn.addEventListener('click', () => chatOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (chatOpen && !widget.contains(e.target)) {
            closeChat();
        }
    });

    // ── Quick Action Buttons ─────────────────────────────────────────────────
    function startConversation(topic) {
        chatTopic  = topic;
        awaitingName = true;

        // Transition: hide welcome, show form
        welcome.style.display = 'none';
        formState.style.display = 'flex';
        nameInput.style.display = '';
        msgInput.style.display = 'none';
        sendNameBtn.textContent = t('chat_next') || 'التالي →';

        // Clear old messages
        chatMessages.innerHTML = '';

        // Show bot greeting with typing
        addBotMessage(chatMessages, t('chat_bot_greeting') || 'مرحباً! أنا أحمد الغانمي 👋 ما اسمك الكريم؟', true);
        setTimeout(() => nameInput.focus(), TYPING_DELAY + 200);
    }

    Object.entries(quickBtns).forEach(([key, btn]) => {
        if (btn) {
            btn.addEventListener('click', () => {
                const topicMap = {
                    project: t('chat_quick_project'),
                    price:   t('chat_quick_price'),
                    other:   t('chat_quick_other'),
                };
                startConversation(topicMap[key] || key);
            });
        }
    });

    // ── Send Name / Message ───────────────────────────────────────────────────
    sendNameBtn.addEventListener('click', handleSend);
    nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    msgInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

    function handleSend() {
        if (awaitingName) {
            const name = nameInput.value.trim();
            if (!name) { nameInput.classList.add('shake'); setTimeout(() => nameInput.classList.remove('shake'), 600); return; }
            userName = name;
            awaitingName = false;

            // Show user bubble
            addUserMessage(chatMessages, name);

            // Swap inputs
            nameInput.style.display = 'none';
            sendNameBtn.textContent = t('chat_send') || 'إرسال';
            msgInput.style.display = '';

            // Bot response asking for message
            const askMsg = (t('chat_bot_ask_msg') || 'ممتاز {name}! حدثني عن رسالتك.').replace('{name}', name);
            addBotMessage(chatMessages, askMsg, true);
            setTimeout(() => msgInput.focus(), TYPING_DELAY + 200);

        } else {
            const msg = msgInput.value.trim();
            if (!msg) { msgInput.classList.add('shake'); setTimeout(() => msgInput.classList.remove('shake'), 600); return; }
            userMessage = msg;

            // Show user bubble
            addUserMessage(chatMessages, msg);
            msgInput.disabled = true;
            sendNameBtn.disabled = true;

            // Transition to channel picker
            setTimeout(() => {
                formState.style.display = 'none';
                channelState.style.display = 'flex';
                chatChannelMessages.innerHTML = '';
                addBotMessage(chatChannelMessages, t('chat_bot_channel') || 'رائع! اختر طريقة التواصل:', false);
            }, 600);
        }
    }

    // ── Channel Buttons ──────────────────────────────────────────────────────
    sendWABtn.addEventListener('click', () => {
        const topic    = chatTopic ? `\n• الموضوع: ${chatTopic}` : '';
        const waText   = `*[ رسالة من DevNaji Chat ]*\n──────────────────\n• الاسم: ${userName}${topic}\n──────────────────\n${userMessage}`.trim();
        const url      = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
        window.open(url, '_blank');
        showFinalSuccess();
    });

    sendEmailBtn.addEventListener('click', () => {
        const subject  = encodeURIComponent(`[ DevNaji Chat ] رسالة من ${userName}`);
        const body     = encodeURIComponent(`الاسم: ${userName}\nالموضوع: ${chatTopic}\n\n${userMessage}`);
        window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
        showFinalSuccess();
    });

    // ── Final Success ─────────────────────────────────────────────────────────
    function showFinalSuccess() {
        channelState.innerHTML = `
            <div class="chat-success-state">
                <div class="chat-success-icon">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h4>${t('success_title') || 'تم الإرسال! ✅'}</h4>
                <p>${t('success_desc') || 'سأتواصل معك قريباً.'}</p>
                <button class="chat-restart-btn" id="chatRestartBtn">${t('chat_quick_other') || 'إرسال رسالة أخرى'}</button>
            </div>
        `;
        document.getElementById('chatRestartBtn')?.addEventListener('click', resetChat);
    }

    function resetChat() {
        userName    = '';
        userMessage = '';
        chatTopic   = '';
        awaitingName = true;
        msgInput.value   = '';
        nameInput.value  = '';
        msgInput.disabled   = false;
        sendNameBtn.disabled = false;

        channelState.style.display = 'none';
        formState.style.display    = 'none';
        welcome.style.display      = 'flex';
        nameInput.style.display    = '';
        msgInput.style.display     = 'none';

        refreshChatTranslations();
    }

    // ── Message Bubble Builders ───────────────────────────────────────────────
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
        div.textContent = text;
        container.appendChild(div);
        scrollToBottom(container);
    }

    function scrollToBottom(el) {
        el.scrollTop = el.scrollHeight;
    }

    // ── Bubble pulse: show badge after 3s delay ───────────────────────────────
    setTimeout(() => {
        if (!chatOpen && !badgeDismissed) {
            badge.style.transform = 'scale(1)';
        }
    }, 3000);

    // ── Listen for language changes (called by script.js setLanguage) ─────────
    // Expose a hook so the main script can trigger a re-render
    window.refreshChatLang = refreshChatTranslations;

    // ── Patch setLanguage to also update chat ─────────────────────────────────
    const _origSetLanguage = window._origSetLanguage;
    // We'll just hook into the event-driven update already triggered by data-i18n
    // script.js already calls querySelectorAll('[data-i18n]') which covers chat panel
    // So refreshChatTranslations is only needed for placeholders & dynamic text.

    // Initial translation sync
    refreshChatTranslations();

})();
