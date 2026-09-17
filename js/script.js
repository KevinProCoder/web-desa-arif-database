document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     NAVBAR
  ========================================================= */

  const nav = document.getElementById("navbar");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navLinks");
  const backTop = document.getElementById("backTop");

  function updateNavbar() {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 30);
    }

    if (backTop) {
      backTop.classList.toggle("show", window.scrollY > 500);
    }

    let current = "beranda";

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;

      if (top <= 140) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return;
      }

      const target = href.slice(1);

      link.classList.toggle("active", target === current);
    });
  }

  window.addEventListener("scroll", updateNavbar, {
    passive: true
  });

  updateNavbar();


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

      const opened = navMenu.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        opened ? "true" : "false"
      );

    });

    navLinks.forEach((link) => {

      link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =========================================================
     BACK TO TOP
  ========================================================= */

  if (backTop) {

    backTop.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }


  /* =========================================================
     SCROLL REVEAL ANIMATION
  ========================================================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  if (
    revealElements.length &&
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              observer.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach((el, index) => {

      el.style.transitionDelay =
        `${Math.min(index % 5, 4) * 60}ms`;

      revealObserver.observe(el);

    });

  } else {

    revealElements.forEach((el) => {
      el.classList.add("visible");
    });

  }


  /* =========================================================
     STATISTIC COUNTER
  ========================================================= */

  let countersStarted = false;

  const statsSection =
    document.getElementById("statistik");

  if (
    statsSection &&
    "IntersectionObserver" in window
  ) {

    const counterObserver =
      new IntersectionObserver(
        (entries) => {

          if (
            entries[0].isIntersecting &&
            !countersStarted
          ) {

            countersStarted = true;

            document
              .querySelectorAll(".counter")
              .forEach((counter) => {

                const target =
                  Number(
                    counter.dataset.target || 0
                  );

                let current = 0;

                const duration = 1100;

                const start =
                  performance.now();

                function tick(now) {

                  const progress =
                    Math.min(
                      (now - start) /
                      duration,
                      1
                    );

                  const eased =
                    1 -
                    Math.pow(
                      1 - progress,
                      3
                    );

                  current =
                    Math.floor(
                      eased * target
                    );

                  counter.textContent =
                    current.toLocaleString(
                      "id-ID"
                    );

                  if (progress < 1) {

                    requestAnimationFrame(
                      tick
                    );

                  }

                }

                requestAnimationFrame(tick);

              });

          }

        },
        {
          threshold: 0.35
        }
      );

    counterObserver.observe(statsSection);

  }


  /* =========================================================
     HERO CAROUSEL
  ========================================================= */

  const heroSlides =
    [...document.querySelectorAll(".hero-slide")];

  const heroDots =
    [...document.querySelectorAll(".dot")];

  const prevBtn =
    document.querySelector(".hero-prev");

  const nextBtn =
    document.querySelector(".hero-next");


  if (heroSlides.length) {

    let currentSlide = 0;

    let autoSlide = null;


    function showSlide(index) {

      currentSlide =
        (index + heroSlides.length) %
        heroSlides.length;


      heroSlides.forEach((slide, idx) => {

        slide.classList.toggle(
          "active",
          idx === currentSlide
        );

      });


      heroDots.forEach((dot, idx) => {

        dot.classList.toggle(
          "active",
          idx === currentSlide
        );

      });

    }


    function startAutoSlide() {

      if (autoSlide) {
        clearInterval(autoSlide);
      }

      autoSlide = setInterval(() => {

        showSlide(currentSlide + 1);

      }, 4000);

    }


    function stopAutoSlide() {

      if (autoSlide) {

        clearInterval(autoSlide);

        autoSlide = null;

      }

    }


    /* Previous */

    if (prevBtn) {

      prevBtn.addEventListener(
        "click",
        () => {

          showSlide(currentSlide - 1);

          startAutoSlide();

        }
      );

    }


    /* Next */

    if (nextBtn) {

      nextBtn.addEventListener(
        "click",
        () => {

          showSlide(currentSlide + 1);

          startAutoSlide();

        }
      );

    }


    /* Dots */

    heroDots.forEach((dot, idx) => {

      dot.addEventListener(
        "click",
        () => {

          showSlide(idx);

          startAutoSlide();

        }
      );

    });


    /* Pause ketika mouse berada di carousel */

    const hero =
      document.querySelector(".hero");

    if (hero) {

      hero.addEventListener(
        "mouseenter",
        stopAutoSlide
      );

      hero.addEventListener(
        "mouseleave",
        startAutoSlide
      );

    }


    /* Touch / Swipe untuk mobile */

    let touchStartX = 0;
    let touchEndX = 0;

    if (hero) {

      hero.addEventListener(
        "touchstart",
        (event) => {

          touchStartX =
            event.changedTouches[0].screenX;

        },
        {
          passive: true
        }
      );


      hero.addEventListener(
        "touchend",
        (event) => {

          touchEndX =
            event.changedTouches[0].screenX;

          const difference =
            touchStartX - touchEndX;


          if (Math.abs(difference) < 50) {
            return;
          }


          if (difference > 0) {

            showSlide(
              currentSlide + 1
            );

          } else {

            showSlide(
              currentSlide - 1
            );

          }

          startAutoSlide();

        },
        {
          passive: true
        }
      );

    }


    /* Tampilkan slide pertama */

    showSlide(0);

    startAutoSlide();

  }


  /* =========================================================
     LEAFLET MAP
  ========================================================= */

  function initMap() {

    const mapElement =
      document.getElementById("map");


    /*
       Jika halaman tidak mempunyai map,
       hentikan fungsi tanpa error.
    */

    if (!mapElement) {
      return;
    }


    /*
       Pastikan Leaflet sudah tersedia.
    */

    if (typeof L === "undefined") {

      console.error(
        "Leaflet belum dimuat. Pastikan leaflet.js dipanggil sebelum scripts.js."
      );

      return;

    }


    /*
       Jangan membuat map dua kali.
    */

    if (mapElement._leaflet_id) {

      console.warn(
        "Leaflet map sudah diinisialisasi."
      );

      return;

    }


    /* Koordinat Dusun Semparuk Sutera */

    const latitude = 1.1829;
    const longitude = 109.0723;

    const center = [
      latitude,
      longitude
    ];


    /* =====================================================
       BUAT MAP
    ===================================================== */

    const map = L.map(
      mapElement,
      {
        center: center,
        zoom: 14,

        zoomControl: true,

        scrollWheelZoom: true,

        dragging: true,

        attributionControl: true,

        doubleClickZoom: true,

        boxZoom: true,

        keyboard: true,

        touchZoom: true
      }
    );


    /* =====================================================
       OPENSTREETMAP TILE
    ===================================================== */

    const tileLayer =
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,

          minZoom: 5,

          attribution:
            "&copy; OpenStreetMap contributors",

          updateWhenIdle: false,

          updateWhenZooming: true,

          keepBuffer: 4
        }
      );


    tileLayer.addTo(map);


    /* =====================================================
       CUSTOM MARKER
    ===================================================== */

    const customIcon =
      L.divIcon({

        className:
          "custom-map-marker",

        html: `
          <div class="map-pin">
            <div class="map-pin-dot"></div>
          </div>
        `,

        iconSize: [
          30,
          30
        ],

        iconAnchor: [
          15,
          15
        ],

        popupAnchor: [
          0,
          -15
        ]

      });


    const marker =
      L.marker(
        center,
        {
          icon: customIcon
        }
      ).addTo(map);


    /* =====================================================
       POPUP
    ===================================================== */

    marker.bindPopup(`
      <div class="map-popup">

        <h3>
          Semparuk Sutera
        </h3>

        <p>
          <strong>Kecamatan:</strong><br>
          Semparuk
        </p>

        <p>
          <strong>Kabupaten:</strong><br>
          Sambas
        </p>

        <p>
          <strong>Provinsi:</strong><br>
          Kalimantan Barat
        </p>

        <p>
          <strong>Negara:</strong><br>
          Indonesia
        </p>

        <small>
          Koordinat:<br>
          ${latitude}° N,
          ${longitude}° E
        </small>

      </div>
    `);


    /* =====================================================
       FIX UKURAN MAP
    ===================================================== */

    function refreshMap() {

      if (!map) {
        return;
      }

      map.invalidateSize({
        animate: false,
        pan: false
      });

    }


    /* =====================================================
       MAP READY
    ===================================================== */

    map.whenReady(() => {

      /*
         Tunggu sebentar agar CSS/layout
         selesai dihitung browser.
      */

      setTimeout(() => {

        refreshMap();

        map.setView(
          center,
          14,
          {
            animate: false
          }
        );

      }, 100);


      setTimeout(() => {

        refreshMap();

      }, 500);


      setTimeout(() => {

        refreshMap();

        marker.openPopup();

      }, 1000);

    });


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener(
      "resize",
      refreshMap,
      {
        passive: true
      }
    );


    /* =====================================================
       WINDOW LOAD
    ===================================================== */

    window.addEventListener(
      "load",
      () => {

        setTimeout(
          refreshMap,
          200
        );

        setTimeout(
          refreshMap,
          700
        );

        setTimeout(
          refreshMap,
          1500
        );

      },
      {
        passive: true
      }
    );


    /* =====================================================
       RESIZE OBSERVER
       Ini bagian penting untuk mengatasi
       map yang rusak ketika container berubah ukuran.
    ===================================================== */

    if (
      "ResizeObserver" in window
    ) {

      const resizeObserver =
        new ResizeObserver(() => {

          setTimeout(
            refreshMap,
            100
          );

        });


      resizeObserver.observe(
        mapElement
      );

    }


    /* =====================================================
       VISIBILITY CHANGE
       Berguna jika user berpindah tab browser.
    ===================================================== */

    document.addEventListener(
      "visibilitychange",
      () => {

        if (!document.hidden) {

          setTimeout(
            refreshMap,
            200
          );

        }

      }
    );


    /* =====================================================
       FIX SAAT MAP BERADA DI SECTION
    ===================================================== */

    setTimeout(
      refreshMap,
      2000
    );


    /*
       Simpan instance map agar
       bisa digunakan jika diperlukan.
    */

    window.semparukMap = map;

  }


  /* =========================================================
     START MAP
  ========================================================= */

  initMap();


  /* =========================================================
     FOOTER YEAR
  ========================================================= */

  const yearElement =
    document.getElementById("year");

  if (yearElement) {

    yearElement.textContent =
      new Date().getFullYear();

  }


  /* =========================================================
     LIGHTBOX ZOOM FOR DETAIL IMAGES
  ========================================================= */

  const detailHero = document.querySelector('.detail-hero');
  let zoomTrigger = document.querySelector('.zoom-trigger');
  let lightbox = document.getElementById('lightbox');
  let lightboxClose = document.querySelector('.lightbox-close');

  if (detailHero) {
    const heroImage = getComputedStyle(detailHero).backgroundImage;
    const match = heroImage.match(/url\(["']?(.*?)['"]?\)/i);
    const imageUrl = match ? match[1] : '';

    if (!zoomTrigger) {
      zoomTrigger = document.createElement('button');
      zoomTrigger.type = 'button';
      zoomTrigger.className = 'zoom-trigger';
      zoomTrigger.setAttribute('aria-label', 'Perbesar foto');
      zoomTrigger.textContent = '⤢';
      detailHero.appendChild(zoomTrigger);
    }

    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.className = 'lightbox';
      lightbox.setAttribute('aria-hidden', 'true');

      const lightboxMedia = document.createElement('div');
      lightboxMedia.className = 'lightbox-media';

      lightboxClose = document.createElement('button');
      lightboxClose.type = 'button';
      lightboxClose.className = 'lightbox-close';
      lightboxClose.setAttribute('aria-label', 'Tutup gambar');
      lightboxClose.textContent = '×';

      const lightboxImg = document.createElement('img');
      lightboxImg.alt = 'Gambar full layar';

      lightboxMedia.appendChild(lightboxClose);
      lightboxMedia.appendChild(lightboxImg);
      lightbox.appendChild(lightboxMedia);
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');
    if (lightboxImg && imageUrl) {
      lightboxImg.src = imageUrl;
    }

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    zoomTrigger.addEventListener('click', () => {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    lightboxClose = lightbox.querySelector('.lightbox-close');
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});