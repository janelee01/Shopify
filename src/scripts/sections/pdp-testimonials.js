import Flickity from 'flickity'

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
