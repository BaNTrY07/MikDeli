const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-navigation');

function setMobileMenu(open){
    if(!menuToggle || !nav) return;
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
}

if(menuToggle && nav){
    menuToggle.addEventListener('click', () => setMobileMenu(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMobileMenu(false)));
    document.addEventListener('keydown', event => {
        if(event.key === 'Escape') setMobileMenu(false);
    });
    document.addEventListener('click', event => {
        if(nav.classList.contains('open') && !nav.contains(event.target) && !menuToggle.contains(event.target)) setMobileMenu(false);
    });
}

function updateHeader(){
    siteHeader?.classList.toggle('scrolled', window.scrollY > 12);
}
updateHeader();
window.addEventListener('scroll', updateHeader, {passive:true});

const reveals = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {threshold:.12});
    reveals.forEach(item => observer.observe(item));
}else{
    reveals.forEach(item => item.classList.add('is-visible'));
}

const pageSections = [...document.querySelectorAll('main section[id]')];
const pageLinks = [...document.querySelectorAll('#primary-navigation a[href^="#"]')];
function setActiveMainLink(){
    if(!pageSections.length) return;
    const y = window.scrollY + 140;
    let current = pageSections[0].id;
    pageSections.forEach(section => {
        if(section.offsetTop <= y) current = section.id;
    });
    pageLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}
setActiveMainLink();
window.addEventListener('scroll', setActiveMainLink, {passive:true});

function updateStatus(){
    const status = document.querySelector('#status');
    const card = document.querySelector('#status-card');
    if(!status) return;

    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    let open = false;

    if(day >= 1 && day <= 5) open = minutes >= 480 && minutes < 1200;
    if(day === 6) open = minutes >= 540 && minutes < 1080;

    status.textContent = open ? 'Deschis acum' : 'Închis acum';
    card?.classList.toggle('closed', !open);
}
updateStatus();
setInterval(updateStatus, 60000);

const menuSearch = document.querySelector('#menu-search-input');
const menuCards = [...document.querySelectorAll('.menu-card[data-search]')];
const menuSections = [...document.querySelectorAll('.menu-section')];
const noResults = document.querySelector('#no-results');

function normalizeText(value){
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filterMenu(){
    if(!menuSearch) return;
    const query = normalizeText(menuSearch.value.trim());
    let visibleCount = 0;

    menuCards.forEach(card => {
        const haystack = normalizeText(`${card.dataset.search || ''} ${card.textContent}`);
        const visible = !query || haystack.includes(query);
        card.classList.toggle('is-hidden', !visible);
        if(visible) visibleCount++;
    });

    menuSections.forEach(section => {
        const hasVisibleCards = [...section.querySelectorAll('.menu-card')].some(card => !card.classList.contains('is-hidden'));
        section.hidden = query.length > 0 && !hasVisibleCards;
    });

    if(noResults) noResults.hidden = visibleCount !== 0;
}

menuSearch?.addEventListener('input', filterMenu);

const categoryLinks = [...document.querySelectorAll('.category-nav a[href^="#"]')];
function updateCategoryLink(){
    if(!menuSections.length || !categoryLinks.length || menuSearch?.value.trim()) return;
    const y = window.scrollY + 180;
    let current = menuSections[0]?.id || '';
    menuSections.forEach(section => {
        if(section.offsetTop <= y) current = section.id;
    });
    categoryLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}
updateCategoryLink();
window.addEventListener('scroll', updateCategoryLink, {passive:true});
