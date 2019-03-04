// import Flickity from 'flickity'

export default el => {
  // 1st carousel, main

  // Add in module JS code here
  // el.classList.add('wilcho');
  // element argument can be a selector string
  // for an individual  element

  var $main = el.querySelector('.pdp-testimonials-texts')
  var $nav = el.querySelector('.pdp-testimonials-logos')

  var flkty1 = new Flickity($main)

  var flkty2 = new Flickity($nav, {
    asNavFor: '.pdp-testimonials-texts',
    contain: true,
    pageDots: false
  })
}
