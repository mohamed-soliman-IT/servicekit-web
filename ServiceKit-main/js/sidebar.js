class Sidebar {
    constructor() {
        this.menuBtn = document.querySelector('.menu-btn');
        this.sidebar = document.querySelector('.sidebar');
        this.sidebarBg = document.querySelector('.sidebar__bg');
        this.closeBtn = document.querySelector('.sidebar__close');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        // Initialize Three.js scene
        this.initThreeJS();
        
        // Add event listeners
        this.menuBtn.addEventListener('click', () => this.toggleSidebar());
        this.closeBtn.addEventListener('click', () => this.closeSidebar());
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.sidebar.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.closeSidebar();
            }
        });

        // Close sidebar when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });

        // Close sidebar when clicking a link
        document.querySelectorAll('.sidebar__nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeSidebar());
        });

        // Update sidebar content on initial load
        this.updateSidebarContent();

        // Listen for language changes
        document.addEventListener('languageChanged', () => {
            this.updateSidebarContent();
        });
    }

    updateSidebarContent() {
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        const navLinks = this.sidebar.querySelectorAll('.sidebar__nav-link');
        const services = ['services', 'howItWorks', 'courses', 'about'];
        const icons = ['fa-tools', 'fa-info-circle', 'fa-graduation-cap', 'fa-users'];
        
        navLinks.forEach((link, index) => {
            const key = services[index];
            if (translations && translations[currentLang] && translations[currentLang].nav[key]) {
                link.innerHTML = `<i class="fas ${icons[index]}"></i> ${translations[currentLang].nav[key]}`;
            }
        });

        // Update app buttons in sidebar
        const appButtons = this.sidebar.querySelectorAll('.app-btn');
        appButtons.forEach(btn => {
            const isAndroid = btn.classList.contains('android-btn');
            const key = isAndroid ? 'android' : 'ios';
            if (translations && translations[currentLang] && translations[currentLang].app[key]) {
                btn.innerHTML = `<i class="fab fa-${isAndroid ? 'android' : 'apple'}"></i> ${translations[currentLang].app[key]}`;
            }
        });
    }

    initThreeJS() {
        // Create scene
        const scene = new THREE.Scene();
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, this.sidebarBg.clientWidth / this.sidebarBg.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(this.sidebarBg.clientWidth, this.sidebarBg.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.sidebarBg.appendChild(renderer.domElement);
        
        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            // Position
            posArray[i] = (Math.random() - 0.5) * 10;
            
            // Color
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.1 + 0.5, 0.8, 0.5);
            colorArray[i] = color.r;
            colorArray[i + 1] = color.g;
            colorArray[i + 2] = color.b;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        // Create material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // Create mesh
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Mouse movement effect
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            if (this.isOpen) {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (this.isOpen) {
                particlesMesh.rotation.x += 0.0005;
                particlesMesh.rotation.y += 0.0005;
                
                // Add mouse movement effect
                particlesMesh.rotation.x += mouseY * 0.0005;
                particlesMesh.rotation.y += mouseX * 0.0005;
            }
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = this.sidebarBg.clientWidth / this.sidebarBg.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(this.sidebarBg.clientWidth, this.sidebarBg.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        this.sidebar.classList.add('active');
        this.menuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    closeSidebar() {
        this.sidebar.classList.remove('active');
        this.menuBtn.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Sidebar();
});
