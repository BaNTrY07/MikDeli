// Meniu mobil
const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');

function setMobileMenuState(isOpen){
    if(!menuToggle || !primaryNavigation) return;

    primaryNavigation.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Închide meniul de navigare' : 'Deschide meniul de navigare'
    );

    const icon = menuToggle.querySelector('i');

    if(icon){
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-xmark', isOpen);
    }
}

if(menuToggle && primaryNavigation){
    menuToggle.addEventListener('click', () => {
        setMobileMenuState(!primaryNavigation.classList.contains('open'));
    });

    primaryNavigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 768){
                setMobileMenuState(false);
            }
        });
    });

    document.addEventListener('keydown', event => {
        if(event.key === 'Escape'){
            setMobileMenuState(false);
        }
    });

    document.addEventListener('click', event => {
        const clickedOutsideMenu = !primaryNavigation.contains(event.target);
        const clickedOutsideToggle = !menuToggle.contains(event.target);

        if(primaryNavigation.classList.contains('open') && clickedOutsideMenu && clickedOutsideToggle){
            setMobileMenuState(false);
        }
    });

    window.addEventListener('resize', () => {
        if(window.innerWidth > 768){
            setMobileMenuState(false);
        }
    });
}

// Scroll lin pentru toate linkurile din navbar

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {

        const target = this.getAttribute('href');

        if(target.startsWith('#')){
            e.preventDefault();

            document.querySelector(target).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// Buton Contactează-ne

const contactBtn = document.querySelector('.btn');

contactBtn.addEventListener('click', function(e){
    e.preventDefault();

    document.querySelector('#contact').scrollIntoView({
        behavior:'smooth'
    });
});


// Evidențiere meniu activ

window.addEventListener('scroll', () => {

    const sections = document.querySelectorAll('section');

    const navLinks = document.querySelectorAll('nav a');

    let current = '';

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if(window.scrollY >= sectionTop){
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {

        link.classList.remove('active');

        if(link.getAttribute('href') === '#' + current){
            link.classList.add('active');
        }
    });
});

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }

    });

});

document.querySelectorAll("section").forEach(section => {

    section.classList.add("hidden");

    observer.observe(section);

});

function updateStatus(){

    const status = document.getElementById("status");

    const now = new Date();
    const hour = now.getHours();

    // Program:
    // L-V: 08:00 - 20:00
    // Sâmbătă: 09:00 - 18:00
    // Duminică: închis

    const day = now.getDay(); // 0 = Duminică, 6 = Sâmbătă

    let isOpen = false;

    if(day >= 1 && day <= 5){
        // Luni - Vineri
        isOpen = hour >= 8 && hour < 20;
    }
    else if(day === 6){
        // Sâmbătă
        isOpen = hour >= 9 && hour < 18;
    }
    else{
        // Duminică
        isOpen = false;
    }

    if(isOpen){
        status.textContent = "🟢 Deschis acum";
        status.classList.add("open");
        status.classList.remove("closed");
    }
    else{
        status.textContent = "🔴 Închis acum";
        status.classList.add("closed");
        status.classList.remove("open");
    }
}

// rulează imediat
updateStatus();

// update la fiecare minut
setInterval(updateStatus, 60000);
