// ==========================================================================
// Custom Cursor (dot + ring)
// - mix-blend-mode: difference 로 어떤 씬 배경색 위에서도 자동 반전
// - ring은 lerp로 dot을 뒤따라와 시네마틱한 잔상 느낌을 냄
// - 포인터가 정밀하지 않은 기기(터치)에서는 활성화하지 않음
// ==========================================================================

(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
        * { cursor: none !important; }
        .cursor-dot, .cursor-ring {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 3000;
            pointer-events: none;
            border-radius: 50%;
            mix-blend-mode: difference;
            will-change: transform;
        }
        .cursor-dot {
            width: 8px;
            height: 8px;
            background: #FAF8F5;
        }
        .cursor-ring {
            width: 36px;
            height: 36px;
            border: 1.5px solid #FAF8F5;
            transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                        height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 0.3s ease;
        }
        .cursor-ring.is-hover {
            width: 56px;
            height: 56px;
        }
    `;
    document.head.appendChild(style);

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    }, { passive: true });

    // 인터랙티브 요소 위에서 링 확대
    window.addEventListener('mouseover', (e) => {
        ring.classList.toggle('is-hover', !!e.target.closest('a, button, input, textarea, .skill-tag'));
    });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

    function follow() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        const half = ring.offsetWidth / 2;
        ring.style.transform = `translate(${ringX - half}px, ${ringY - half}px)`;
        requestAnimationFrame(follow);
    }
    requestAnimationFrame(follow);
})();
