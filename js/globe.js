class SkillsGlobe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.skills = [
      {
        name: 'JavaScript',
        color: '#f7df1e',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      },
      {
        name: 'React',
        color: '#61dafb',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      },
      {
        name: 'TypeScript',
        color: '#3178c6',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      },
      {
        name: 'HTML5',
        color: '#e34f26',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      },
      {
        name: 'CSS3',
        color: '#1572b6',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      },
      {
        name: 'Node.js',
        color: '#339933',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      },
      {
        name: 'Vue.js',
        color: '#4fc08d',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      },
      {
        name: 'Python',
        color: '#3776ab',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      },
      {
        name: 'Git',
        color: '#f05032',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      },
      {
        name: 'Figma',
        color: '#f24e1e',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      },
      {
        name: 'Tailwind',
        color: '#06b6d4',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
      },
      {
        name: 'Redux',
        color: '#764abc',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
      },
      {
        name: 'SASS',
        color: '#cc6699',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      },
      {
        name: 'Next.js',
        color: '#000000',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      },
      {
        name: 'GraphQL',
        color: '#e10098',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
      },
    ];

    this.points = [];
    this.gridPoints = [];
    this.particles = [];

    this.rotation = { x: 0, y: 0 };
    this.targetRotation = { x: 0.0, y: 0.0 };
    this.autoRotate = true;
    this.mouse = { x: 0, y: 0, down: false };
    this.iconsLoaded = false;
    this.animationRunning = false;

    this.init();
  }

  init() {
    this.resize();
    this.generatePoints();
    this.generateGrid();
    this.generateParticles();
    this.setupEventListeners();
    this.loadIcons();
    this.startAnimation();
  }

  loadIcons() {
    let loadedCount = 0;
    const totalIcons = this.skills.length;

    this.skills.forEach((skill) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        skill.imageElement = img;
        skill.imageLoaded = true;
        loadedCount++;

        if (loadedCount === totalIcons) {
          this.iconsLoaded = true;
        }
      };

      img.onerror = () => {
        skill.imageLoaded = false;
        loadedCount++;

        if (loadedCount === totalIcons) {
          this.iconsLoaded = true;
        }
      };

      img.src = skill.iconUrl;
    });
  }

  startAnimation() {
    if (!this.animationRunning) {
      this.animationRunning = true;
      this.animate();
    }
  }

  resize() {
    const container = this.canvas.parentElement;
    const size = Math.min(container.clientWidth, 600);
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;

    this.ctx.scale(dpr, dpr);

    this.centerX = size / 2;
    this.centerY = size / 2;
    this.radius = Math.min(size, size) * 0.35;
  }

  generatePoints() {
    this.points = [];
    const numPoints = this.skills.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      this.points.push({
        x: x * this.radius,
        y: y * this.radius,
        z: z * this.radius,
        skill: this.skills[i],
      });
    }
  }

  generateGrid() {
    this.gridPoints = [];
    const steps = 30;

    const latCount = 15;
    for (let i = 1; i < latCount; i++) {
      const lat = (Math.PI * i) / latCount;
      const y = Math.cos(lat) * this.radius;
      const r = Math.sin(lat) * this.radius;

      const ring = [];
      for (let j = 0; j <= steps; j++) {
        const angle = (j / steps) * Math.PI * 2;
        ring.push({
          x: Math.sin(angle) * r,
          y: y,
          z: Math.cos(angle) * r,
        });
      }
      this.gridPoints.push({ points: ring, type: 'lat' });
    }

    const longCount = 15;
    for (let i = 0; i < longCount; i++) {
      const angle = (i / longCount) * Math.PI * 2;
      const ring = [];
      for (let j = 0; j <= steps; j++) {
        const lat = (j / steps) * Math.PI * 2;
        ring.push({
          x: Math.sin(lat) * this.radius * Math.sin(angle),
          y: Math.cos(lat) * this.radius,
          z: Math.sin(lat) * this.radius * Math.cos(angle),
        });
      }
      this.gridPoints.push({ points: ring, type: 'long' });
    }
  }

  generateParticles() {
    this.particles = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = this.radius * (0.9 + Math.random() * 0.3);

      this.particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        size: Math.random() * 1.5,
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.generatePoints();
      this.generateGrid();
      this.generateParticles();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.down = true;
      this.autoRotate = false;
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.mouse.down) {
        const rect = this.canvas.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;

        const deltaX = newX - this.mouse.x;
        const deltaY = newY - this.mouse.y;

        this.targetRotation.y += deltaX * 0.005;
        this.targetRotation.x += deltaY * 0.005;

        this.mouse.x = newX;
        this.mouse.y = newY;
      }
    });

    window.addEventListener('mouseup', () => {
      this.mouse.down = false;
      setTimeout(() => {
        this.autoRotate = true;
      }, 2000);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.mouse.down = true;
      this.autoRotate = false;
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.touches[0].clientX - rect.left;
      this.mouse.y = e.touches[0].clientY - rect.top;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.mouse.down) {
        const rect = this.canvas.getBoundingClientRect();
        const newX = e.touches[0].clientX - rect.left;
        const newY = e.touches[0].clientY - rect.top;

        const deltaX = newX - this.mouse.x;
        const deltaY = newY - this.mouse.y;

        this.targetRotation.y += deltaX * 0.005;
        this.targetRotation.x += deltaY * 0.005;

        this.mouse.x = newX;
        this.mouse.y = newY;
      }
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.mouse.down = false;
      setTimeout(() => {
        this.autoRotate = true;
      }, 2000);
    });
  }

  rotateX(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x,
      y: point.y * cos - point.z * sin,
      z: point.y * sin + point.z * cos,
    };
  }

  rotateY(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos + point.z * sin,
      y: point.y,
      z: -point.x * sin + point.z * cos,
    };
  }

  project(point) {
    const perspective = 600;
    const scale = perspective / (perspective + point.z);
    return {
      x: point.x * scale + this.centerX,
      y: point.y * scale + this.centerY,
      scale: scale,
    };
  }

  draw3DGrid() {
    this.ctx.lineWidth = 0.5;

    this.gridPoints.forEach((line) => {
      this.ctx.beginPath();

      line.points.forEach((point, index) => {
        let rotated = this.rotateY(point, this.rotation.y);
        rotated = this.rotateX(rotated, this.rotation.x);

        const projected = this.project(rotated);

        const alpha = rotated.z > 0 ? 0.15 : 0.03;

        if (index === 0) {
          this.ctx.moveTo(projected.x, projected.y);
        } else {
          this.ctx.lineTo(projected.x, projected.y);
        }

        this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
      });

      this.ctx.stroke();
    });
  }

  drawParticles() {
    this.particles.forEach((p) => {
      let rotated = this.rotateY(p, this.rotation.y);
      rotated = this.rotateX(rotated, this.rotation.x);
      const projected = this.project(rotated);

      const alpha = (rotated.z + this.radius) / (2 * this.radius);

      this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.2})`;
      this.ctx.beginPath();
      this.ctx.arc(
        projected.x,
        projected.y,
        p.size * projected.scale,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    });
  }

  draw() {
    const size = this.canvas.style.width
      ? parseInt(this.canvas.style.width)
      : this.canvas.width;
    this.ctx.clearRect(0, 0, size, size);

    this.draw3DGrid();
    this.drawParticles();

    const rotatedPoints = this.points.map((point) => {
      let rotated = this.rotateY(point, this.rotation.y);
      rotated = this.rotateX(rotated, this.rotation.x);
      return {
        ...rotated,
        skill: point.skill,
      };
    });

    rotatedPoints.sort((a, b) => b.z - a.z);

    rotatedPoints.forEach((point) => {
      const projected = this.project(point);
      const baseSize = 45;
      const size = baseSize * projected.scale;

      const minOpacity = 0.5;
      const maxOpacity = 1.0;
      const opacity =
        minOpacity + (projected.scale - 0.5) * (maxOpacity - minOpacity);

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0.1, Math.min(1, opacity));

      this.ctx.shadowColor = point.skill.color;
      this.ctx.shadowBlur = 15;

      if (
        point.skill.imageLoaded &&
        point.skill.imageElement &&
        point.skill.imageElement.complete
      ) {
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();

        const padding = size * 0.15;
        try {
          this.ctx.drawImage(
            point.skill.imageElement,
            projected.x - size / 2 + padding,
            projected.y - size / 2 + padding,
            size - padding * 2,
            size - padding * 2
          );
        } catch (error) {
          this.ctx.fillStyle = point.skill.color;
          this.ctx.beginPath();
          this.ctx.arc(projected.x, projected.y, size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
      } else {
        this.ctx.fillStyle = point.skill.color;
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.shadowBlur = 0;

      if (projected.scale > 0.6) {
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = '#333';
        this.ctx.font = `600 ${Math.max(10, size * 0.35)}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
          point.skill.name,
          projected.x,
          projected.y + size * 0.8
        );
      }

      this.ctx.restore();
    });
  }

  animate() {
    if (this.autoRotate) {
      this.targetRotation.y += 0.003;
      this.targetRotation.x = Math.sin(Date.now() / 2000) * 0.1;
    }

    this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.1;

    this.draw();

    if (this.animationRunning) {
      requestAnimationFrame(() => this.animate());
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !window.skillsGlobeInitialized) {
          window.skillsGlobeInitialized = true;
          setTimeout(() => {
            new SkillsGlobe('skillsGlobe');
          }, 100);
        }
      });
    },
    { threshold: 0.1 }
  );

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  } else {
    const testCanvas = document.getElementById('skillsGlobe');
    if (testCanvas) new SkillsGlobe('skillsGlobe');
  }
});
