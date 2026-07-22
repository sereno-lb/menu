const ICONS = {
    sandwiches: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 11c0-2.2 1.8-4 4-4h10c2.2 0 4 1.8 4 4v1c0 .5-.5 1-1 1H4c-.5 0-1-.5-1-1v-1z" />
  <path d="M2 14.5c1.5-1 2 1 3.5 0s2-1 3.5 0 2 1 3.5 0 2-1 3.5 0 2 1 3.5 0 2-1 3.5 0" />
  <path d="M3 16h18v1c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4v-1z" />
</svg>`,
    'cold-drinks': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11 18L14 2h3" />
  <path d="M6 5h12l-2 15a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L6 5z" />
  <line x1="6.7" y1="11" x2="17.3" y2="11" />
  <rect x="9" y="13" width="3" height="3" rx="0.5" />
  <rect x="12" y="15" width="3" height="3" rx="0.5" />
</svg>`,
    'hot-drinks': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 5c0-1.5 1-2.5 1-4" />
  <path d="M12 5c0-1.5 1-2.5 1-4" />
  <path d="M16 5c0-1.5 1-2.5 1-4" />
  <path d="M4 9h13a1 1 0 0 1 1 1v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V10a1 1 0 0 1 1-1z" />
  <path d="M18 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
</svg>`,
    snacks: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="9" />
  <path d="M8 9h.01" stroke-width="4" />
  <path d="M15 8h.01" stroke-width="4" />
  <path d="M9 15h.01" stroke-width="4" />
  <path d="M14 14h.01" stroke-width="4" />
  <path d="M12 11h.01" stroke-width="4" />
</svg>`,
    services: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 20h18" />
  <path d="M20 16a8 8 0 1 0-16 0" />
  <path d="M12 4v4" />
  <path d="M10 4h4" />
</svg>`
};

class MenuApp {
    constructor() {
        this.navContainer = document.getElementById('menu-nav-list');
        this.menuContainer = document.getElementById('menu');
        this.footer = document.getElementById('footer-text');
        this.searchInput = document.getElementById('menu-search');
        this.searchClear = document.getElementById('search-clear');
        this.searchResultsInfo = document.getElementById('search-results-info');

        this.sectionTemplate = document.getElementById('section-template');
        this.itemTemplate = document.getElementById('item-template');

        this.currency = '';
        this.activeSectionId = '';
        this.isSearching = false;
        this.isClickScrolling = false;
        this.clickScrollTimeout = null;
        this.sections = [];
        this.navLinks = [];
    }

    start() {
        // With a deferred script, DOMContentLoaded fires after us — but guard
        // against edge cases where the document is already fully parsed.
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loaded();
            });
        } else {
            this.loaded();
        }
    }

    loaded() {
        this.init();
        this.consentCookie();
        this.promo();
    }

    async init() {
        try {
            const menu = MENU;

            this.currency = menu.currency ?? '';

            if (this.footer) {
                this.footer.textContent = menu.footer ?? '';
            }

            this.menuContainer.innerHTML = '';

            this.renderSections(menu.sections);

            this.buildNavigation(menu.sections);

            this.initializeScrollSpy();

            this.initializeSearch();
        } catch (error) {
            console.error(error);

            this.menuContainer.innerHTML = `
                <div class="loading">
                    Unable to load the menu.
                </div>
            `;
        }
    }

    getQueryParam(name) {
        const url = window.location.href;
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replaceAll('+', ' ')).trim();
    }

    consentCookie() {
        const banner = document.getElementById('cookie-consent-banner');
        const acceptBtn = document.getElementById('cookie-accept-btn');

        const userTimeZone =
            Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || '';
        if (userTimeZone.toLowerCase().includes('beirut')) {
            banner.style.display = 'none';
            return;
        }

        if (this.getQueryParam('analytics') === '0') {
            banner.style.display = 'none';
            return;
        }

        if (!localStorage.getItem('analyticsConsent')) {
            banner.style.display = 'block';
        }

        acceptBtn.addEventListener('click', function () {
            localStorage.setItem('analyticsConsent', 'true');
            banner.style.display = 'none';
        });
    }

    promo() {
        const promoCard = document.getElementById('promo-card');
        const dismissBtn = document.getElementById('promo-dismiss-btn');

        if (!promoCard || !dismissBtn) return;

        let isExpired = false;
        if (typeof PROMOTIONS !== 'undefined') {
            const promoConfig = PROMOTIONS.find((p) => p.id === 'promo-card');
            if (promoConfig?.endDate) {
                const endDate = new Date(`${promoConfig.endDate}T23:59:59`);
                if (new Date() > endDate) {
                    isExpired = true;
                }
            }
        }

        if (
            !isExpired &&
            this.getQueryParam('promo') !== '0' &&
            localStorage.getItem('promoDismissed') !== 'true'
        ) {
            promoCard.style.display = 'block';
        } else {
            promoCard.style.display = 'none';
        }

        dismissBtn.addEventListener('click', function () {
            promoCard.style.display = 'none';
            localStorage.setItem('promoDismissed', 'true');
        });
    }

    renderSections(sections) {
        this.sections = [];

        sections.forEach((section, index) => {
            const sectionNode =
                this.sectionTemplate.content.firstElementChild.cloneNode(true);

            sectionNode.id = section.id;
            sectionNode.dataset.title = section.title.toLowerCase();

            if (index > 0) {
                sectionNode.classList.add('fade-in');
            }

            sectionNode.querySelector('.menu-section__title').textContent =
                section.title;

            const iconContainer = sectionNode.querySelector(
                '.menu-section__icon-container'
            );
            iconContainer.innerHTML = ICONS[section.icon] || '';

            const itemsContainer = sectionNode.querySelector('.menu-items');

            section.items.forEach((item) => {
                itemsContainer.appendChild(this.createItem(item));
            });

            this.menuContainer.appendChild(sectionNode);
            this.sections.push(sectionNode);
        });
    }

    createItem(item) {
        const node =
            this.itemTemplate.content.firstElementChild.cloneNode(true);

        node.querySelector('.menu-item__name').textContent = item.name;

        const description = node.querySelector('.menu-item__description');

        description.textContent = item.description
            ? `(${item.description})`
            : '';

        node.querySelector('.menu-item__price').textContent = this.formatPrice(
            item.price
        );

        // Store dataset attributes for search filtering
        node.dataset.name = item.name.toLowerCase();
        node.dataset.desc = (item.description || '').toLowerCase();
        node.dataset.tags = (item.tags || []).join(' ').toLowerCase();

        return node;
    }

    buildNavigation(sections) {
        this.navContainer.innerHTML = '';
        this.navLinks = [];

        sections.forEach((section) => {
            const link = document.createElement('a');

            link.href = `#${section.id}`;
            link.className = 'menu-nav__link';
            link.dataset.target = section.id;

            const icon = document.createElement('span');
            icon.className = 'menu-nav__icon';
            icon.innerHTML = ICONS[section.icon] || '';

            const label = document.createElement('span');
            label.textContent = section.title;

            link.append(icon, label);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(section.id);
                if (target) {
                    this.isClickScrolling = true;
                    this.setActiveNav(section.id);
                    target.scrollIntoView({ behavior: 'smooth' });

                    this.handleScrollEnd(target, () => {
                        this.isClickScrolling = false;
                        this.updateActiveSection();
                    });
                }
            });

            this.navContainer.appendChild(link);
            this.navLinks.push(link);
        });
    }

    handleScrollEnd(targetElement, callback) {
        if (this.scrollEndCleanup) {
            this.scrollEndCleanup();
        }

        let isFinished = false;
        const finish = () => {
            if (isFinished) return;
            isFinished = true;
            if (this.scrollEndCleanup) {
                this.scrollEndCleanup();
                this.scrollEndCleanup = null;
            }
            callback();
        };

        const onScrollEnd = () => finish();
        window.addEventListener('scrollend', onScrollEnd, { once: true });

        let hasMoved = false;
        let lastPos = window.scrollY;
        let sameCount = 0;
        let rafId = null;

        const checkPos = () => {
            const currentPos = window.scrollY;
            const diff = Math.abs(currentPos - lastPos);

            if (diff > 1) {
                hasMoved = true;
                sameCount = 0;
                lastPos = currentPos;
            } else if (hasMoved) {
                sameCount++;
                if (sameCount >= 5) {
                    finish();
                    return;
                }
            } else {
                const targetRect = targetElement.getBoundingClientRect();
                if (Math.abs(targetRect.top - 78) < 15) {
                    finish();
                    return;
                }
            }
            rafId = requestAnimationFrame(checkPos);
        };

        rafId = requestAnimationFrame(checkPos);

        const fallbackTimer = setTimeout(() => {
            finish();
        }, 1500);

        this.scrollEndCleanup = () => {
            window.removeEventListener('scrollend', onScrollEnd);
            if (rafId) cancelAnimationFrame(rafId);
            clearTimeout(fallbackTimer);
        };
    }

    initializeScrollSpy() {
        let ticking = false;

        window.addEventListener(
            'scroll',
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.updateActiveSection();
                        ticking = false;
                    });
                    ticking = true;
                }
            },
            { passive: true }
        );

        // Run once on initialization
        this.updateActiveSection();
    }

    updateActiveSection() {
        if (this.isSearching || this.isClickScrolling) return;

        if (!this.sections.length) return;

        // Check if scrolled near bottom of page
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;

        if (pageHeight - scrollPosition < 30) {
            // At bottom of page -> last section
            const lastId = this.sections.at(-1).id;
            if (lastId !== this.activeSectionId) {
                this.setActiveNav(lastId);
            }
            return;
        }

        const headerOffset = 95;
        let activeId = this.sections[0].id;

        for (const element of this.sections) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= headerOffset && rect.bottom > headerOffset) {
                activeId = element.id;
                break;
            }
        }

        if (activeId !== this.activeSectionId) {
            this.setActiveNav(activeId);
        }
    }

    setActiveNav(sectionId) {
        this.activeSectionId = sectionId;
        let activeLinkNode = null;

        this.navLinks.forEach((link) => {
            const isMatch = link.dataset.target === sectionId;
            link.classList.toggle('active', isMatch);
            if (isMatch) {
                activeLinkNode = link;
            }
        });

        if (activeLinkNode && this.navContainer) {
            this.scrollToActiveNav(activeLinkNode);
        }
    }

    scrollToActiveNav(linkNode) {
        const container = this.navContainer;
        const containerRect = container.getBoundingClientRect();
        const linkRect = linkNode.getBoundingClientRect();

        // Calculate scrollLeft target to center active button in nav list
        const scrollLeftTarget =
            container.scrollLeft +
            (linkRect.left - containerRect.left) -
            containerRect.width / 2 +
            linkRect.width / 2;

        container.scrollTo({
            left: scrollLeftTarget,
            behavior: 'smooth'
        });
    }

    initializeSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', () => {
            this.handleSearch(this.searchInput.value);
        });

        if (this.searchClear) {
            this.searchClear.addEventListener('click', () => {
                this.searchInput.value = '';
                this.handleSearch('');
                this.searchInput.focus();
            });
        }
    }

    handleSearch(query) {
        const q = query.trim().toLowerCase();
        this.isSearching = q.length > 0;

        if (this.searchClear) {
            this.searchClear.hidden = q.length === 0;
        }

        let totalMatched = 0;

        this.sections.forEach((sectionElement) => {
            const itemEls = sectionElement.querySelectorAll('.menu-item');
            const secTitle = sectionElement.dataset.title || '';
            let matchedInSection = 0;

            itemEls.forEach((itemElement) => {
                const name = itemElement.dataset.name || '';
                const desc = itemElement.dataset.desc || '';
                const tags = itemElement.dataset.tags || '';

                const isMatch =
                    !q ||
                    name.includes(q) ||
                    desc.includes(q) ||
                    tags.includes(q) ||
                    secTitle.includes(q);

                itemElement.style.display = isMatch ? '' : 'none';
                if (isMatch) matchedInSection++;
            });

            sectionElement.style.display = matchedInSection > 0 ? '' : 'none';
            totalMatched += matchedInSection;
        });

        // Handle empty state & search info
        let noResultsElement = document.getElementById('no-results-message');

        if (q.length > 0) {
            if (this.searchResultsInfo) {
                this.searchResultsInfo.hidden = false;
                this.searchResultsInfo.textContent = `Found ${totalMatched} item${totalMatched === 1 ? '' : 's'}`;
            }

            if (totalMatched === 0) {
                if (!noResultsElement) {
                    noResultsElement = document.createElement('div');
                    noResultsElement.id = 'no-results-message';
                    noResultsElement.className = 'no-results';

                    const msgText = document.createElement('p');
                    const clearBtn = document.createElement('button');
                    clearBtn.type = 'button';
                    clearBtn.className = 'clear-search-btn';
                    clearBtn.textContent = 'Clear Search';
                    clearBtn.addEventListener('click', () => {
                        this.searchInput.value = '';
                        this.handleSearch('');
                    });

                    noResultsElement.append(msgText, clearBtn);
                    this.menuContainer.appendChild(noResultsElement);
                }

                const msgPara = noResultsElement.querySelector('p');
                msgPara.textContent = 'No menu items matching "';
                const strongTerm = document.createElement('strong');
                strongTerm.textContent = q;
                msgPara.append(strongTerm, '"');
                noResultsElement.style.display = '';
            } else if (noResultsElement) {
                noResultsElement.style.display = 'none';
            }
        } else {
            if (this.searchResultsInfo) {
                this.searchResultsInfo.hidden = true;
            }
            if (noResultsElement) {
                noResultsElement.style.display = 'none';
            }
            this.updateActiveSection();
        }
    }

    formatPrice(price) {
        if (price === undefined || price === null) {
            return '';
        }

        if (!this.currency) {
            return price.toLocaleString();
        }

        if (
            this.currency.startsWith('$') ||
            this.currency.startsWith('€') ||
            this.currency.startsWith('£')
        ) {
            return `${this.currency}${price.toLocaleString()}`;
        }

        return `${price.toLocaleString()} ${this.currency}`;
    }
}

const menuApp = new MenuApp();
menuApp.start();
