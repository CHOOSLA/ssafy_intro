// ==========================================================================
// JavaScript Scroll Engine ( 바닐라 시네마틱 스크롤리텔링 )
// ==========================================================================

let targetScroll = 0;
let currentScroll = 0;
const smoothness = 0.07; 

window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
});

// 수치 매핑 헬퍼 함수
function mapRange(val, inMin, inMax, outMin, outMax) {
    if (val <= inMin) return outMin;
    if (val >= inMax) return outMax;
    return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// 큐빅 이징 함수 (GSAP의 ease-out과 유사한 감속 효과)
// 시작할 때 매우 빠르게 확장되고, 끝부분에서 부드럽게 감속하여 Snappy한(타이트한) 연출을 만듦
function easeOutCubic(t) {
    return (--t) * t * t + 1;
}

// clip-path 확장 사각형 폴리곤 스트링 반환 함수 (fame-estate 방식 리버스엔지니어링 결과 반영)
// t = 0 : 화면 중앙의 한 점 (사진 축소 상태)
// t = 1 : 화면 전체를 가리는 상태 (사진 100% 확대 상태)
function getClipPolygon(t) {
    let percent = t * 50; // t: 0 -> 1 일 때, percent: 0 -> 50%
    let x1 = 50 - percent;
    let y1 = 50 - percent;
    let x2 = 50 + percent;
    let y2 = 50 - percent;
    let x3 = 50 + percent;
    let y3 = 50 + percent;
    let x4 = 50 - percent;
    let y4 = 50 + percent;
    return `polygon(${x1}% ${y1}%, ${x2}% ${y2}%, ${x3}% ${y3}%, ${x4}% ${y4}%)`;
}

// 개별 사진 클립패스 확장 & 이미지 스케일 트윈 함수
function animateClipExpand(slideEl, imgEl, t, hidePhotos) {
    if (hidePhotos || t <= 0) {
        slideEl.style.opacity = 0;
        slideEl.style.clipPath = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)';
        return;
    }
    
    // 이징 강도 적용
    let easedT = easeOutCubic(t);
    
    slideEl.style.clipPath = getClipPolygon(easedT);
    imgEl.style.transform = `scale(${mapRange(easedT, 0, 1, 0.35, 1)})`; 
    slideEl.style.opacity = 1;
}

const DOM = {
    bgs: {
        cream: document.getElementById('bg-cream'),
        apricot: document.getElementById('bg-apricot'),
        charcoal: document.getElementById('bg-charcoal'),
        cream2: document.getElementById('bg-cream-2'),
        apricotLight: document.getElementById('bg-apricot-light'),
        charcoal2: document.getElementById('bg-charcoal-2')
    },
    s1: {
        section: document.getElementById('scene-1'),
        curtainLeft: document.getElementById('intro-curtain-left'),
        curtainRight: document.getElementById('intro-curtain-right'),
        textWrapper: document.getElementById('s1-text-wrapper'),
        slide1: document.getElementById('s1-slide-1'),
        slide2: document.getElementById('s1-slide-2'),
        slide3: document.getElementById('s1-slide-3'),
        slide4: document.getElementById('s1-slide-4'),
        img1: document.querySelector('#s1-slide-1 img'),
        img2: document.querySelector('#s1-slide-2 img'),
        img3: document.querySelector('#s1-slide-3 img'),
        img4: document.querySelector('#s1-slide-4 img')
    },
    s2_1: {
        img1: document.getElementById('s2-1-img1'),
        img2: document.getElementById('s2-1-img2'),
        img3: document.getElementById('s2-1-img3'),
        title: document.getElementById('s2-1-title'),
        desc: document.getElementById('s2-1-desc')
    },
    s2_2: {
        imgWrapper: document.getElementById('s2-2-img-wrapper'),
        overlay: document.getElementById('s2-2-overlay'),
        title: document.getElementById('s2-2-title'),
        desc: document.getElementById('s2-2-desc')
    },
    s2_3: {
        img: document.getElementById('s2-3-img'),
        title: document.getElementById('s2-3-title'),
        desc: document.getElementById('s2-3-desc')
    },
    s3: {
        title: document.getElementById('s3-title'),
        tags: document.querySelectorAll('.skill-tag')
    },
    s4: {
        wrapper: document.getElementById('s4-wrapper'),
        track: document.getElementById('s4-track')
    },
    s5: {
        qWrapper: document.getElementById('s5-q-wrapper'),
        a1Wrapper: document.getElementById('s5-a1-wrapper'),
        a1Title: document.getElementById('s5-a1-title'),
        a1Desc: document.getElementById('s5-a1-desc'),
        a2Wrapper: document.getElementById('s5-a2-wrapper'),
        a2Title: document.getElementById('s5-a2-title'),
        a2Desc: document.getElementById('s5-a2-desc'),
        a3Wrapper: document.getElementById('s5-a3-wrapper'),
        a3Title: document.getElementById('s5-a3-title'),
        a3Desc: document.getElementById('s5-a3-desc')
    },
    s6: {
        main: document.getElementById('s6-main'),
        sub: document.getElementById('s6-sub'),
        links: document.querySelectorAll('.s6-link'),
        footer: document.getElementById('footer')
    }
};

// ----------------------------------------------------------------------
// 렌더링 루프 (모든 시퀀스 엄격 통제)
// ----------------------------------------------------------------------
function render() {
    currentScroll += (targetScroll - currentScroll) * smoothness;
    
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    let p = currentScroll / maxScroll;
    if (p < 0) p = 0;
    if (p > 1) p = 1;

    // ================= Background Sequence =================
    DOM.bgs.apricot.style.opacity = mapRange(p, 0.15, 0.18, 0, 1) - mapRange(p, 0.33, 0.35, 0, 1);
    DOM.bgs.charcoal.style.opacity = mapRange(p, 0.33, 0.36, 0, 1) - mapRange(p, 0.46, 0.49, 0, 1);
    DOM.bgs.cream2.style.opacity = mapRange(p, 0.46, 0.49, 0, 1) - mapRange(p, 0.86, 0.88, 0, 1);
    DOM.bgs.apricotLight.style.opacity = mapRange(p, 0.86, 0.89, 0, 1) - mapRange(p, 0.95, 0.97, 0, 1);
    DOM.bgs.charcoal2.style.opacity = mapRange(p, 0.95, 0.97, 0, 1);

    // ================= Navbar Theme & Active Dot =================
    const navBar = document.getElementById('nav-bar');
    if (p < 0.15 || (p >= 0.33 && p < 0.46) || p >= 0.95) {
        navBar.className = 'theme-light'; // 어두운 슬라이드/배경 위 흰색 글자
    } else {
        navBar.className = 'theme-dark'; // 밝은 배경 위 어두운 글자
    }

    let activeIdx = 0;
    if (p < 0.22) activeIdx = 0;
    else if (p < 0.60) activeIdx = 1;
    else if (p < 0.70) activeIdx = 2;
    else if (p < 0.88) activeIdx = 3;
    else if (p < 0.96) activeIdx = 4;
    else activeIdx = 5;

    document.querySelectorAll('.nav-item').forEach((item, idx) => {
        if (idx === activeIdx) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // ================= Scene 1: Intro (0 ~ 0.22) =================
    
    // 1. 무대 커튼 오프닝 & 클로징 연출 (슬라이딩 도어)
    let curtainTranslate = 0; 
    
    if (p < 0.03) {
        // [초기 상태] 커튼 열림
        curtainTranslate = -100;
    } else if (p >= 0.03 && p < 0.05) {
        // [스크롤 시작] 초록색 커튼 닫힘
        curtainTranslate = mapRange(p, 0.03, 0.05, -100, 0);
    } else if (p >= 0.05 && p < 0.15) {
        // [사진 확대 중] 커튼 열림 유지
        curtainTranslate = -100;
    } else if (p >= 0.15 && p < 0.17) {
        // [사진 확대 완료 후] 커튼 닫힘
        curtainTranslate = mapRange(p, 0.15, 0.17, -100, 0);
    } else if (p >= 0.17 && p < 0.20) {
        // [Identity 공개] 커튼 다시 열림
        curtainTranslate = mapRange(p, 0.17, 0.20, 0, -100);
    } else {
        curtainTranslate = -100;
    }
    
    DOM.s1.curtainLeft.style.transform = `translateX(${curtainTranslate}%)`;
    DOM.s1.curtainRight.style.transform = `translateX(${-curtainTranslate}%)`;

    // 2. 메인 글씨 페이드아웃 (커튼이 닫히기 시작할 때 빠르게 투명화)
    let textOpacity = 1 - mapRange(p, 0.03, 0.045, 0, 1);
    DOM.s1.textWrapper.style.opacity = textOpacity;

    // 3. 4장 연속 전체화면 사진 확장 (겹침 오버랩 + Cubic Ease-Out 감속 이징 결합)
    // 엇갈려서 겹치는(Stagger Overlap) 범위를 지정하여 타이트하게 이미지가 이어짐
    let t1 = mapRange(p, 0.05, 0.09, 0, 1);
    let t2 = mapRange(p, 0.07, 0.11, 0, 1);
    let t3 = mapRange(p, 0.09, 0.13, 0, 1);
    let t4 = mapRange(p, 0.11, 0.15, 0, 1);
    
    // 두 번째 커튼이 닫히는 구간(p >= 0.15) 이후에는 모든 이미지 숨김
    let hidePhotos = p >= 0.15 ? true : false;

    animateClipExpand(DOM.s1.slide1, DOM.s1.img1, t1, hidePhotos);
    animateClipExpand(DOM.s1.slide2, DOM.s1.img2, t2, hidePhotos);
    animateClipExpand(DOM.s1.slide3, DOM.s1.img3, t3, hidePhotos);
    animateClipExpand(DOM.s1.slide4, DOM.s1.img4, t4, hidePhotos);

    // 커튼이 두 번째로 닫히고 열리는 시점(p >= 0.18 ~ 0.21) 인트로 씬 컨텐츠 완전히 페이드아웃
    DOM.s1.section.style.opacity = 1 - mapRange(p, 0.18, 0.21, 0, 1);

    // ================= Scene 2.1: Collab (Identity) (0.22 ~ 0.35) =================
    // 커튼이 다시 열리면서(p >= 0.17) 자연스럽게 Identity 내용들이 순차 등장
    const s21Out = mapRange(p, 0.33, 0.35, 0, 1);
    
    DOM.s2_1.img1.style.opacity = mapRange(p, 0.19, 0.21, 0, 1) - s21Out;
    DOM.s2_1.img1.style.transform = `translateY(${mapRange(p, 0.19, 0.21, 50, 0)}px)`;
    
    DOM.s2_1.img2.style.opacity = mapRange(p, 0.20, 0.22, 0, 1) - s21Out;
    DOM.s2_1.img2.style.transform = `translateY(${mapRange(p, 0.20, 0.22, 50, 0)}px)`;
    
    DOM.s2_1.img3.style.opacity = mapRange(p, 0.21, 0.23, 0, 1) - s21Out;
    DOM.s2_1.img3.style.transform = `translateY(${mapRange(p, 0.21, 0.23, 50, 0)}px)`;

    DOM.s2_1.title.style.opacity = mapRange(p, 0.22, 0.24, 0, 1) - s21Out;
    DOM.s2_1.title.style.transform = `translateY(${mapRange(p, 0.22, 0.24, 30, 0)}px)`;

    DOM.s2_1.desc.style.opacity = mapRange(p, 0.24, 0.26, 0, 1) - s21Out;
    DOM.s2_1.desc.style.transform = `translateY(${mapRange(p, 0.24, 0.26, 30, 0)}px)`;

    // ================= Scene 2.2: Flexibility (0.35 ~ 0.48) =================
    const s22Out = mapRange(p, 0.46, 0.48, 0, 1);
    
    let s22ImgScale = mapRange(p, 0.36, 0.44, 0.2, 1.2);
    DOM.s2_2.imgWrapper.style.transform = `scale(${s22ImgScale})`;
    DOM.s2_2.imgWrapper.style.opacity = mapRange(p, 0.35, 0.37, 0, 1) - s22Out;
    
    DOM.s2_2.overlay.style.background = `rgba(53, 47, 44, ${mapRange(p, 0.39, 0.41, 0, 0.6)})`;

    DOM.s2_2.title.style.opacity = mapRange(p, 0.41, 0.43, 0, 1) - s22Out;
    DOM.s2_2.title.style.transform = `translateY(${mapRange(p, 0.41, 0.43, 30, 0)}px)`;

    DOM.s2_2.desc.style.opacity = mapRange(p, 0.43, 0.45, 0, 1) - s22Out;
    DOM.s2_2.desc.style.transform = `translateY(${mapRange(p, 0.43, 0.45, 30, 0)}px)`;

    // ================= Scene 2.3: Comm (0.48 ~ 0.60) =================
    const s23Out = mapRange(p, 0.58, 0.60, 0, 1);

    DOM.s2_3.img.style.opacity = mapRange(p, 0.49, 0.52, 0, 1) - s23Out;
    DOM.s2_3.img.style.transform = `translateX(${mapRange(p, 0.49, 0.52, -50, 0)}px)`;

    DOM.s2_3.title.style.opacity = mapRange(p, 0.52, 0.54, 0, 1) - s23Out;
    DOM.s2_3.title.style.transform = `translateX(${mapRange(p, 0.52, 0.54, 50, 0)}px)`;

    DOM.s2_3.desc.style.opacity = mapRange(p, 0.54, 0.56, 0, 1) - s23Out;
    DOM.s2_3.desc.style.transform = `translateX(${mapRange(p, 0.54, 0.56, 50, 0)}px)`;

    // ================= Scene 3: Skills (0.60 ~ 0.70) =================
    const s3Out = mapRange(p, 0.68, 0.70, 0, 1);
    
    DOM.s3.title.style.opacity = mapRange(p, 0.60, 0.62, 0, 1) - s3Out;
    DOM.s3.title.style.transform = `translateY(${mapRange(p, 0.60, 0.62, 30, 0)}px)`;

    DOM.s3.tags.forEach((tag, index) => {
        let start = 0.61 + (index * 0.005);
        let end = start + 0.02;
        tag.style.opacity = mapRange(p, start, end, 0, 1) - s3Out;
        tag.style.transform = `scale(${mapRange(p, start, end, 0.8, 1)}) translateY(${mapRange(p, start, end, 20, 0)}px)`;
    });

    // ================= Scene 4: Projects (0.70 ~ 0.88) =================
    DOM.s4.wrapper.style.opacity = mapRange(p, 0.70, 0.72, 0, 1) - mapRange(p, 0.86, 0.88, 0, 1);
    
    const trackWidth = DOM.s4.track.scrollWidth;
    const maxTranslateX = trackWidth - window.innerWidth + (window.innerWidth * 0.15); 
    
    const currentTranslate = mapRange(p, 0.72, 0.85, 0, -maxTranslateX);
    DOM.s4.track.style.transform = `translateX(${currentTranslate}px)`;

    // ================= Scene 5: Co-creation Monologue (0.88 ~ 0.96) =================
    // 1. Question (88~90%)
    const qIn = mapRange(p, 0.88, 0.89, 0, 1);
    const qOut = mapRange(p, 0.90, 0.91, 0, 1);
    DOM.s5.qWrapper.style.opacity = qIn - qOut;
    DOM.s5.qWrapper.style.transform = `translateY(${mapRange(p, 0.88, 0.89, 30, 0) - mapRange(p, 0.90, 0.91, 0, -30)}px)`;

    // 2. Answer 1 (90.5~93%)
    const a1In = mapRange(p, 0.905, 0.915, 0, 1);
    const a1Out = mapRange(p, 0.92, 0.93, 0, 1);
    DOM.s5.a1Wrapper.style.opacity = a1In - a1Out;
    DOM.s5.a1Title.style.transform = `translateY(${mapRange(p, 0.905, 0.915, 40, 0) - mapRange(p, 0.92, 0.93, 0, -40)}px)`;
    DOM.s5.a1Desc.style.opacity = mapRange(p, 0.91, 0.92, 0, 1) - a1Out;
    DOM.s5.a1Desc.style.transform = `translateY(${mapRange(p, 0.91, 0.92, 40, 0) - mapRange(p, 0.92, 0.93, 0, -40)}px)`;

    // 3. Answer 2 (92.5~95%)
    const a2In = mapRange(p, 0.925, 0.935, 0, 1);
    const a2Out = mapRange(p, 0.94, 0.95, 0, 1);
    DOM.s5.a2Wrapper.style.opacity = a2In - a2Out;
    DOM.s5.a2Title.style.transform = `translateY(${mapRange(p, 0.925, 0.935, 40, 0) - mapRange(p, 0.94, 0.95, 0, -40)}px)`;
    DOM.s5.a2Desc.style.opacity = mapRange(p, 0.93, 0.94, 0, 1) - a2Out;
    DOM.s5.a2Desc.style.transform = `translateY(${mapRange(p, 0.93, 0.94, 40, 0) - mapRange(p, 0.94, 0.95, 0, -40)}px)`;

    // 4. Answer 3 (94.5~97%)
    const a3In = mapRange(p, 0.945, 0.955, 0, 1);
    const a3Out = mapRange(p, 0.96, 0.97, 0, 1);
    DOM.s5.a3Wrapper.style.opacity = a3In - a3Out;
    DOM.s5.a3Title.style.transform = `translateY(${mapRange(p, 0.945, 0.955, 40, 0) - mapRange(p, 0.96, 0.97, 0, -40)}px)`;
    DOM.s5.a3Desc.style.opacity = mapRange(p, 0.95, 0.96, 0, 1) - a3Out;
    DOM.s5.a3Desc.style.transform = `translateY(${mapRange(p, 0.95, 0.96, 40, 0) - mapRange(p, 0.96, 0.97, 0, -40)}px)`;

    // ================= Scene 6: Outro (0.96 ~ 1.0) =================
    DOM.s6.main.style.opacity = mapRange(p, 0.965, 0.98, 0, 1);
    DOM.s6.main.style.transform = `translateY(${mapRange(p, 0.965, 0.98, 40, 0)}px)`;

    DOM.s6.sub.style.opacity = mapRange(p, 0.975, 0.99, 0, 1);
    DOM.s6.sub.style.transform = `translateY(${mapRange(p, 0.975, 0.99, 30, 0)}px)`;

    DOM.s6.links.forEach((link, index) => {
        let start = 0.98 + (index * 0.003);
        let end = start + 0.01;
        link.style.opacity = mapRange(p, start, end, 0, 1);
        link.style.transform = `translateY(${mapRange(p, start, end, 20, 0)}px)`;
    });

    DOM.s6.footer.style.opacity = mapRange(p, 0.99, 1.0, 0, 1);

    requestAnimationFrame(render);
}

// 초기 렌더링 시작
requestAnimationFrame(render);

// 사이드바 내비게이션 클릭 시 해당 위치로 부드럽게 스크롤 매핑
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetP = parseFloat(item.getAttribute('data-p'));
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, targetP * maxScroll);
    });
});
