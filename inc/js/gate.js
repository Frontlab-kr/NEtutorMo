// jQuery: 스크롤이 0보다 크면 <html>에 'is-scrolled' 클래스 토글
$(function () {
  const $html = $('html');
  const update = () => {
    const y = $(window).scrollTop();
    $html.toggleClass('is-scrolled', y > 0);
  };

  // 초기 한 번 실행
  update();

  // 스크롤/리사이즈 시 갱신
  $(window).on('scroll resize', update);
});

$(document).ready(function () {
  AOS.init();
});

$('.ne-gate-nav-toggle').on('click', function () {
  $('.ne-gate-nav').toggleClass('active');
});
$('.ne-gate-nav-list-item').on('click', function () {
  $('.ne-gate-nav').removeClass('active');
});

// jQuery: 특정 클래스(.move-smooth)가 붙은 앵커를 부드럽게 스크롤 이동
// 사용: <a href="#content" class="ne-gate-service-scroll move-smooth" data-offset="80"> ... </a>
$(function () {
  const CLASS = 'move-smooth';
  const SPEED = 700; // ms

  $(document).on('click', `a.${CLASS}[href^="#"]`, function (e) {
    const href = $(this).attr('href');
    if (!href || href === '#') return; // 빈 해시 무시

    const $target = $(href);
    if (!$target.length) return;

    e.preventDefault();

    // 개별 링크에서 여백 조절하려면 data-offset="숫자" 속성 사용
    const extraOffset = parseInt($(this).data('offset'), 10) || 0;

    // header 높이 가져오기 (없으면 0)
    const headerHeight = $('.ne-header').outerHeight() || 0;

    // 최종 Y좌표
    const y = $target.offset().top - extraOffset + 1;

    // Lenis 사용 중이면 Lenis로, 아니면 jQuery animate로
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(y, {
        duration: 1.0,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      $('html, body').stop().animate({ scrollTop: y }, SPEED, 'swing');
    }
  });
});

// GSAP & ScrollTrigger 필요
gsap.registerPlugin(ScrollTrigger);

(function () {
  const wrap = document.querySelector('.ne-gate-introduce-scroll .circle');
  const target = wrap?.querySelector(':scope > ul');
  if (!wrap || !target) return;

  // 300px 기준에서 8px처럼 보이도록 시작 스케일
  const START_SCALE = 8 / 300; // ≈ 0.026666...

  // 초기 상태
  gsap.set(target, {
    transformOrigin: '50% 50%',
    scale: START_SCALE,
    willChange: 'transform',
  });
  gsap.set(
    [
      '.circle .circle01',
      '.circle .circle02',
      '.circle .circle03',
      '.circle .circle04',
      '.circle .circle05',
    ],
    { xPercent: 0, willChange: 'transform' }
  );

  // 한 개 타임라인으로: 핀 + 스케일업 → 펼치기 → zIndex 스왑 → 복귀

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top 50%',
      endTrigger: '.ne-gate-leveltest',
      end: 'top+=150% top+=150%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // [Phase 1] 8px → 300px (ul 스케일업)
  tl.to(target, { scale: 1, ease: 'none', duration: 1.0 });

  // [Phase 2] 펼치기 (li 이동, 동시에 시작)
  tl.addLabel('spread')
    .to(
      '.circle .circle01',
      { xPercent: -200, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )
    .to(
      '.circle .circle02',
      { xPercent: -100, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )
    .to(
      '.circle .circle03',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )
    .to(
      '.circle .circle04',
      { xPercent: 100, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )
    .to(
      '.circle .circle05',
      { xPercent: 200, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )

    // 복귀 전에 z-index 역순으로 교체
    .add(() => {
      const dir = tl.scrollTrigger && tl.scrollTrigger.direction; // 1: 내려감, -1: 올라감
      if (dir === -1) {
        // 되감는 중: 초기값으로 복구 (50,40,30,20,10)
        gsap.set('.circle .circle01', { zIndex: 50 });
        gsap.set('.circle .circle02', { zIndex: 40 });
        gsap.set('.circle .circle03', { zIndex: 30 });
        gsap.set('.circle .circle04', { zIndex: 20 });
        gsap.set('.circle .circle05', { zIndex: 10 });
      } else {
        // 정방향: 요청한 역순(10,20,30,40,50)으로 교체
        gsap.set('.circle .circle01', { zIndex: 10 });
        gsap.set('.circle .circle02', { zIndex: 20 });
        gsap.set('.circle .circle03', { zIndex: 30 });
        gsap.set('.circle .circle04', { zIndex: 40 });
        gsap.set('.circle .circle05', { zIndex: 50 });
      }
    }, '+=0.05')

    // [Phase 3] 원래 자리로 복귀
    .to(
      '.circle .circle01',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '+=0'
    )
    .to(
      '.circle .circle02',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '<'
    )
    .to(
      '.circle .circle03',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '<'
    )
    .to(
      '.circle .circle04',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '<'
    )
    .to(
      '.circle .circle05',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '<'
    )
    // [Phase 4] 하강: 다음 화면에 덮이는 느낌을 주기 위해 circle 자체를 아래로 내린다
    .to(wrap, {
      // 반응형: 현재 뷰포트 높이 기준으로 계산
      y: () => window.innerHeight * 0.3, // 필요시 0.5~0.9 사이로 조절
      duration: 1.4,
      ease: 'power2.inOut',
    })
    .to(wrap, {
      opacity: 0,
      duration: 1.4,
      ease: 'power2.inOut',
    });
})();

gsap.fromTo(
  '.ne-gate-menu__img',
  { scale: 0.1 },
  {
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#section03',
      start: 'top 100%',
      end: 'top 20%',
      scrub: true,
      //markers: true,
    },
  }
);

gsap.fromTo(
  '.ne-gate-data__img',
  { scale: 0.1 },
  {
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#section04',
      start: 'top 100%',
      end: 'top 20%',
      scrub: true,
      //markers: true,
    },
  }
);

// ===== Growup: .ne-gate-data 다음 단계 — 제목/아이콘 인트로 후, 핀 상태에서 Lottie 스크럽 =====
(() => {
  if (!window.gsap || !window.ScrollTrigger || !window.lottie) return;
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector('.ne-gate-growup');
  if (!section) return;

  const titleEl = section.querySelector('.ne-gate-growup__title');
  const iconEl = section.querySelector('.ne-gate-growup__icon');

  // ★ Lottie JSON 경로 수정
  const LOTTIE_JSON_PATH = '../../netutor/renew/mo/gate/light.json';

  // 0) 초기 상태(아래에서 위로 올라오도록 y/opacity 세팅)
  if (titleEl)
    gsap.set(titleEl, { y: 60, autoAlpha: 0, willChange: 'transform,opacity' });
  if (iconEl)
    gsap.set(iconEl, { y: 80, autoAlpha: 0, willChange: 'transform,opacity' });

  // 1) (인트로1) 제목: 섹션이 화면에 들어오자마자 아래→위로 등장 (핀 없이 가벼운 스크럽)
  if (titleEl) {
    gsap.to(titleEl, {
      y: 0,
      autoAlpha: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%', // .ne-gate-data 이후, growup 섹션이 슬며시 보일 때부터
        end: 'top 60%',
        scrub: true,
        invalidateOnRefresh: true,
      },
      duration: 1, // scrub일 때는 비율로 동작
    });
  }

  // 2) (인트로2) 아이콘: 제목보다 약간 늦게 아래→위로 등장 (역시 핀 없이)
  if (iconEl) {
    gsap.to(iconEl, {
      y: 0,
      autoAlpha: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%', // 제목보다 조금 늦게
        end: 'top 55%',
        scrub: true,
        invalidateOnRefresh: true,
      },
      duration: 1,
    });
  }

  // 3) Lottie 로드 (autoplay:false, loop:false)
  const anim = lottie.loadAnimation({
    container: iconEl, // 아이콘 컨테이너 안에 렌더
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: LOTTIE_JSON_PATH,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
      progressiveLoad: true,
    },
  });
  anim.setSubframe(false);

  let totalFrames = 1;
  const setTotalFrames = () => {
    totalFrames =
      (typeof anim.getDuration === 'function'
        ? anim.getDuration(true)
        : anim.totalFrames) || 1;
  };
  anim.addEventListener('data_ready', setTotalFrames);
  anim.addEventListener('DOMLoaded', setTotalFrames);

  // 4) (본 이벤트) 핀 구간: 제목/아이콘 인트로가 끝난 뒤 섹션이 상단에 닿으면 pin하고,
  //    해당 구간에서 Lottie 프레임을 스크러빙. 끝나면 pin 해제되어 다음 섹션으로 자연스레 이동.
  ScrollTrigger.create({
    trigger: section,
    start: 'top top', // 화면 상단에 섹션이 닿으면 pin 시작
    end: '+=200%', // Lottie 스크럽 구간(필요 시 길이 조절)
    scrub: true,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,

    onUpdate: (self) => {
      // 전체 진행도(0~1)를 Lottie 프레임(0~totalFrames-1)에 매핑
      const f = Math.floor(
        gsap.utils.clamp(0, totalFrames - 1, self.progress * (totalFrames - 1))
      );
      anim.goToAndStop(f, true);
    },
  });

  // 5) 안전장치: 아이콘 컨테이너 크기 보정 (height가 0이면 보이지 않음)
  if (iconEl && iconEl.clientHeight === 0) {
    iconEl.style.height = '60vh'; // 필요 시 프로젝트에 맞는 높이로 수정
  }

  // 6) 폰트/이미지 로딩 후 레이아웃 재계산
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();

// ===== Curriculum Dots (멀티 섹션, pin 미사용) — CSS 변수만 애니메이션, --motion-scale 최대 1로 제한 =====
// 요소 CSS 예시:
// [data-js="dot-background-dot-top"],
// [data-js="dot-background-dot-bottom"] {
//   transform: translateY(var(--motion-translateY)) scale(var(--motion-scale));
//   transform-origin: 50% 50%;
//   will-change: transform;
// }
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const DEBUG = false; // markers 보려면 true

  // 유틸
  const baseW = (el) => {
    const dot = el.closest('.dot');
    return (dot && dot.offsetWidth) || el.offsetWidth || window.innerWidth;
  };
  const coverScale = (el, extra = 1.25) => {
    const need = Math.max(window.innerWidth, window.innerHeight) * extra;
    return need / baseW(el);
  };
  const clamp01 = (v) => Math.min(1, Math.max(0, v)); // 0~1로 제한
  const px = (v) => `${Math.round(v)}px`;

  // 컨테이너 자동 수집
  const containers = new Set();
  document
    .querySelectorAll(
      '[data-js="dot-background-section-top"], [data-js="dot-background-section-bottom"]'
    )
    .forEach((el) => {
      containers.add(
        el.closest('.ne-gate-leveltest__inner') ||
          el.closest('.ne-gate-curriculum__inner') ||
          el.closest('.ne-gate-leveltest') ||
          el.closest('.ne-gate-curriculum') ||
          el.parentElement
      );
    });

  containers.forEach((container) => {
    if (!container) return;

    const topSection = container.querySelector(
      '[data-js="dot-background-section-top"]'
    );
    const bottomSection = container.querySelector(
      '[data-js="dot-background-section-bottom"]'
    );
    const topDotSpan = container.querySelector(
      '[data-js="dot-background-dot-top"]'
    );
    const bottomDotSpan = container.querySelector(
      '[data-js="dot-background-dot-bottom"]'
    );

    if (!topSection && !bottomSection) return;

    // 스케일 한계/시작값
    const START_SMALL_DIAMETER = 191; // 위: 작게 시작(지름 px)
    const END_SMALL_DIAMETER = 191; // 아래: 작게 종료(지름 px)
    const TOP_START_SCALE = 0.4; // 참고사이트 초기값

    // Top: 시작/종료 (scale은 최대 1로 clamp)
    const topStartScale = () =>
      clamp01(Math.max(START_SMALL_DIAMETER / baseW(topDotSpan), 0.03));
    const topEndScale = () => clamp01(coverScale(topDotSpan, 1.25));
    const topStartTranslateY = () => -window.innerHeight * 1.3; // 위쪽에서 시작
    const topEndTranslateY = () => 0;

    // Bottom: 시작/종료 (scale은 최대 1로 clamp)
    const bottomStartScale = () => clamp01(coverScale(bottomDotSpan, 1.25));
    const bottomEndScale = () =>
      clamp01(Math.max(END_SMALL_DIAMETER / baseW(bottomDotSpan), 0.06));
    const bottomStartTranslateY = () => 0;
    const bottomEndTranslateY = () => window.innerHeight * 0.9;

    // 초기값: CSS 변수만 세팅
    const setStarts = () => {
      if (topDotSpan) {
        gsap.set(topDotSpan, {
          '--motion-scale': clamp01(TOP_START_SCALE),
          '--motion-translateY': px(topStartTranslateY()),
        });
      }
      if (bottomDotSpan) {
        gsap.set(bottomDotSpan, {
          '--motion-scale': bottomStartScale(),
          '--motion-translateY': px(bottomStartTranslateY()),
        });
      }
    };
    setStarts();

    // Top: 작게(0.1) & 위(-Y) → 크게(≤1) & Y=0
    if (topSection && topDotSpan) {
      gsap.to(topDotSpan, {
        '--motion-scale': () => topEndScale(),
        '--motion-translateY': () => px(topEndTranslateY()),
        ease: 'none',
        scrollTrigger: {
          trigger: topSection,
          start: 'top 100%',
          end: 'bottom 100%',
          scrub: true,
          invalidateOnRefresh: true,
          //markers: true,
        },
        immediateRender: false,
      });
    }

    // Bottom: 크게(≤1) → 작게 + 아래(+Y)
    if (bottomSection && bottomDotSpan) {
      gsap.to(bottomDotSpan, {
        '--motion-scale': () => bottomEndScale(),
        '--motion-translateY': () => px(bottomEndTranslateY()),
        ease: 'none',
        scrollTrigger: {
          trigger: bottomSection,
          start: 'top 0%',
          end: 'bottom 25%',
          scrub: true,
          invalidateOnRefresh: true,
          //markers: true,
        },
        immediateRender: false,
      });
    }

    // 리프레시 시 컨테이너별 초기값 재적용
    ScrollTrigger.addEventListener('refreshInit', setStarts);
  });

  // 전역 리사이즈 대응
  window.addEventListener('resize', () => ScrollTrigger.refresh());
})();

// 각 섹션 내 진행률(0~100%)을 그대로 .ne-gate-nav__toggle-bg 의 left 에 적용
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const nav = document.querySelector('.ne-gate-nav');
  const knob = document.querySelector('.ne-gate-nav-toggle__bg');
  if (!nav || !knob) return;

  const ids = [
    'section00',
    'section01',
    'section02',
    'section03',
    'section04',
    'section05',
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      scrub: false,
      onUpdate: (self) => {
        if (!self.isActive) return;
        const pct = Math.round(self.progress * 100); // 섹션 내부 % (0~100)
        nav.setAttribute('data-scroll-value', `${id}:${pct}%`);
        knob.style.left = `${pct}%`; // ✅ 구간 매핑 없이 그대로 적용
        // 또는 CSS 변수로 넘기고 스타일에서 사용 가능:
        // knob.style.setProperty('--pct', `${pct}%`);

        [...nav.classList].forEach((c) => {
          if (/^ne-gate-nav--section\d{2}$/.test(c)) nav.classList.remove(c);
        });
        nav.classList.add(`ne-gate-nav--${id}`);
      },
      onEnter: () => {
        nav.setAttribute('data-scroll-value', `${id}:0%`);
        knob.style.left = '0%';
      },
      onEnterBack: () => {
        nav.setAttribute('data-scroll-value', `${id}:100%`);
        knob.style.left = '100%';
      },
      onLeave: () => {
        knob.style.left = '100%';
      },
      onLeaveBack: () => {
        knob.style.left = '0%';
      },
    });
  });
})();
