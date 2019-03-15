import select from 'dom-select'
import on from 'dom-event'

export default el => {
  if (!el) {
    return
  }
  const $stickyNavHeader = select('.js-pdp-sticky-nav__header', el)
  const $stickyNavFooter = select('.js-pdp-sticky-nav__footer', el)
  const $stickyNavFooterButton = select('.js-pdp-sticky-nav__footer-buy-now', el)
  const $stickyNavHeaderButton = select('.js-pdp-sticky-nav__header-add-to-cart-button', el)
  const $stickyNavHeaderQty = select('.js-pdp-sticky-nav__header-quantity', el)
  const $swatchLabel = select('.js-dp-sticky-nav__swatch-title', el)
  const $swatchValue = select('.js-dp-sticky-nav__swatch-value', el)
  const $sizeBtnContainer = select('.js-pdp-sticky-nav__header-sizes', el)
  const $sizeBtnWrapper = select('.js-pdp-sticky-nav__header-sizes-wrap', el)

  const hiddenVariants = window.hiddenVariants
  const siblingJSON = window.siblingsJson

  const b = 500 // fixed value for now
  const c = 700 // fixed value for now

  $(document).on('pdp.form.variant.change', (event, {
    label = '',
    labelBucket = '',
    variant = {},
    product = {},
    buttonState = 'Add To Cart'
  }) => {
    const {
      id = ''
    } = variant

    $swatchLabel.innerHTML = labelBucket
    $swatchValue.innerHTML = label

    $sizeBtnContainer.innerHTML = ''
    const variants = (siblingJSON[product.id] || {}).variants
    const isAdded = variants.reduce((oneAdded, v) => {
      const label = ~v.title.indexOf('(')
        ? v.title.replace(/.*\((.*)\)/, '$1')
        : v.title
      if (!~hiddenVariants.indexOf(id) && !/title/i.test(v.title)) {
        $($sizeBtnContainer).append(
          `<a
            href="#"
            data-id="${v.id}"
            class="variant-option">
            ${label}
          </a>`
        )
        oneAdded = true
      }
      return oneAdded
    }, false)

    if (!isAdded) {
      $sizeBtnWrapper.classList.add('hidden')
    } else {
      $sizeBtnWrapper.classList.remove('hidden')

      // Select the current size button
      updateActiveOption(variant.id)
      updateButtonState(buttonState)
    }
  })

  window.addEventListener('scroll', e => {
    const scroll = window.scrollY

    if (scroll > b) {
      if (!$stickyNavHeader.classList.contains('is-active')) {
        $stickyNavHeader.classList.add('is-active')
      }
    } else {
      if ($stickyNavHeader.classList.contains('is-active')) {
        $stickyNavHeader.classList.remove('is-active')
      }
    }

    if (scroll > c) {
      if (!$stickyNavFooter.classList.contains('is-active')) {
        $stickyNavFooter.classList.add('is-active')
      }
    } else {
      if ($stickyNavFooter.classList.contains('is-active')) {
        $stickyNavFooter.classList.remove('is-active')
      }
    }
  })

  // Bind click event to add to cart button
  on($stickyNavHeaderButton, 'click',
    event => {
      const state = event.target.innerHTML.trim()
      if (/Wait/i.test(state)) {
        select('button.js-add-to-wishlist').click()
        return
      }
      if (/Sold Out/i.test(state)) {
        return
      }

      select('button.js-add-to-cart').click()
    }
  )

  // Bind click event to add to cart button
  on($stickyNavFooterButton, 'click',
    event => {
      $('body, html').animate({ scrollTop: 0 }, 'slow')
    }
  )

  // Bind change event to select quantity
  on($stickyNavHeaderQty, 'change',
    event => {
      let qty = event.target.value
      $(document).trigger('pdp.form.quantity.set', qty)
    }
  )

  on($sizeBtnWrapper, 'click', e => {
    e.preventDefault()
    const id = e.target.getAttribute('data-id')
    updateActiveOption(id)
    $(document).trigger('pdp.form.size.update', id)
  })

  const updateActiveOption = id => {
    const btns = select.all('a', $sizeBtnWrapper)
    btns.forEach(el => {
      const _id = el.getAttribute('data-id')
      if ('' + _id === '' + id) {
        el.classList.add('selected')
      } else {
        el.classList.remove('selected')
      }
    })
  }

  const updateButtonState = state => {
    $stickyNavHeaderButton.innerHTML = state
  }

  // Event listener for quantity field
  $(document).on('pdp.form.quantity.set', (e, [qty]) => {
    select('.js-add-to-cart-quantity').value = qty
  })

  $(document).on('pdp.form.size.update', (event, id) => {
    updateActiveOption(id)
  })
}
