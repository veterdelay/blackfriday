import Swiper from 'swiper';
import { Scrollbar } from 'swiper/modules';


const swiper = new Swiper('.item_slider', {})
const swiperSmall = new Swiper('.slider_imgs', {
  modules: [Scrollbar],
  slidesPerView: 'auto',
  spaceBetween: 0,
  freeMode: true,
  scrollbar: {
    el: ".swiper-scrollbar",
    hide: false,
    draggable: true
  },
})

window.addEventListener('resize', function(){
  swiperSmall.setTranslate();
});

let slides = document.querySelectorAll('.imgs_slide');

slides.forEach((button, index) => {
    button.addEventListener('click', function(){
        slides.forEach((button) => {
            button.classList.remove('active');
        });
        button.classList.add('active');
        swiper.slideTo(index);
    });
});

swiper.on('slideChange', function () {
    slides.forEach((button, index) => {
      button.classList.remove('active');
      if(index === this.activeIndex){
        button.classList.add('active');
      }
    });
});

