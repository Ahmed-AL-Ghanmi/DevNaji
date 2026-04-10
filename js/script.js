document.addEventListener('DOMContentLoaded', () => {

    /* --- V13 Elite Splash Screen Fadeout --- */
    const hidePreloader = () => {
        const preloader = document.querySelector('.preloader');
        if (preloader && preloader.style.display !== 'none') {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.style.display = 'none', 800);
        }
    };
    // Custom preloader delay: shorter on mobile for snappiness, full on desktop for premium feel
    const preloaderDelay = window.matchMedia('(max-width: 768px)').matches ? 1500 : 3000;
    setTimeout(hidePreloader, preloaderDelay);

    /* --- V16 Hamburger Menu logic --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }));
    }

    /* --- V27 i18n Multi-Language Logic --- */
    let currentLang = localStorage.getItem('selectedLang');
    if (!currentLang) {
        const userLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (userLang.startsWith('ar')) currentLang = 'ar';
        else if (userLang.startsWith('tr')) currentLang = 'tr';
        else currentLang = 'en';
    }
    const langBtns = document.querySelectorAll('.lang-btn');
    
    // Typewriter state (Hoisted for setLanguage)
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let textArray = [];

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('selectedLang', lang);
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update All Buttons UI (Desktop & Mobile)
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Update Static Text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.translations[lang][key]) {
                el.innerHTML = window.translations[lang][key];
            }
        });

        // Update Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (window.translations[lang][key]) {
                el.placeholder = window.translations[lang][key];
            }
        });

        // Reset Typewriter
        textIndex = 0;
        charIndex = 0;
        isDeleting = false;
        // Update the global textArray if needed
        if (window.translations && window.translations[lang]) {
            textArray = window.translations[lang].typed_texts;
        }

        // Re-align Filter Indicator after text change
        // Re-align Filter Indicator after text change
        setTimeout(() => {
            if (window.updateIndicator) {
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter) window.updateIndicator(activeFilter);
            }
        }, 300);
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            // Refresh projects with correct language if applicable
            if (typeof loadProjects === 'function') loadProjects();
        });
    });

    // Initial load will be called at the bottom

    // Mobile Lang Dropdown Toggle
    const mobileSwitcher = document.querySelector('.mobile-lang-switcher');
    if (mobileSwitcher) {
        mobileSwitcher.addEventListener('click', (e) => {
            // Only toggle if we are NOT clicking an active language button (to allow selection)
            // Wait, actually clicking the switcher itself or any button should toggle the open state
            // But if it's open, clicking a button should select it and then close.
            if (mobileSwitcher.classList.contains('open') && e.target.classList.contains('lang-btn')) {
                // Let the button listener handle it
                mobileSwitcher.classList.remove('open');
            } else {
                mobileSwitcher.classList.toggle('open');
                e.stopPropagation();
            }
        });
        
        document.addEventListener('click', () => {
            mobileSwitcher.classList.remove('open');
        });
    }

    // Mobile Social FAB Toggle
    const socialFab = document.querySelector('.social-fab-wrap');
    if (socialFab) {
        const fabBtn = socialFab.querySelector('.social-fab-btn');
        fabBtn.addEventListener('click', (e) => {
            socialFab.classList.toggle('open');
            fabBtn.classList.toggle('active');
            e.stopPropagation();
        });
        
        document.addEventListener('click', () => {
            socialFab.classList.remove('open');
            fabBtn.classList.remove('active');
        });
    }

    const header = document.querySelector('header');
    const progressBar = document.querySelector('.top-scroll-progress');
    const scrollBtn = document.querySelector('.circle-btn-wrap.fixed-scroll');
    const circleProgress = document.querySelector('.circle-progress');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Header
        if (header) {
            if (scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }

        // Progress bar
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = scrollY > 0 ? `${progress}%` : '0';

        // Scroll to top button circle progress
        if (scrollBtn && circleProgress) {
            if (scrollY > 300) {
                scrollBtn.classList.add('visible');
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
                const offset = 301.59 - (progress / 100) * 301.59;
                circleProgress.style.strokeDashoffset = offset;
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        }
    });

    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --- Custom Cursor --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && cursorOutline && window.matchMedia('(min-width: 1025px)').matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            // Subtle delay
            setTimeout(() => {
                cursorOutline.style.left = `${posX}px`;
                cursorOutline.style.top = `${posY}px`;
            }, 50);
        });

        const hoverElements = document.querySelectorAll('a, button, .magnetic-item, .filter-btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
        
        // Global Magnetic Button Physics
        const magneticElements = document.querySelectorAll('.magnetic-item');
        magneticElements.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                // Add physical spring damping
                item.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.05)`;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = `translate(0px, 0px) scale(1)`;
            });
        });
    }

    /* --- V21 Glass IDE Tabs Logic --- */
    const ideTabs = document.querySelectorAll('.ide-tab');
    const codeBlocks = document.querySelectorAll('.code-block');
    ideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            ideTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetFile = tab.getAttribute('data-file');
            codeBlocks.forEach(block => {
                if(block.id === `code-${targetFile}`) {
                    block.style.display = 'block';
                    block.classList.add('active');
                } else {
                    block.style.display = 'none';
                    block.classList.remove('active');
                }
            });
        });
    });

    /* --- V7 Apple-Style Staggered Blur Reveals --- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    /* --- Dynamic Typed Text --- */
    const typedTarget = document.querySelector('.typed-text');
    // textArray, textIndex, charIndex, isDeleting are now declared at the top

    function typeText() {
        if (!typedTarget) return;
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typedTarget.innerHTML = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTarget.innerHTML = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500;
        }
        setTimeout(typeText, typeSpeed);
    }
    if (typedTarget) setTimeout(typeText, 1000);

    /* --- V5 Infinite Tech Slider (Clone for loop) --- */
    const techTrack = document.querySelector('.tech-slide-track');
    if (techTrack) {
        const clone = techTrack.innerHTML;
        techTrack.innerHTML += clone;
    }

    /* --- V19 Dynamic Projects & V20 Horizontal Slider Logic --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterIndicator = document.querySelector('.filter-indicator');
    const gridContainer = document.getElementById('portfolio-grid-container');
    const loadingState = document.getElementById('portfolio-loading');
    const errorState = document.getElementById('portfolio-error');
    
    const searchInput = document.getElementById('projectSearch');
    const projectCounter = document.getElementById('projectCounter');
    let allProjects = [];
    let mixItems = [];
    let currentFilter = 'all';
    let searchQuery = '';

    window.updateIndicator = function(btn) {
        if(!filterIndicator || !btn) return;
        filterIndicator.style.width = `${btn.offsetWidth}px`;
        filterIndicator.style.left = `${btn.offsetLeft}px`;
    }

    function renderProjects() {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';
        
        allProjects.forEach(proj => {
            const techHTML = proj.technologies.map(t => `<span>${t}</span>`).join('');
            const title = proj['title_' + currentLang] || proj.title;
            const desc = proj['description_' + currentLang] || proj.description;
            const cardHTML = `
                <div class="project-bento-card mix-item glass-card tilt-card" data-category="${proj.category}" data-tilt data-tilt-max="4" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.1">
                    <div class="project-img">
                        <div class="img-bg" style="background-image: url('${proj.image}');"></div>
                        <div class="project-overlay"><a href="${proj.link || '#'}" class="circle-btn magnetic-item"><i class="fa-solid fa-arrow-left"></i></a></div>
                    </div>
                    <div class="project-info">
                        <div class="project-meta en-font">
                            <span>${proj.year}</span> <span class="dot">•</span> <span>${proj.type}</span>
                        </div>
                        <h3 class="project-title">${title}</h3>
                        <p class="project-desc">${desc}</p>
                        <div class="project-tech">${techHTML}</div>
                    </div>
                </div>
            `;
            gridContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        mixItems = document.querySelectorAll('.mix-item');
        
        // V21 Disable physics on mobile
        if (typeof VanillaTilt !== 'undefined' && window.matchMedia('(min-width: 769px)').matches) {
            VanillaTilt.init(document.querySelectorAll(".tilt-card"), { max: 4, speed: 400, glare: true, "max-glare": 0.1 });
        }
        
        if (window.matchMedia('(min-width: 1025px)').matches) {
            const newMagnets = gridContainer.querySelectorAll('.magnetic-item');
            newMagnets.forEach(item => {
                item.addEventListener('mousemove', (e) => {
                    const rect = item.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    item.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.05)`;
                });
                item.addEventListener('mouseleave', () => {
                    item.style.transform = `translate(0px, 0px) scale(1)`;
                });
            });
            // Re-bind cursor listeners to dynamic items
            newMagnets.forEach(el => {
                el.addEventListener('mouseenter', () => cursorOutline?.classList.add('hovering'));
                el.addEventListener('mouseleave', () => cursorOutline?.classList.remove('hovering'));
            });
        }
        
        applyFilter();
    }

    function applyFilter() {
        const query = searchQuery.toLowerCase().trim();
        let visibleCount = 0;
        let staggerDelay = 0;

        mixItems.forEach((item) => {
            const category = item.getAttribute('data-category') || '';
            const title = item.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const desc = item.querySelector('.project-desc')?.textContent.toLowerCase() || '';
            const tech = item.querySelector('.project-tech')?.textContent.toLowerCase() || '';

            const matchesCategory = currentFilter === 'all' || category.includes(currentFilter);
            const matchesSearch = query === '' || 
                                title.includes(query) || 
                                desc.includes(query) || 
                                tech.includes(query);

            const isVisible = matchesCategory && matchesSearch;

            if (isVisible) {
                visibleCount++;
                item.style.display = 'flex';
                // Reset for stagger
                item.classList.remove('visible');
                setTimeout(() => {
                    item.classList.add('visible');
                }, staggerDelay);
                staggerDelay += 80; // Add 80ms delay for each card
            } else {
                item.classList.remove('visible');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // Update Counter
        if (projectCounter) {
            projectCounter.textContent = visibleCount;
        }

        // Toggle Empty State
        let noResultsMsg = document.getElementById('no-results-msg');
        if (visibleCount === 0) {
            if (!noResultsMsg) {
                gridContainer.insertAdjacentHTML('afterend', `
                    <div id="no-results-msg" class="reveal blur-reveal text-center" style="padding: 100px 20px; width: 100%; grid-column: 1/-1;">
                        <div class="empty-icon-wrap" style="margin-bottom: 30px; opacity: 0.15;">
                            <i class="fa-solid fa-wand-magic-sparkles" style="font-size: 4rem; color: var(--primary);"></i>
                        </div>
                        <h3 data-i18n="no_results" style="color: var(--text-muted); font-size: 1.2rem;">${window.translations[currentLang].no_results}</h3>
                    </div>
                `);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            applyFilter();
        });
    }

    function loadProjects() {
        if (!gridContainer || !loadingState || !errorState) return;
        if (typeof window.portfolioProjects !== 'undefined') {
            allProjects = window.portfolioProjects;
            loadingState.style.display = 'none';
            renderProjects();
        } else {
            console.error('Failed to load projects: window.portfolioProjects is not defined.');
            loadingState.style.display = 'none';
            errorState.style.display = 'block';
        }
    }

    const initFilter = () => {
        const activeFilter = document.querySelector('.filter-btn.active');
        if(activeFilter) window.updateIndicator(activeFilter);
        applyFilter();
    };

    // --- Final Initialization ---
    setLanguage(currentLang);
    loadProjects();
    window.addEventListener('resize', initFilter);
    setTimeout(initFilter, 500); // Guard for late layout

    /* --- V28 Mouse Drag to Scroll (Desktop) --- */
    let isDown = false;
    let startX;
    let scrollLeft;
    let walkVal = 0;

    if (gridContainer && window.matchMedia('(min-width: 1025px)').matches) {
        gridContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            gridContainer.classList.add('grabbing');
            startX = e.pageX - gridContainer.offsetLeft;
            scrollLeft = gridContainer.scrollLeft;
            walkVal = 0;
        });

        gridContainer.addEventListener('mouseleave', () => {
            isDown = false;
            gridContainer.classList.remove('grabbing');
        });

        gridContainer.addEventListener('mouseup', () => {
            isDown = false;
            gridContainer.classList.remove('grabbing');
        });

        gridContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gridContainer.offsetLeft;
            walkVal = (x - startX) * 2; // Scroll speed multiplier
            gridContainer.scrollLeft = scrollLeft - walkVal;
        });
        
        // Prevent click if we dragged
        gridContainer.addEventListener('click', (e) => {
            if (Math.abs(walkVal) > 10) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateIndicator(btn);
            currentFilter = btn.getAttribute('data-filter');
            applyFilter();
        });
    });

});

/**
 * Global Contact Form Handler — v3 (FormSubmit + WhatsApp)
 * - Email → hello@devnaji.com via FormSubmit.co (free, no account needed)
 * - WhatsApp → Opens in new tab silently, user stays on site
 * - Shows premium success modal after both actions
 *
 * FIRST TIME ONLY: FormSubmit will send a one-time verification email
 * to hello@devnaji.com — just click "Confirm Email" in that email.
 */
const WHATSAPP_NUMBER = '905355255446';
const CONTACT_EMAIL   = 'hello@devnaji.com';

window.handleContactForm = function(e) {
    e.preventDefault();

    const name   = document.getElementById('form-name').value.trim();
    const email  = document.getElementById('form-email').value.trim();
    const phone  = (document.getElementById('form-phone')?.value || '').trim();
    const type   = document.getElementById('form-type').value;
    const msg    = document.getElementById('form-msg').value.trim();
    const method = document.querySelector('input[name="contact_method"]:checked').value;

    const lang = localStorage.getItem('selectedLang') || 'ar';
    const t = (window.translations && window.translations[lang]) || {};

    // --- Validation ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name) return alert(t.error_name || 'Name required');
    if (!emailRegex.test(email)) return alert(t.error_email || 'Valid email required');
    if (!msg) return alert(t.error_msg || 'Message required');

    // --- Button Loading State ---
    const btn = document.getElementById('submitBtn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-left:8px;"></i>';

    const done = () => {
        btn.disabled  = false;
        btn.innerHTML = originalHTML;
    };

    const showSuccess = () => {
        document.getElementById('successTitle').textContent     = t.success_title || 'تم الإرسال بنجاح! ✅';
        document.getElementById('successDesc').textContent      = t.success_desc  || 'شكراً لك، سيتم التواصل معك قريباً.';
        document.getElementById('successCloseText').textContent = t.success_close || 'حسناً، شكراً!';
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('visible'), 10);
        document.getElementById('contactForm').reset();
        done();
    };

    if (method === 'whatsapp') {
        const phoneInfo = phone ? `\n• الهاتف: ${phone}` : '';
        const waText = `*[ طلب مشروع جديد - DevNaji ]*\n──────────────────\n• الاسم: ${name}\n• البريد: ${email}${phoneInfo}\n• نوع المشروع: ${type}\n──────────────────\n${msg}`.trim();
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
        const tab = window.open(url, '_blank');
        if (tab) tab.focus();
        showSuccess();

    } else {
        const phoneLabel = phone || 'لم يُدخل';
        const formData = new FormData();
        formData.append('name',         name);
        formData.append('email',        email);
        formData.append('_replyto',     email);
        formData.append('phone',        phoneLabel);
        formData.append('project_type', type);
        formData.append('message',      msg);
        formData.append('_subject',     `[ DevNaji ] طلب مشروع جديد - ${type} من ${name}`);
        formData.append('_captcha',     'false');
        formData.append('_template',    'table');

        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 10000)
        );

        Promise.race([
            fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            }).then(res => res.json()),
            timeout
        ])
        .then(() => {
            showSuccess();
        })
        .catch(() => {
            showSuccess();
        });
    }
};

/** Close the success modal */
window.closeSuccessModal = function() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('visible');
    setTimeout(() => modal.style.display = 'none', 400);
};

// Close modal when clicking the dark overlay
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('successModal');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) window.closeSuccessModal();
        });
    }

    /* --- Animated Numbers Logic --- */
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

