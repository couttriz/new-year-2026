// script.js
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const starCanvas = document.getElementById('starCanvas');
const starCtx = starCanvas.getContext('2d');
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

const fireworks = [];
const particles = [];
const stars = []; 
const fireColors = ['#ff0022', '#ff4400', '#ffaa00', '#ffd700', '#ff0055'];

// --- KIỂM TRA MÀN HÌNH ĐIỆN THOẠI ---
const isMobile = () => window.innerWidth < 768;

// =================================================================
// ĐỊNH NGHĨA HÌNH DẠNG PHÁO HOA
// =================================================================
function getPointsFromDrawing(drawCallback) {
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    const size = 320; 
    offCanvas.width = size;
    offCanvas.height = size;

    drawCallback(offCtx, size);

    const imgData = offCtx.getImageData(0, 0, size, size).data;
    const points = [];
    for (let i = 0; i < imgData.length; i += 4) {
        if (imgData[i + 3] > 150 && Math.random() < 0.3) {
            const pixelIndex = i / 4;
            const x = pixelIndex % size;
            const y = Math.floor(pixelIndex / size);
            points.push({
                x: x - size / 2,
                y: y - size / 2,
                color: `rgb(${imgData[i]},${imgData[i+1]},${imgData[i+2]})`
            });
        }
    }
    return points;
}

const drawHorse = (ctx, size) => {
    ctx.font = `${size * 0.6}px "Segoe UI Symbol", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const gradient = ctx.createLinearGradient(0, size * 0.2, 0, size * 0.8);
    gradient.addColorStop(0, '#ffffff'); 
    gradient.addColorStop(0.5, '#ffdd00'); 
    gradient.addColorStop(1, '#ff0022');   
    ctx.fillStyle = gradient;
    ctx.fillText('♞', size / 2, size / 2);
};

const drawHeart = (ctx, size) => {
    ctx.font = `${size * 0.6}px "Segoe UI Symbol", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff0044';
    ctx.fillText('♥', size / 2, size / 2);
};

const drawBanhChung = (ctx, size) => {
    const padding = size * 0.3; 
    const squareSize = size - padding * 2;
    const x = padding;
    const y = padding;

    const gradient = ctx.createLinearGradient(x, y, x + squareSize, y + squareSize);
    gradient.addColorStop(0, '#4a8a35');
    gradient.addColorStop(0.5, '#6ab04c');
    gradient.addColorStop(1, '#4a8a35');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, squareSize, squareSize);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = -squareSize; i < squareSize * 2; i += 15) {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + i - squareSize, y + squareSize);
        ctx.stroke();
    }

    ctx.strokeStyle = '#f0e6d2';
    ctx.lineWidth = squareSize * 0.05;
    ctx.beginPath();
    ctx.moveTo(x, y + squareSize * 0.33); ctx.lineTo(x + squareSize, y + squareSize * 0.33);
    ctx.moveTo(x, y + squareSize * 0.67); ctx.lineTo(x + squareSize, y + squareSize * 0.67);
    ctx.moveTo(x + squareSize * 0.33, y); ctx.lineTo(x + squareSize * 0.33, y + squareSize);
    ctx.moveTo(x + squareSize * 0.67, y); ctx.lineTo(x + squareSize * 0.67, y + squareSize);
    ctx.stroke();
};

const drawPeachBranch = (ctx, size) => {
    const centerX = size / 2;
    const bottomY = size * 0.85;

    ctx.save(); 
    ctx.translate(centerX, bottomY);
    ctx.rotate(45 * Math.PI / 180);
    ctx.scale(0.7, 0.7);
    ctx.translate(-centerX, -bottomY);

    ctx.strokeStyle = '#654321'; 
    ctx.lineCap = 'round';
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.moveTo(centerX, bottomY);
    ctx.quadraticCurveTo(centerX + size * 0.1, size * 0.6, centerX - size * 0.05, size * 0.4);
    ctx.stroke();
    ctx.lineWidth = size * 0.03;
    ctx.beginPath();
    ctx.moveTo(centerX - size * 0.02, size * 0.55);
    ctx.quadraticCurveTo(centerX + size * 0.2, size * 0.5, centerX + size * 0.35, size * 0.3);
    ctx.moveTo(centerX + size * 0.02, size * 0.65);
    ctx.quadraticCurveTo(centerX - size * 0.25, size * 0.6, centerX - size * 0.4, size * 0.35);
    ctx.moveTo(centerX - size * 0.05, size * 0.4);
    ctx.quadraticCurveTo(centerX, size * 0.2, centerX + size * 0.1, size * 0.1);
    ctx.stroke();

    const drawBlossom = (x, y, scale = 1) => {
        const radius = size * 0.04 * scale;
        ctx.fillStyle = '#ff69b4'; 
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const bx = x + Math.cos(angle) * radius;
            const by = y + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.ellipse(bx, by, radius * 0.7, radius * 0.4, angle + Math.PI/2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#ff0000'; 
        for(let i=0; i<6; i++){
            const angle = (Math.PI * 2 / 6) * i;
            const nx = x + Math.cos(angle) * radius * 0.3;
            const ny = y + Math.sin(angle) * radius * 0.3;
            ctx.beginPath();
            ctx.arc(nx, ny, radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#ffff00'; 
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
    };

    drawBlossom(centerX - size * 0.05, size * 0.4, 1.2); 
    drawBlossom(centerX + size * 0.35, size * 0.3, 1.1); 
    drawBlossom(centerX - size * 0.4, size * 0.35, 1.1); 
    drawBlossom(centerX + size * 0.1, size * 0.1, 1.0);  
    drawBlossom(centerX + size * 0.15, size * 0.45, 0.9); 
    drawBlossom(centerX - size * 0.2, size * 0.5, 0.9);
    drawBlossom(centerX + size * 0.25, size * 0.25, 0.8);
    drawBlossom(centerX - size * 0.1, size * 0.25, 0.8);
    ctx.restore(); 
};

const shapeDefinitions = {
    'horse': { points: getPointsFromDrawing(drawHorse), fixedColor: null },
    'heart': { points: getPointsFromDrawing(drawHeart), fixedColor: '#ff0044' },
    'banhchung': { points: getPointsFromDrawing(drawBanhChung), fixedColor: null },
    'peachBranch': { points: getPointsFromDrawing(drawPeachBranch), fixedColor: null } 
};
const shapeKeys = Object.keys(shapeDefinitions);

// =================================================================
// LOGIC VẬT LÝ VÀ TRÁNH KHU VỰC CHỮ
// =================================================================

class Particle {
    constructor(x, y, vx, vy, color, type) {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
        this.color = color;
        this.type = type;
        this.radius = Math.random() * 2 + 1;
        this.alpha = 1;
        this.friction = type === 'shape' ? 0.93 : 0.95; 

        if (this.type === 'shape') {
            this.gravity = 0.0;
            this.decay = Math.random() * 0.01 + 0.008;
        } else if (this.type === 'willow') {
            this.gravity = 0.15;
            this.decay = Math.random() * 0.005 + 0.005;
        } else {
            this.gravity = 0.05;
            this.decay = Math.random() * 0.015 + 0.005;
        }
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.alpha <= 0.4 && Math.random() < 0.2) this.alpha = Math.random() * 0.4;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class Firework {
    constructor(startX, startY, targetX, targetY, specialShapeType = null) {
        this.x = startX; this.y = startY;
        this.color = fireColors[Math.floor(Math.random() * fireColors.length)];
        this.specialShapeType = specialShapeType;

        let finalTargetX = targetX;
        let finalTargetY = targetY;

        // RESPONSIVE: Giảm lề an toàn trên điện thoại để pháo hoa có không gian nổ
        if (this.specialShapeType) {
            const safeMargin = isMobile() ? 70 : 180; 
            finalTargetX = Math.max(safeMargin, Math.min(finalTargetX, canvas.width - safeMargin));
            finalTargetY = Math.max(safeMargin, Math.min(finalTargetY, canvas.height * 0.4));
        }

        // --- THUẬT TOÁN TRÁNH KHU VỰC CHỮ ---
        const textZoneLeft = canvas.width * (isMobile() ? 0.1 : 0.2);
        const textZoneRight = canvas.width * (isMobile() ? 0.9 : 0.8);
        const textZoneTop = canvas.height * 0.3;
        const textZoneBottom = canvas.height * 0.7;

        if (finalTargetX > textZoneLeft && finalTargetX < textZoneRight &&
            finalTargetY > textZoneTop && finalTargetY < textZoneBottom) {
            
            const avoidMode = Math.random();
            if (avoidMode < 0.6) {
                finalTargetY = textZoneTop - Math.random() * 100 - 50;
                finalTargetY = Math.max(50, finalTargetY);
            } else if (avoidMode < 0.8) {
                finalTargetX = textZoneLeft - Math.random() * 50 - 30;
                finalTargetX = Math.max(30, finalTargetX);
            } else {
                finalTargetX = textZoneRight + Math.random() * 50 + 30;
                finalTargetX = Math.min(canvas.width - 30, finalTargetX);
            }
        }

        this.targetX = finalTargetX;
        this.targetY = finalTargetY;

        const angle = Math.atan2(this.targetY - startY, this.targetX - startX);
        const speed = isMobile() ? 14 : 19; 
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();
        this.x += this.vx; this.y += this.vy;
        this.vy += 0.18;
        return this.vy >= 0 || this.y <= this.targetY;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.trail[0]?.x || this.x, this.trail[0]?.y || this.y);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }
}

function createExplosion(x, y, color, specialShapeType) {
    if (specialShapeType) {
        const shapeData = shapeDefinitions[specialShapeType];
        const points = shapeData.points;
        const fixedColor = shapeData.fixedColor;

        // RESPONSIVE: Tự động thu nhỏ hình nổ nếu là màn hình điện thoại
        const scale = isMobile() ? 0.9 : 1.2;
        
        const frames = 35;
        const friction = 0.93; 
        const factor = (1 - friction) / (1 - Math.pow(friction, frames));

        points.forEach(pt => {
            const targetX = pt.x * scale;
            const targetY = pt.y * scale;
            const vx = targetX * factor;
            const vy = targetY * factor;
            const particleColor = fixedColor ? fixedColor : pt.color;
            particles.push(new Particle(x, y, vx, vy, particleColor, 'shape'));
        });

    } else {
        const isWillow = Math.random() < 0.3;
        const type = isWillow ? 'willow' : 'normal';
        // Giảm số lượng tia pháo trên đt để tránh giật lag
        const baseCount = isMobile() ? 40 : 80;
        const particleCount = Math.floor(Math.random() * baseCount) + 60;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (isWillow ? 7 : 10) + 2;
            particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, isWillow ? '#ffd700' : color, type));
        }
    }
}

// =================================================================
// VÒNG LẶP CHÍNH
// =================================================================

function animate() {
    requestAnimationFrame(animate);

    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(5, 2, 2, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].draw();
        if (fireworks[i].update()) {
            createExplosion(fireworks[i].x, fireworks[i].y, fireworks[i].color, fireworks[i].specialShapeType);
            fireworks.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) particles.splice(i, 1);
    }

    // Tần suất bắn ngẫu nhiên giảm một chút trên điện thoại
    if (Math.random() < (isMobile() ? 0.02 : 0.07)) {
        const startX = Math.random() * canvas.width;
        const targetX = startX + (Math.random() * 500 - 250); 
        const targetY = canvas.height * 0.1 + Math.random() * (canvas.height * 0.65);

        let specialType = null;
        if (Math.random() < 0.3) {
            specialType = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
        }
        fireworks.push(new Firework(startX, canvas.height, targetX, targetY, specialType));
    }
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
});

// =================================================================
// SỰ KIỆN TƯƠNG TÁC (TỐI GIẢN CHỐNG LAG)
// =================================================================

// Xử lý Click trên máy tính (Chỉ bắn pháo bình thường, không bắn hình dạng để tránh lag)
window.addEventListener('click', (e) => {
    // Truyền giá trị `null` ở tham số cuối để chỉ bắn pháo hoa tỏa tròn cơ bản
    fireworks.push(new Firework(canvas.width / 2, canvas.height, e.clientX, e.clientY, null));
});

// Xử lý Chạm trên điện thoại
window.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Ngăn trình duyệt zoom/cuộn màn hình
    const touch = e.touches[0];
    fireworks.push(new Firework(canvas.width / 2, canvas.height, touch.clientX, touch.clientY, null));
}, { passive: false });