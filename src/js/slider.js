const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const buttonLeft = document.querySelector('.slider__btn--left');
  const buttonRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  let maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, idx) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${idx}"></button>`
      );
    });
  };

  const activateDot = function (currentSlide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (currentSlide) {
    slides.forEach(
      (slide, idx) =>
        (slide.style.transform = `translateX(${100 * (idx - currentSlide)}%)`)
      // -100%, 0%, 100%, 200%
    );
  };

  let idInterval;

  const startInterval = function (callback) {
    idInterval = setInterval(callback, 5000);
  };

  const resetInterval = function (id) {
    clearInterval(id);
  };

  const init = function () {
    createDots();
    activateDot(currentSlide);
    goToSlide(currentSlide);
    startInterval(nextSlide);
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
    resetInterval(idInterval);
    startInterval(nextSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
    resetInterval(idInterval);
    startInterval(nextSlide);
  };

  init();

  // Event handlers
  buttonRight.addEventListener('click', nextSlide);
  buttonLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') prevSlide();
    if (e.key === 'ArrowLeft') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
      resetInterval(idInterval);
      startInterval(nextSlide);
    }
  });
};

export default slider;
