import axios from 'axios';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';


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

// swiper
const swipers = document.querySelectorAll(".bf_swiper_category_products");

swipers.forEach((swiperElement, index) => {
  const nextButton = swiperElement.querySelector(`.swiper-button-next-${index}`);
  const prevButton = swiperElement.querySelector(`.swiper-button-prev-${index}`);

  if (nextButton && prevButton) {
    new Swiper(swiperElement, {
      modules: [Navigation],
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      spaceBetween: 16,
      breakpoints: {
        448: {
          slidesPerView: 1,
        },
        688: {
          slidesPerView: 3,
        },
        952: {
          slidesPerView: 4,
        },
        1000: {
          slidesPerView: 5,
        },
      },
    });
  } else {
    console.error("Навигационные кнопки не найдены для Swiper:", swiperElement);
  }
});

//get && set products data

document.addEventListener("DOMContentLoaded", () => {

  const products = document.querySelectorAll(".product-card");

  products.forEach((productElement) => {
    const productSlug = productElement.dataset.productSlug;
    const apiUrl = `https://api.gelius.ua/api/v1/p/${productSlug}/?lang=uk`;

    axios
      .get(apiUrl)
      .then((response) => {
        const data = response.data._source;

        const nameElement = productElement.querySelector(".product-card__name");
        const imageLinkElement = productElement.querySelector(".product-card__image");
        const imageElement = productElement.querySelector(".q-img__image");
        const basePriceElement = productElement.querySelector(".base-price__price");
        const oldPriceBlock = productElement.querySelector(".base-price__old-price");
        const oldPriceValue = productElement.querySelector(".base-price__old-price-value");
        const badgeElement = productElement.querySelector(".app-badge__inner");

        if (nameElement) nameElement.textContent = data.name;
        if (imageElement) imageElement.src = `https://media.gelius.ua${data.base_image}`;
        if (nameElement) nameElement.href = `https://gelius.ua/p/${data.slug}`;
        if (imageLinkElement) imageLinkElement.href = `https://gelius.ua/p/${data.slug}`;

          basePriceElement.textContent = `${data.rrc_price.toFixed()} грн`;

          if (data.old_rrc_price && data.rrc_price < data.old_rrc_price) {
            basePriceElement.classList.add("text-discount");
            oldPriceBlock.classList.add("active");

            if (oldPriceValue) {
              oldPriceValue.textContent = `${data.old_rrc_price.toFixed()} грн`;
            }

            if (badgeElement) {
              const discountPercent = Math.round(((data.old_rrc_price - data.rrc_price) / data.old_rrc_price) * 100);
              badgeElement.textContent = `-${discountPercent}%`;
            }
          } else {
            basePriceElement.classList.remove("text-discount");
            oldPriceBlock.classList.remove("active");
          }

        onResize();
      })
      .catch((error) => {
        console.error(`Ошибка при загрузке данных для товара ${productSlug}:`, error);
      });
  });
});

//add to card buttons event

function addToCart(productSlug) {

  const apiUrl = `https://api.gelius.ua/api/v1/p/${productSlug}/?lang=uk`;

  axios
    .get(apiUrl)
    .then((response) => {
      const data = response.data._source;

      const ProductId = data.id;
      const ProductModification = data.modification;
      const ProductSeries = data.series;
      const ProductName = data.name_uk;
      const ProductPrice = data.rrc_price;
      const ProductOldPrice = data.old_rrc_price;
      const ProductSlug = data.slug;
      const ProductImage = data.base_image;
      const ProductStock = data.rest > 0;
      const ProductCategory = data.category_mptt.slug;

      window.parent.postMessage({
        type: 'addToCart', 
        detail: {
          id: ProductId,
          ref: {
            modification: ProductModification,
            series: ProductSeries
          },
          name: ProductName,
          price: ProductPrice,
          oldPrice: ProductOldPrice,
          slug: ProductSlug,
          image: ProductImage,
          inStock: ProductStock,
          category: ProductCategory
        }
      }, '*')

    })
    .catch((error) => {
      console.error(`Ошибка при загрузке данных для товара ${productSlug}:`, error);
    });
}

const addToCartButtons = document.querySelectorAll(".product-card__action-button");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productSlug = button.closest('.product-card').dataset.productSlug;
      addToCart(productSlug);
    });
  });



