import select from 'dom-select'
import on from 'dom-event'

export default e => {
  const $stickyNavHeader = select('.js-pdp-sticky-nav__header')
  const $stickyNavFooter = select('.js-pdp-sticky-nav__footer')
  const $stickyNavHeaderButton = select('.js-pdp-sticky-nav__header-add-to-cart-button', $stickyNavHeader)
  const $stickyNavHeaderQty = select('.js-pdp-sticky-nav__header-quantity', $stickyNavHeader)

  const b = 500 // fixed value for now
  const c = 700 // fixed value for now

  window.addEventListener(
    'scroll',
    function (e) {
      var scroll = this.scrollY

      if (scroll > b) {
        if (!$stickyNavHeader.classList.contains('is-active')) $stickyNavHeader.classList.add('is-active')
      } else {
        if ($stickyNavHeader.classList.contains('is-active')) $stickyNavHeader.classList.remove('is-active')
      }

      if (scroll > c) {
        if (!$stickyNavFooter.classList.contains('is-active')) $stickyNavFooter.classList.add('is-active')
      } else {
        if ($stickyNavFooter.classList.contains('is-active')) $stickyNavFooter.classList.remove('is-active')
      }
    }
  )

  // Bind click event to add to cart button
  on($stickyNavHeaderButton, 'click',
    event => {
      select('button.js-add-to-cart').click()
    }
  )

  // Bind change event to select quantity
  on($stickyNavHeaderQty, 'change',
    event => {
      let qty = event.target.value
      $(document).trigger('pdp.form.quantity.set', qty)
    }
  )

  // Event listener for quantity field
  $(document).on('pdp.form.quantity.set', (e, [qty]) => {
    select('.js-add-to-cart-quantity').value = qty
  })
}
