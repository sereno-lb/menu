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
    services: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M23 11h-2v-1h2zM2 11h2v-1H2zm17.646-4.94l1.415-1.414-.707-.707-1.415 1.415zM3.94 4.647l1.415 1.415.707-.707L4.647 3.94zM13 4V2h-1v2zm0 15v2h9v1H3v-1h9v-2H3.844A.845.845 0 0 1 3 18.156 8.166 8.166 0 0 1 11.156 10H12V9h-2V8h5v1h-2v1h.844A8.166 8.166 0 0 1 22 18.156a.845.845 0 0 1-.844.844zm7.998-1a7.164 7.164 0 0 0-7.154-7h-2.688a7.164 7.164 0 0 0-7.154 7z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>`
};

class MenuApp {
    constructor() {
        this.navContainer = document.getElementById('menu-nav-list');
        this.menuContainer = document.getElementById('menu');
        this.footer = document.getElementById('footer-text');

        this.sectionTemplate = document.getElementById('section-template');
        this.itemTemplate = document.getElementById('item-template');

        this.currency = '';

        // With a deferred script, DOMContentLoaded fires after us — but guard
        // against edge cases where the document is already fully parsed.
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            const menu = MENU;

            this.currency = menu.currency ?? '';

            this.footer.textContent = menu.footer ?? '';

            this.menuContainer.innerHTML = '';

            this.renderSections(menu.sections);

            this.buildNavigation(menu.sections);

            this.initializeObserver();
        } catch (error) {
            console.error(error);

            this.menuContainer.innerHTML = `
                <div class="loading">
                    Unable to load the menu.
                </div>
            `;
        }
    }

    renderSections(sections) {
        sections.forEach((section, index) => {
            const sectionNode =
                this.sectionTemplate.content.firstElementChild.cloneNode(true);

            sectionNode.id = section.id;

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

        return node;
    }

    buildNavigation(sections) {
        this.navContainer.innerHTML = '';

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

            this.navContainer.appendChild(link);
        });
    }

    initializeObserver() {
        const options = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                document.querySelectorAll('.menu-nav__link').forEach((link) => {
                    link.classList.toggle(
                        'active',
                        link.dataset.target === entry.target.id
                    );
                });
            });
        }, options);

        document
            .querySelectorAll('.menu-section')
            .forEach((section) => observer.observe(section));
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

new MenuApp();
