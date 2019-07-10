import Flickity from 'flickity'
import AsNavFor from 'flickity-as-nav-for'

export default el => {
  if (!el) {
    return false
  }

  const $main = el.querySelector('.js-pdp-callout-gallery')
  const $nav = el.querySelector('.js-pdp-callout-gallery-nav')

  if (!$main) {
    return
  }

  const flktyMain = new Flickity($main, {
    prevNextButtons: false,
    pageDots: false,
    watchCSS: true
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
