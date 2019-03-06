import Flickity from 'flickity'
import AsNavFor from 'flickity-as-nav-for'

export default el => {
  const $main = el.querySelector('.pdp-product-features-carousel-main')
  const $nav = el.querySelector('.pdp-product-features-carousel-nav')

  const flktyMain = new Flickity($main, {
    prevNextButtons: false,
    pageDots: false,
    contain: true
  })

  const flktyNav = new Flickity($nav, {
    asNavFor: $main,
    contain: true,
    pageDots: false
  })

  flktyNav.on('change', (index) => {
    setTimeout(() => {
      if (flktyMain.selectedIndex !== index) {
        flktyMain.select(index)
      }
    }, 0)
  })
}
