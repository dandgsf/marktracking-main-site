document.addEventListener('DOMContentLoaded', () => {
    /*
      Canvas Particle Background
    */
    const canvas = document.getElementById('bg-canvas');
    let ctx;
    let particlesArray = [];
    let width;
    let height;
    let mouse = { x: null, y: null };
    let resizeTimeout;

    if (canvas) {
        ctx = canvas.getContext('2d');
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                initParticles();
            }, 150);
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.directionX = (Math.random() * 0.4) - 0.2;
                this.directionY = (Math.random() * 0.4) - 0.2;
                this.size = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#00f0ff' : '#00ff9d'; // Tech colors
            }

            update() {
                if (this.x > width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;

                // Parallax sutil em relação ao mouse
                if (mouse.x && mouse.y) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        this.x += dx * 0.005;
                        this.y += dy * 0.005;
                    }
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            particlesArray = [];
            // Densidade limitada para não pesar
            let numberOfParticles = Math.min((width * height) / 20000, 200);
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();

                // Conectar partículas próximas
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                        ctx.lineWidth = 1;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }

        initParticles();
        animateParticles();
    }

    /*
      Intersection Observer para fade-in (.fade-in-element -> .visible)
    */
    const observerOptions = {
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-element');
    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    /*
      Destaque de seção ativa no menu (desktop e mobile)
    */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('nav a[href^="#"]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === id) {
                        link.classList.add('text-neon-green');
                    } else {
                        link.classList.remove('text-neon-green');
                    }
                });
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(sec => sectionObserver.observe(sec));

    /*
      Mobile Menu Toggle + scroll lock + ESC
    */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if (hamburger && navLinks) {
        const toggleMenu = (forceOpen) => {
            const isOpen = forceOpen !== undefined
                ? forceOpen
                : navLinks.classList.contains('translate-x-full');

            if (isOpen) {
                navLinks.classList.remove('translate-x-full');
                navLinks.classList.add('translate-x-0');
                hamburger.classList.add('toggle');
                document.body.style.overflow = 'hidden';
            } else {
                navLinks.classList.add('translate-x-full');
                navLinks.classList.remove('translate-x-0');
                hamburger.classList.remove('toggle');
                document.body.style.overflow = '';
            }
        };

        hamburger.addEventListener('click', () => toggleMenu());

        links.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleMenu(false);
        });
    }

    /*
      Counter Animation (se existir algum .counter no HTML)
    */
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const speed = 200;
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    countObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(counter => {
            countObserver.observe(counter);
        });
    }

    /*
      Form Handling (demo / placeholder)
    */
    const form = document.getElementById('leadForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const status = document.getElementById('formStatus');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Processando...';
            btn.disabled = true;
            btn.classList.add('opacity-60', 'cursor-not-allowed');

            // Simulação de envio – troque por fetch/axios quando plugar backend
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.classList.remove('opacity-60', 'cursor-not-allowed');

                if (status) {
                    status.innerHTML = 'Mensagem recebida! Entrarei em contato em breve.';
                    status.classList.add('text-neon-green');

                    setTimeout(() => {
                        status.innerHTML = '';
                        status.classList.remove('text-neon-green');
                    }, 5000);
                }

                form.reset();
            }, 1500);
        });
    }
});
