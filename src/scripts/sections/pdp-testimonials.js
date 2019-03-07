import Flickity from 'flickity'
import AsNavFor from 'flickity-as-nav-for'

export default el => {
  if (!el) return

  const $main = el.querySelector('.pdp-testimonials-texts')
  const $nav = el.querySelector('.pdp-testimonials-logos')

  const flkty1 = new Flickity($main)

  const flkty2 = new Flickity($nav, {
    asNavFor: '.pdp-testimonials-texts',
    pageDots: false
  })

  flkty2.on('change', (index) => {
    setTimeout(() => {
      if (flkty1.selectedIndex !== index) {
        flkty1.select(index)
      }
    }, 0)
  })
}
