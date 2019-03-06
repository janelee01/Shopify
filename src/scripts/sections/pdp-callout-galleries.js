import Flickity from 'flickity'

export default el => {
  var $main = el.querySelector('.pdp-product-features-carousel-main')
  var $nav = el.querySelector('.pdp-product-features-carousel-nav')

  var flktyMain = new Flickity($main, {
    prevNextButtons: false,
    pageDots: false,
    contain: true
  })

  var flktyNav = new Flickity($nav, {
    asNavFor: $main,
    contain: true,
    pageDots: false
  })
}
