import Swiper from 'swiper';
import { Scrollbar, EffectFade } from 'swiper/modules';
import { fabric } from 'fabric';

//get parameters

const iframeUrl = new URL(window.location)
const landing = document.querySelector('.landing_sections')
let themeParametr = iframeUrl.searchParams.get('is_dark')


function onResize() {
  const width = document.documentElement.offsetWidth
  const height = document.documentElement.offsetHeight

  window.parent.postMessage({
    type: 'resize',
    detail: { width, height }
  }, '*')
}

function onThemeChange() {
  if(themeParametr === 'true'){
      landing.classList.add('landing--body--dark')
  }else{
      landing.classList.add('landing--body--light')
  }
}

//events

window.addEventListener('load', onResize)
window.addEventListener('load', onThemeChange)
window.addEventListener('resize', onResize)

export {onResize};

///swiper

// const constructorSwiper = new Swiper('.constructor_module_item_slider', {
//   slidesPerView: 1,
//   allowTouchMove: false,
//   observer: true,
//   observeParents: true,
//   observeSlideChildren: true
// })


