// ==========================================================================
// Film Progress Bar (영화 재생 바)
// 스크롤 진행도를 상단 바의 scaleX로 매핑. 모든 페이지에서 공유.
// ==========================================================================

(function () {
    const fill = document.getElementById('film-progress-fill');
    if (!fill) return;

    function update() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
        fill.style.transform = `scaleX(${p})`;
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
