import Flickity from 'flickity'
import AsNavFor from 'flickity-as-nav-for'

export default el => {
  const $main = el.querySelector('.js-pdp-callout-gallery')
  const $nav = el.querySelector('.js-pdp-callout-gallery-nav')

  const flktyMain = new Flickity($main, {
    prevNextButtons: false,
    pageDots: false,
    freeScroll: true
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
