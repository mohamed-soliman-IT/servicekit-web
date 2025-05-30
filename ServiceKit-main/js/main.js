// Global variables
let scene, camera, renderer, planet, atmosphere;
let serviceWords = [];
let isAnimating = true;
let particles = [];
let orbitPoints = [];
let orbitLine;
let meteorites = [];
let controls; // Add OrbitControls
let services = [
    { key: 'carpentry', color: 0x00ff00 },
    { key: 'plumbing', color: 0xff00ff },
    { key: 'electrical', color: 0x0000ff },
    { key: 'mechanical', color: 0xffff00 }
];

// Initialize the scene
async function init() {
    try {
        // Wait for translations to load
        await loadTranslations();
        
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 7;
        
        // Create renderer with proper settings for GitHub Pages
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0); // Set alpha to 0 for transparency
        
        // Get container and check if it exists
        const container = document.getElementById('scene-container');
        if (!container) {
            console.error('Scene container not found');
            return;
        }

        // Clear any existing content and set container styles
        container.innerHTML = '';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '-1';
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00ffff, 2);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Add point lights for better illumination
        const pointLight1 = new THREE.PointLight(0x00ffff, 1.5);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x0088ff, 1.5);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);

        // Create planet and atmosphere
        createPlanet();
        createServiceMeteors();
        createParticles();

        // Add event listeners
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onMouseMove);

        // Start animation
        animate();

        // Force a resize event to ensure proper rendering
        window.dispatchEvent(new Event('resize'));

    } catch (error) {
        console.error('Error initializing scene:', error);
    }
}

// Create glowing planet
function createPlanet() {
    planet = new THREE.Group();
    
    // Create core sphere with higher resolution
    const sphereGeometry = new THREE.SphereGeometry(2, 128, 128);
    
    // Create base material with turquoise color
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        shininess: 25
    });
    
    const baseMesh = new THREE.Mesh(sphereGeometry, baseMaterial);
    planet.add(baseMesh);

    // Load Earth texture and create Earth sphere
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg', 
        function(texture) {
            const earthMaterial = new THREE.MeshPhongMaterial({
                map: texture,
                transparent: true,
                opacity: 0.9
            });
            const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
            planet.add(earthMesh);
        }
    );
    
    // Create outer glow
    const glowGeometry = new THREE.SphereGeometry(2.2, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(0x00ffff) },
            viewVector: { value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.7 - dot(vNormal, vNormel), 3.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, 0.2);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    planet.add(glowMesh);
    
    // Create grid pattern
    const gridGeometry = new THREE.SphereGeometry(2.01, 32, 32);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    planet.add(grid);
    
    // Add ambient particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 2000;
    const posArray = new Float32Array(particlesCnt * 3);
    
    for(let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    planet.add(particlesMesh);
    
    scene.add(planet);
}

// Create background particles
function createParticles() {
    const colors = [0x00ffff, 0x0088ff, 0x0044ff];
    
    for (let i = 0; i < 300; i++) {
        const geometry = new THREE.SphereGeometry(0.01, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: Math.random() * 0.5 + 0.25
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position in a sphere
        const radius = Math.random() * 15 + 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = radius * Math.cos(phi);
        
        particle.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            originalPosition: particle.position.clone(),
            movementOffset: Math.random() * Math.PI * 2
        };
        
        particles.push(particle);
        scene.add(particle);
    }
}

// Create service meteors
function createServiceMeteors() {
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    
    if (!translations || !translations[currentLang]) {
        console.warn('Translations not loaded for language:', currentLang);
        return;
    }
    
    services.forEach((service, index) => {
        const serviceGroup = new THREE.Group();
        serviceGroup.userData.isSelectable = true;

        // Create main cube
        const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            color: service.color,
            transparent: true,
            opacity: 0.8,
            wireframe: true
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        serviceGroup.add(cube);

        // Add glowing edges
        const edges = new THREE.EdgesGeometry(cubeGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: service.color,
            transparent: true,
            opacity: 0.5
        });
        const edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
        serviceGroup.add(edgesMesh);

        // Create text display group that will always face camera
        const textGroup = new THREE.Group();

        // Create background panel
        const panelGeometry = new THREE.PlaneGeometry(2, 0.6);
        const panelMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Add glow to panel edges
        const glowGeometry = new THREE.PlaneGeometry(2.1, 0.7);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: service.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.z = -0.01;
        textGroup.add(glow);
        textGroup.add(panel);

        // Create text texture
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;

        // Fill background
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        context.font = 'bold 72px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Get translated service name with fallback
        const serviceName = translations[currentLang]?.services?.[service.key]?.title || service.key;
        
        // Add white outline
        context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        context.lineWidth = 8;
        context.strokeText(serviceName, canvas.width/2, canvas.height/2);
        
        // Add colored glow
        context.shadowColor = `rgb(${service.color >> 16}, ${(service.color >> 8) & 255}, ${service.color & 255})`;
        context.shadowBlur = 20;
        context.fillStyle = '#ffffff';
        context.fillText(serviceName, canvas.width/2, canvas.height/2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const textGeometry = new THREE.PlaneGeometry(1.9, 0.5);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.z = 0.01;
        textGroup.add(textMesh);

        // Position text group
        textGroup.position.set(1.2, 0.3, 0);
        serviceGroup.add(textGroup);

        // Set initial position
        const angle = (index / services.length) * Math.PI * 2;
        const orbitRadius = 3;
        const orbitHeight = (index % 2 === 0 ? 0.5 : -0.5);
        
        serviceGroup.position.set(
            Math.cos(angle) * orbitRadius,
            orbitHeight,
            Math.sin(angle) * orbitRadius
        );
        
        serviceGroup.userData = {
            angle: angle,
            speed: 0.003,
            radius: orbitRadius,
            height: orbitHeight,
            rotationSpeed: {
                x: 0.0005,
                y: 0.0005,
                z: 0.0005
            },
            serviceKey: service.key
        };

        scene.add(serviceGroup);
        meteorites.push(serviceGroup);
    });
}

// Add function to update service names when language changes
async function updateServiceNames() {
    // Ensure translations are loaded
    if (!translations) {
        await loadTranslations();
    }
    
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    
    // Clear existing meteorites
    meteorites.forEach(meteor => {
        scene.remove(meteor);
    });
    meteorites = [];
    
    // Recreate service meteors with new translations
    createServiceMeteors();
}

// Add event listener for language changes
document.addEventListener('languageChanged', async () => {
    await updateServiceNames();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (planet) {
        planet.rotation.y += 0.002;
    }
    
    // Animate meteorites
    meteorites.forEach(meteor => {
        meteor.userData.angle += meteor.userData.speed;
        
        // Update position
        meteor.position.x = Math.cos(meteor.userData.angle) * meteor.userData.radius;
        meteor.position.z = Math.sin(meteor.userData.angle) * meteor.userData.radius;
        meteor.position.y = meteor.userData.height + Math.sin(meteor.userData.angle * 2) * 0.1;
        
        // Rotate the cube
        meteor.children[0].rotation.x += meteor.userData.rotationSpeed.x;
        meteor.children[0].rotation.y += meteor.userData.rotationSpeed.y;
        meteor.children[0].rotation.z += meteor.userData.rotationSpeed.z;

        // Make text always face camera
        const textGroup = meteor.children[1];
        textGroup.lookAt(camera.position);
    });

    // Animate background particles
    const time = Date.now() * 0.001;
    particles.forEach(particle => {
        particle.rotation.x += particle.userData.rotationSpeed.x;
        particle.rotation.y += particle.userData.rotationSpeed.y;
        particle.rotation.z += particle.userData.rotationSpeed.z;
        
        const offset = particle.userData.movementOffset;
        const originalPos = particle.userData.originalPosition;
        
        particle.position.x = originalPos.x + Math.sin(time + offset) * 0.3;
        particle.position.y = originalPos.y + Math.cos(time + offset) * 0.3;
        particle.position.z = originalPos.z + Math.sin(time * 0.5 + offset) * 0.3;
    });
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Handle mouse movement
function onMouseMove(event) {
    if (planet) {
        const mouseX = (event.clientX - window.innerWidth / 2) / 100;
        const mouseY = (event.clientY - window.innerHeight / 2) / 100;
        const targetRotationY = -Math.PI * 0.1 + mouseX * 0.2;
        const targetRotationX = Math.PI * 0.1 + mouseY * 0.2;
        planet.rotation.y += (targetRotationY - planet.rotation.y) * 0.05;
        planet.rotation.x += (targetRotationX - planet.rotation.x) * 0.05;
    }
}

// Initialize everything when the page loads
window.addEventListener('load', () => {
    init();
}); 
