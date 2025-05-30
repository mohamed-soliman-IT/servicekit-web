let translations = null;
let currentLang = localStorage.getItem('selectedLanguage') || 'en';

async function loadTranslations() {
    try {
        const response = await fetch('/js/translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        translations = data;
        return translations;
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to default translations if loading fails
        translations = {
            en: {
                nav: {
                    services: "Services",
                    howItWorks: "How It Works",
                    courses: "Courses",
                    about: "About"
                },
                hero: {
                    title: "Connect with Professional Technicians",
                    subtitle: "Find skilled professionals for all your service needs"
                },
                services: {
                    carpentry: { title: "Carpentry", description: "Expert woodworking and furniture making services" },
                    plumbing: { title: "Plumbing", description: "Professional plumbing and pipe installation" },
                    electrical: { title: "Electrical", description: "Safe and reliable electrical services" },
                    mechanical: { title: "Mechanical", description: "Precision mechanical repairs and maintenance" }
                },
                app: {
                    android: "Android",
                    ios: "iOS"
                }
            },
            ar: {
                nav: {
                    services: "الخدمات",
                    howItWorks: "كيف يعمل",
                    courses: "الدورات",
                    about: "من نحن"
                },
                hero: {
                    title: "تواصل مع الفنيين المحترفين",
                    subtitle: "ابحث عن محترفين مهرة لجميع احتياجاتك"
                },
                services: {
                    carpentry: { title: "النجارة", description: "خدمات النجارة وصناعة الأثاث الاحترافية" },
                    plumbing: { title: "السباكة", description: "خدمات السباكة وتركيب الأنابيب الاحترافية" },
                    electrical: { title: "الكهرباء", description: "خدمات كهربائية آمنة وموثوقة" },
                    mechanical: { title: "ميكانيكي", description: "خدمات إصلاح وصيانة ميكانيكية دقيقة" }
                },
                app: {
                    android: "أندرويد",
                    ios: "آي أو إس"
                }
            }
        };
        return translations;
    }
}

function updateDirection(lang) {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
}

function updateLogo() {
    const logos = document.querySelectorAll('.logo, .sidebar__logo');
    logos.forEach(logo => {
        logo.innerHTML = 'Service<span>Kit</span>';
    });
}

function updateNavigation(lang) {
    // Update main navigation
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
    const services = ['services', 'howItWorks', 'courses', 'about'];
    
    mainNavLinks.forEach((link, index) => {
        const key = services[index];
        if (translations && translations[lang] && translations[lang].nav[key]) {
            link.textContent = translations[lang].nav[key];
        }
    });

    // Update sidebar navigation
    const sidebarNavLinks = document.querySelectorAll('.sidebar__nav-link');
    const icons = ['fa-tools', 'fa-info-circle', 'fa-graduation-cap', 'fa-users'];
    
    sidebarNavLinks.forEach((link, index) => {
        const key = services[index];
        if (translations && translations[lang] && translations[lang].nav[key]) {
            link.innerHTML = `<i class="fas ${icons[index]}"></i> ${translations[lang].nav[key]}`;
        }
    });
}

function updateHero(lang) {
    const title = document.querySelector('.title');
    const subtitle = document.querySelector('.subtitle');
    
    if (title) title.textContent = translations[lang].hero.title;
    if (subtitle) subtitle.textContent = translations[lang].hero.subtitle;
}

function updateServiceCards(lang) {
    const services = ['carpentry', 'plumbing', 'electrical', 'mechanical'];
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach((card, index) => {
        const service = services[index];
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        if (title) title.textContent = translations[lang].services[service].title;
        if (description) description.textContent = translations[lang].services[service].description;
    });

    // Update service items in services page
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        const service = services[index];
        const title = item.querySelector('.service-title');
        const description = item.querySelector('.service-description');
        
        if (title) title.textContent = translations[lang].services[service].title;
        if (description) description.textContent = translations[lang].services[service].description;
    });

    // Update course cards in courses page
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach((card, index) => {
        const service = services[index];
        const title = card.querySelector('.course-title');
        
        if (title) title.textContent = translations[lang].services[service].title;
    });
}

function updateAppButtons(lang) {
    const appButtons = document.querySelectorAll('.app-btn');
    
    appButtons.forEach(btn => {
        const isAndroid = btn.classList.contains('android-btn');
        const key = isAndroid ? 'android' : 'ios';
        btn.innerHTML = `<i class="fab fa-${isAndroid ? 'android' : 'apple'}"></i> ${translations[lang].app[key]}`;
    });
}

function updateHowItWorks(lang) {
    const title = document.querySelector('.how-it-works-hero .title');
    const subtitle = document.querySelector('.how-it-works-hero .subtitle');
    
    if (title) title.textContent = translations[lang].howItWorks.title;
    if (subtitle) subtitle.textContent = translations[lang].howItWorks.subtitle;

    // Update steps
    const steps = document.querySelectorAll('.step');
    const stepKeys = ['requestService', 'chooseTechnician', 'getJobDone', 'rateReview'];
    
    steps.forEach((step, index) => {
        const key = stepKeys[index];
        const stepTitle = step.querySelector('.step-title');
        const stepDescription = step.querySelector('.step-description');
        
        if (stepTitle) stepTitle.textContent = translations[lang].howItWorks.steps[key].title;
        if (stepDescription) stepDescription.textContent = translations[lang].howItWorks.steps[key].description;
    });
}

function updateAbout(lang) {
    const title = document.querySelector('.about-hero .title');
    const subtitle = document.querySelector('.about-hero .subtitle');
    
    if (title) title.textContent = translations[lang].about.title;
    if (subtitle) subtitle.textContent = translations[lang].about.subtitle;

    // Update Mission & Vision
    const missionTitle = document.querySelector('.mission-card h3');
    const missionDesc = document.querySelector('.mission-card p');
    const visionTitle = document.querySelector('.vision-card h3');
    const visionDesc = document.querySelector('.vision-card p');

    if (missionTitle) missionTitle.textContent = translations[lang].about.mission.title;
    if (missionDesc) missionDesc.textContent = translations[lang].about.mission.description;
    if (visionTitle) visionTitle.textContent = translations[lang].about.vision.title;
    if (visionDesc) visionDesc.textContent = translations[lang].about.vision.description;

    // Update Team Section
    const teamTitle = document.querySelector('.section-title');
    if (teamTitle) teamTitle.textContent = translations[lang].about.team.title;

    // Update Team Members
    const teamMembers = document.querySelectorAll('.team-member');
    const memberKeys = ['ceo', 'cto', 'operations'];
    
    teamMembers.forEach((member, index) => {
        const key = memberKeys[index];
        const memberName = member.querySelector('.member-name');
        const memberRole = member.querySelector('.member-role');
        const memberBio = member.querySelector('.member-bio');
        
        if (memberName) memberName.textContent = translations[lang].about.team.members[key].name;
        if (memberRole) memberRole.textContent = translations[lang].about.team.members[key].role;
        if (memberBio) memberBio.textContent = translations[lang].about.team.members[key].bio;
    });
}

function updateServices(lang) {
    // Update title and subtitle
    const title = document.querySelector('.services-hero .title');
    const subtitle = document.querySelector('.services-hero .subtitle');
    if (title) title.textContent = translations[lang].services.title;
    if (subtitle) subtitle.textContent = translations[lang].services.subtitle;

    // Update service items
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceTypes = ['carpentry', 'plumbing', 'electrical', 'mechanical'];
    
    serviceItems.forEach((item, index) => {
        const type = serviceTypes[index];
        const serviceData = translations[lang].services[type];
        
        // Update title and description
        const title = item.querySelector('.service-title');
        const description = item.querySelector('.service-description');
        if (title) title.textContent = serviceData.title;
        if (description) description.textContent = serviceData.description;

        // Update features
        const features = item.querySelectorAll('.service-features li');
        features.forEach((feature, fIndex) => {
            feature.textContent = serviceData.features[fIndex];
        });
    });
}

function updateCourses(lang) {
    // Update title and subtitle
    const title = document.querySelector('.courses-hero .title');
    const subtitle = document.querySelector('.courses-hero .subtitle');
    if (title) title.textContent = translations[lang].courses.title;
    if (subtitle) subtitle.textContent = translations[lang].courses.subtitle;

    // Update course cards
    const courseCards = document.querySelectorAll('.course-card');
    const courseTypes = ['carpentry', 'plumbing', 'electrical', 'mechanical'];
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    
    courseCards.forEach((card, index) => {
        const type = courseTypes[index];
        const courseData = translations[lang].courses.items[type];
        
        // Update level
        const level = card.querySelector('.course-level');
        if (level) level.textContent = translations[lang].courses.levels[levels[index]];

        // Update title and description
        const title = card.querySelector('.course-title');
        const description = card.querySelector('.course-description');
        if (title) title.textContent = courseData.title;
        if (description) description.textContent = courseData.description;

        // Update course details
        const details = card.querySelectorAll('.course-detail span');
        if (details[0]) details[0].textContent = details[0].textContent.replace(/\d+/, '') + translations[lang].courses.details.weeks;
        if (details[1]) details[1].textContent = details[1].textContent.replace(/\d+/, '') + translations[lang].courses.details.students;

        // Update enroll button
        const enrollBtn = card.querySelector('.course-cta');
        if (enrollBtn) enrollBtn.textContent = translations[lang].courses.enroll;
    });

    // Update modal content if it exists
    const modal = document.getElementById('downloadModal');
    if (modal) {
        const modalTitle = modal.querySelector('.modal-header h2');
        const modalSubtitle = modal.querySelector('.modal-header p');
        const androidBtn = modal.querySelector('.android-btn .btn-text');
        const iosBtn = modal.querySelector('.ios-btn .btn-text');

        if (modalTitle) modalTitle.textContent = translations[lang].courses.modal.title;
        if (modalSubtitle) modalSubtitle.textContent = translations[lang].courses.modal.subtitle;
        
        if (androidBtn) {
            androidBtn.querySelector('.small-text').textContent = translations[lang].courses.modal.android.small;
            androidBtn.querySelector('.large-text').textContent = translations[lang].courses.modal.android.large;
        }
        
        if (iosBtn) {
            iosBtn.querySelector('.small-text').textContent = translations[lang].courses.modal.ios.small;
            iosBtn.querySelector('.large-text').textContent = translations[lang].courses.modal.ios.large;
        }
    }
}

async function switchLanguage(lang) {
    await loadTranslations();
    currentLang = lang;
    localStorage.setItem('selectedLanguage', lang);
    
    updateDirection(lang);
    updateLogo();
    updateNavigation(lang);
    updateHero(lang);
    updateServiceCards(lang);
    updateAppButtons(lang);
    updateHowItWorks(lang);
    updateAbout(lang);
    updateServices(lang);
    updateCourses(lang);
    
    // Update active state of language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Dispatch language changed event
    document.dispatchEvent(new Event('languageChanged'));
}

// Initialize translations and set initial language
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    switchLanguage(currentLang);
}); 
