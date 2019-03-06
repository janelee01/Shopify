import Flickity from 'flickity'
import AsNavFor from 'flickity-as-nav-for'

export default el => {
  if (!el) return

  var $main = el.querySelector('.pdp-testimonials-texts')
  var $nav = el.querySelector('.pdp-testimonials-logos')

  var flkty1 = new Flickity($main)

  var flkty2 = new Flickity($nav, {
    asNavFor: '.pdp-testimonials-texts',
    contain: true,
    pageDots: false
  })
}
