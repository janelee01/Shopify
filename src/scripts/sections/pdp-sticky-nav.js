export default e => {
  const $pdp = document.querySelector('.pdp-form')

  var viewportOffset = $pdp.getBoundingClientRect()
  var offsetHeight = $pdp.offsetHeight
  var _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight
  const $body = document.querySelector('body')
  const a = document.querySelector('#add-to-cart').offsetTop
  // var left = viewportOffset.left

  document.querySelector('.pdp-sticky-nav-footer button').addEventListener(
    'click',
    e => {
      e.preventDefault()
    }
  )

  // console.log('top')

  var b = document.querySelector('#add-to-cart').offsetTop
  console.log(scroll + ' === ' + b)

  window.addEventListener(
    'scroll',
    function (e) {
      var scroll = this.scrollY
      // var top = $pdp.offsetHeight

      b = document.querySelector('#add-to-cart').offsetTop

      if (scroll > b) {
        if (!$body.classList.contains('pdp-sticky-nav-footer-on')) $body.classList.add('pdp-sticky-nav-footer-on')
      } else {
        if ($body.classList.contains('pdp-sticky-nav-footer-on')) $body.classList.remove('pdp-sticky-nav-footer-on')
      }

      // console.log(viewportOffset)
    }
  )
}
