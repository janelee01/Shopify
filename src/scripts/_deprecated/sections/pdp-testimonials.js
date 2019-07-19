import Flickity from 'flickity'
import AsNavFor from 'flickity-as-nav-for'

export default el => {
  if (!el) return

  const $main = el.querySelector('.js-pdp-testimonials-texts')
  const $nav = el.querySelector('.js-pdp-testimonials-logos')

  if (!$main) {
    return
  }

  const flkty1 = new Flickity($main, {
    pageDots: false,
    prevNextButtons: false
  })

  const flkty2 = new Flickity($nav, {
    asNavFor: '.js-pdp-testimonials-texts',
    pageDots: false,
    prevNextButtons: false
  })

  flkty2.on('change', (index) => {
    setTimeout(() => {
      if (flkty1.selectedIndex !== index) {
        flkty1.select(index)
      }
    }, 0)
  })
}
