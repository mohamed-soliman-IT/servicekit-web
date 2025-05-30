// التحقق من اللغة المحفوظة
document.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    await applyLanguage(savedLang);
});

// تطبيق اللغة على الصفحة الحالية
async function applyLanguage(lang) {
    // تحديث اتجاه الصفحة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // تحديث حالة أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // تحميل الترجمات
    await loadTranslations();

    // تحديث العناصر في الصفحة
    updatePageContent(lang);
}

// تحديث محتوى الصفحة
function updatePageContent(lang) {
    // تحديث القائمة الرئيسية
    updateNavigation(lang);
    
    // تحديث الأزرار
    updateAppButtons(lang);

    // تحديث المحتوى حسب نوع الصفحة
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'index':
            updateHero(lang);
            updateServiceCards(lang);
            break;
        case 'services':
            updateServices(lang);
            break;
        case 'courses':
            updateCourses(lang);
            // تحديث محتوى النافذة المنبثقة للتطبيق
            updateCourseModal(lang);
            break;
        case 'about':
            updateAbout(lang);
            break;
        case 'how-it-works':
            updateHowItWorks(lang);
            break;
    }
}

// تحديث محتوى النافذة المنبثقة للتطبيق
function updateCourseModal(lang) {
    const modal = document.getElementById('downloadModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-header h2');
    const modalSubtitle = modal.querySelector('.modal-header p');
    const androidBtn = modal.querySelector('.android-btn .btn-text');
    const iosBtn = modal.querySelector('.ios-btn .btn-text');

    if (modalTitle) modalTitle.textContent = translations[lang].courses.modal.title;
    if (modalSubtitle) modalSubtitle.textContent = translations[lang].courses.modal.subtitle;
    
    if (androidBtn) {
        const smallText = androidBtn.querySelector('.small-text');
        const largeText = androidBtn.querySelector('.large-text');
        if (smallText) smallText.textContent = translations[lang].courses.modal.android.small;
        if (largeText) largeText.textContent = translations[lang].courses.modal.android.large;
    }
    
    if (iosBtn) {
        const smallText = iosBtn.querySelector('.small-text');
        const largeText = iosBtn.querySelector('.large-text');
        if (smallText) smallText.textContent = translations[lang].courses.modal.ios.small;
        if (largeText) largeText.textContent = translations[lang].courses.modal.ios.large;
    }
}

// الحصول على نوع الصفحة الحالية
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path.endsWith('/')) {
        return 'index';
    }
    if (path.includes('services.html')) {
        return 'services';
    }
    if (path.includes('courses.html')) {
        return 'courses';
    }
    if (path.includes('about.html')) {
        return 'about';
    }
    if (path.includes('how-it-works.html')) {
        return 'how-it-works';
    }
    return 'index';
}

// إضافة مستمعي الأحداث لأزرار تغيير اللغة
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.dataset.lang;
            localStorage.setItem('selectedLanguage', lang);
            await applyLanguage(lang);
            
            // إطلاق حدث تغيير اللغة
            document.dispatchEvent(new Event('languageChanged'));
        });
    });
});

// تحديث صفحة كيف يعمل
function updateHowItWorks(lang) {
    // تحديث العنوان والعنوان الفرعي
    const title = document.querySelector('.how-it-works-hero .title');
    const subtitle = document.querySelector('.how-it-works-hero .subtitle');
    
    if (translations[lang] && translations[lang].howItWorks) {
        if (title) title.textContent = translations[lang].howItWorks.title;
        if (subtitle) subtitle.textContent = translations[lang].howItWorks.subtitle;

        // تحديث الخطوات
        const steps = document.querySelectorAll('.step');
        const stepKeys = ['requestService', 'chooseTechnician', 'getJobDone', 'rateReview'];
        
        steps.forEach((step, index) => {
            const key = stepKeys[index];
            const stepTitle = step.querySelector('.step-title');
            const stepDescription = step.querySelector('.step-description');
            
            if (translations[lang].howItWorks.steps && translations[lang].howItWorks.steps[key]) {
                if (stepTitle) {
                    stepTitle.textContent = translations[lang].howItWorks.steps[key].title;
                }
                if (stepDescription) {
                    stepDescription.textContent = translations[lang].howItWorks.steps[key].description;
                }
            }
        });
    }
}

function updateAbout(lang) {
    if (!translations[lang] || !translations[lang].about) return;

    // تحديث العنوان والعنوان الفرعي
    const title = document.querySelector('.about-hero .title');
    const subtitle = document.querySelector('.about-hero .subtitle');
    
    if (title) title.textContent = translations[lang].about.title;
    if (subtitle) subtitle.textContent = translations[lang].about.subtitle;

    // تحديث قسم المهمة والرؤية
    const missionTitle = document.querySelector('.mission-card h3');
    const missionDesc = document.querySelector('.mission-card p');
    const visionTitle = document.querySelector('.vision-card h3');
    const visionDesc = document.querySelector('.vision-card p');

    if (missionTitle) missionTitle.textContent = translations[lang].about.mission.title;
    if (missionDesc) missionDesc.textContent = translations[lang].about.mission.description;
    if (visionTitle) visionTitle.textContent = translations[lang].about.vision.title;
    if (visionDesc) visionDesc.textContent = translations[lang].about.vision.description;

    // تحديث قسم الفريق
    const teamTitle = document.querySelector('.section-title');
    if (teamTitle) teamTitle.textContent = translations[lang].about.team.title;

    // تحديث معلومات أعضاء الفريق
    const teamMembers = document.querySelectorAll('.team-member');
    const memberKeys = ['ceo', 'cto', 'operations'];
    
    teamMembers.forEach((member, index) => {
        const key = memberKeys[index];
        if (!translations[lang].about.team.members[key]) return;

        const memberName = member.querySelector('.member-name');
        const memberRole = member.querySelector('.member-role');
        const memberBio = member.querySelector('.member-bio');
        const memberData = translations[lang].about.team.members[key];
        
        if (memberName) memberName.textContent = memberData.name;
        if (memberRole) memberRole.textContent = memberData.role;
        if (memberBio) memberBio.textContent = memberData.bio;
    });

    // تحديث روابط التواصل الاجتماعي إذا كانت موجودة
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        if (link.getAttribute('aria-label')) {
            const platform = link.getAttribute('aria-label').toLowerCase();
            if (translations[lang].about.social && translations[lang].about.social[platform]) {
                link.setAttribute('aria-label', translations[lang].about.social[platform]);
            }
        }
    });
} 