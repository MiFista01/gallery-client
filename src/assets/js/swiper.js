function initSwiper(element, thumb = null, mouse = true) {
  let swiperOptions = { effect: "coverflow", mousewheel: mouse, loop: true };
  if (thumb) {
    swiperOptions.controller = {
      control: thumb,
    };
  }
  const swiper = new Swiper(element, swiperOptions);
  return swiper;
}
