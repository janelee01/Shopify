import Flickity from 'flickity'
import select from 'dom-select'
import on from 'dom-event'

class ProductForm {
  constructor (el) {
    if (!el) {
      return false
    }
    this.$el = el
    this.$galleries = select.all('.js-pdp-gallery', el)
    this.$variantInput = select('.js-variant-input', el)
    this.$swatches = select.all('.js-pdp-swatch', el)
    this.$sizeWrap = select('.js-variant-buttons-wrap', el)
    this.$addToCartBtn = select('.js-add-to-cart', el)
    this.$colorLabelContainers = select.all('.js-pdp-selected-color', el)
    this.$mobileColorLabelContainer = select('.js-mobile-swatch-label', el)
    this.$quantitySelector = select('.js-add-to-cart-quantity', el)

    this.siblingsJson = window.siblingsJson
    this.hiddenVariants = window.hiddenVariants
    this.stockData = window.variantStockData
    this.productID = window.productID

    this.updateProductID()
    this.bindContexts()
    this.updateDynamicElements()
    this.scrollToYotpo()
    this.attachEventListeners()
    this.initSwatchCarousels()

    $(document).on('pdp.form.size.update', (e, id) => {
      this.variantTitle = (this.variants.find(({ id: _id }) => {
        return '' + id === '' + _id
      }) || {}).title
      this.updateProductID(false, true)
      this.updateDynamicElements()
    })

    $(document).on('pdp.form.size.quantity', (e, quantity) => {
      this.$quantitySelector.value = quantity
    })
  }

  updateDynamicElements () {
    this.updatePrice()
    this.updateCta()
    this.updateLabels()
    this.updateDataLayer()
    this.updateLowStockWarning()
    this.updateFinalSaleMessage()
    this.updateWaitlistMeta()
  }

  /**
   * Ensures that event handlers are bound to
   * point 'this' to this class instance.
   */
  bindContexts () {
    this.onNonSwatchChange = this.onNonSwatchChange.bind(this)
    this.onSwatchChange = this.onSwatchChange.bind(this)
    this.onAddToCart = this.onAddToCart.bind(this)
  }

  /**
   * Updates instance properties that store
   * references to the currently selected product
   * and variant JSON objects.
   *
   * @param {String} id The new Product ID
   */
  updateProductID (id = false, triggerEvent = true) {
    if (id) {
      this.productID = id
    }

    this.variants = this.siblingsJson[this.productID]
      .variants
      .filter(({ id }) => {
        return !~this.hiddenVariants.indexOf(id)
      })

    this.product = this.siblingsJson[this.productID]

    this.updateVariant(null, triggerEvent)
  }

  /**
   * Updates the current variant. This is fired when a swatch
   * changes and also when the user selects a non-swatch option,
   * like the size.
   *
   * @param {String} title The current variant title
   * @param {Boolean} triggerEvent Conditionally fire a change event (For PDP Sticky Header)
   */
  updateVariant (title = '', triggerEvent = true) {
    if (title) {
      this.variantTitle = title
    }

    const index = this.variants.reduce((active, variant, i) => {
      if (this.variantTitle === variant.title) {
        active = i
      }
      return active
    }, 0)

    this.variant = this.variants[index]

    this.updateVariantInput()

    this.variantID = this.variant.id
    this.$variantInput.value = this.variantID

    this.selectVariantOption(index)

    if (triggerEvent) {
      this.triggerVariantUpdateEvent()
    }
  }

  /**
   * Attaches event handlers to the inputs
   * in the product form.
   */
  attachEventListeners () {
    this.$swatches.forEach(el => (
      on(el, 'click', this.onSwatchChange)
    ))
    if (this.$sizeWrap) {
      on(this.$sizeWrap, 'click', this.onNonSwatchChange)
    }
    on(this.$addToCartBtn, 'click', this.onAddToCart)
    on(this.$quantitySelector, 'change', e => {
      $(document).trigger('pdp.form.size.quantity', e.target.value)
    })
  }

  /**
   * Responds to user swatch selections in the
   * product form.
   *
   * @param {Object} e Vanilla event object
   */
  onSwatchChange (e) {
    e.preventDefault()

    const $target = (
      e.target.classList.contains('.js-pdp-swatch')
        ? e.target
        : slate.utils.getClosest(e.target, '.js-pdp-swatch')
    )

    const productID = $target.getAttribute('data-sibling')

    this.$swatches.forEach(el => (
      el.classList.remove('active')
    ))
    $target.classList.add('active')

    this.updateProductID(productID)
    this.updateDynamicElements()
    this.updateURL($target.getAttribute('data-url'))
    this.updateActiveGallery()
    this.updateSwatchCarouselSize()
  }

  /**
   * There is a select input that contains all
   * of the available variant IDs for the product
   * currently on display. Since each color swatch
   * represents an entirely different product, we
   * recreate this dropdown when the user updates
   * their swatch selection.
   */
  updateVariantInput () {
    this.$variantInput.innerHTML = ''

    if (this.$sizeWrap) {
      this.$sizeWrap.innerHTML = ''
    }

    this.variants.forEach(variant => {
      $(this.$variantInput).append(
        `<option value="${variant.id}">${variant.title}</option>`
      )

      $('.js-variant-buttons-wrap').append(
        `<a
          href="#"
          data-id="${variant.id}"
          class="btn btn-secondary variant-option">
          ${variant.title}
        </a>`
      )
    })
  }

  /**
   * Selects the Size option in the form. Used
   * after a new swatch has been selected and these
   * Size button have been regenerated.
   *
   * @param {Integer} index The option to select
   */
  selectVariantOption (index = 0) {
    if (!this.$sizeWrap) {
      return
    }
    const options = select.all('a', this.$sizeWrap)
    if (!options || !options.length) {
      return
    }

    if (options[index]) {
      options[index].classList.add('selected')
    }
  }

  /**
   * Updates the price that is shown to the user.
   * This should be updated everything that the user
   * selects a new option in the product form.
   * This will dynamically show both price and the
   * compare at price.
   */
  updatePrice () {
    const $discount = select('[data-discount-amount]', this.$el)
    const $badges = select.all('.discount-badge, .discount-label', this.$el)
    const $compare = select('.js-compare-price', this.$el)
    const $price = select('.js-product-price', this.$el)

    const {
      compare_at_price: compare = 0,
      price = 0
    } = this.variant

    const formattedCompare = slate.Currency.formatMoney(compare, theme.moneyFormat)
    const formattedPrice = slate.Currency.formatMoney(price, theme.moneyFormat)

    if (Number(compare)) {
      const formated = slate.Currency.formatMoney(compare, theme.moneyFormat)
      $discount.innerHTML = Math.round(100 * (compare - price) / compare)
      $badges.forEach(el => el.classList.remove('is-hidden'))
      $compare.classList.remove('is-hidden')
      $compare.innerHTML = formattedCompare
    } else {
      $compare.classList.add('is-hidden')
      $badges.forEach(el => el.classList.add('is-hidden'))
    }

    $price.innerHTML = formattedPrice.replace('.00', '')
  }

  /**
   * Conditionally shows three different buttons
   * based on the state of the currently selected
   * variant. This updates the big button in the
   * product form.
   */
  updateCta () {
    const selectedVariantID = this.$variantInput.value
    const $soldOutMsg = $('.js-pdp-sold-out-message')
    const $addToCartRow = $('.js-add-to-cart-wrap')
    const $addToCartBtn = $('.js-add-to-cart')
    const $addToWaitlistBtn = $('.js-add-to-wishlist')
    const siblingId = $('.pdp-swatch.active').data('sibling')

    // reset to purchase or waitlist
    $addToCartRow.show()
    $soldOutMsg.hide()

    if (this.variant.available) {
      this.buttonState = 'Add To Cart'
      $addToCartBtn.show()
      $addToWaitlistBtn.hide()
      return
    }

    if (this.stockData[this.variantID].oosPolicy === 'soldout') {
      this.buttonState = 'Sold Out'
      $addToCartRow.hide()
      $soldOutMsg.show()
      return
    }

    this.buttonState = 'Join Waitlist'
    $addToWaitlistBtn.data('variant-id', this.variantID).show()
    $addToCartBtn.hide()

    $('#wl-variant').val(this.variantID)
  }

  /**
   * Updates the color label shown to the user
   * that represents the currently selected
   * swatch.
   *
   * @param {DOM Reference} $swatch Newly selected swatch
   */
  updateLabels () {
    this.$colorLabelContainers.forEach(el => (
      el.innerHTML = ''
    ))
    const $swatch = this.$swatches.find(el => el.classList.contains('active'))
    const $container = slate.utils.getClosest(
      $swatch,
      '.js-pdp-swatches-wrapper'
    )
    const $desktopLabel = select('.js-pdp-selected-color', $container)
    const $desktopLabelBucket = select('.js-pdp-swatch-group-name', $container)

    // Save the label locally so it can be sent to the
    // sticky header later on..
    this.label = select('img', $swatch).getAttribute('data-color-label')
    this.labelBucket = $desktopLabelBucket
      ? $desktopLabelBucket.innerHTML.trim()
      : ''

    if (this.$mobileColorLabelContainer) {
      this.$mobileColorLabelContainer.innerHTML = this.label
    }

    if ($desktopLabel) {
      $desktopLabel.innerHTML = this.label
    }
  }

  /**
   * Handles clicks on the Size variant options in
   * the form. Also caters to the Gift Card PDP
   * which does not have swatches.
   *
   * @param {Object} e Vanilla event object
   */
  onNonSwatchChange (e) {
    if (e.target.nodeName !== 'A') {
      return
    }
    e.preventDefault()
    const $target = e.target

    $('.variant-buttons .validation-error').remove()

    select.all('a', this.$sizeWrap).forEach(el => (
      el.classList.remove('selected')
    ))
    $target.classList.add('selected')

    // We are currently on a Gift Card PDP
    if ($target.classList.contains('gc-option')) {
      const selectedString = this.getSelectedString()
      $(this.$variantInput).find('option').each(() => {
        if ($(this).text().trim() === selectedString) {
          $(this.$variantInput).val($(this).attr('value'))
        }
      })

      return
    }

    this.updateVariant(
      $target.innerHTML.trim()
    )
    this.updateDynamicElements()
  }

  /**
   * Intercepts the form submission if there is not
   * a variant selected in the form.
   */
  onAddToCart () {
    if (!this.$variantInput.value) {
      $('.js-variant-buttons-wrap').append(
        '<div class="validation-error">Please select a size</div>'
      )
      return false
    }
  }

  /**
   * Updates the images shown to the user to be
   * reflective of the currently selected swatch.
   */
  updateActiveGallery () {
    this.$galleries.forEach(el => el.classList.remove('active'))
    this.$galleries.forEach(el => {
      if (el.getAttribute('data-sibling') !== this.productID) {
        return
      }
      el.classList.add('active')

      // Need to ask Derek about this one..
      // dataLayer.push({
      //   'event' : 'galleryNavigation',
      //   'productImage' : active_slide_position
      // })
    })
  }

  /**
   * Updates the current URL. If the user refreshes the page
   * then the user will be able to pick up from where
   * they left off.
   *
   * @param {String} url The url attached to a data attribute
   */
  updateURL (url) {
    if (history.replaceState) {
      const newurl = window.location.protocol + '//' + window.location.host + url
      window.history.replaceState({ path: newurl }, '', newurl)
      sessionStorage.setItem('lo-back-to', newurl) // for use in the cart

      dataLayer.push({
        'event': 'afterUrlUpdate'
      })
    }
  }

  /**
   * Updates the waitlist overlay with current
   * product and variant information.
   *
   * @todo: This needs testing
   */
  updateWaitlistMeta () {
    $('#wl-image').attr('src', this.product.featured_image)

    $('#wl-product').val(this.productID)
    $('#wl-variant').val(this.variantID)

    const swatch = this.label
    const size = $('#variant-buttons .selected').text()

    $('[data-wl-meta]').text(`${swatch} - ${size}`)

    const wlExpected = (variantStockData[this.variantID] || {}).restockMessage

    if (wlExpected) {
      $('[data-wl-expected]').text('Expected in stock: ' + wlExpected)
    } else {
      $('[data-wl-expected]').text('')
    }
  }

  /**
   * Updates the GTM information that is dynamically
   * pushed up when the user interacts with the page.
   */
  updateDataLayer () {
    const dataLayer = window.dataLayer || []
    const selectedSibling = $('.pdp-swatch.active').data('sibling')
    const selectedVariantID = this.$variantInput.value
    for (var i = 0; i < this.variants.length; i++) {
      if (this.variants[i].id === selectedVariantID) {
        const variant = this.variants[i]
        dataLayer.push({
          'event': 'swatchClick',
          'productData.price': variant.price * 0.01,
          'productData.comparePrice': variant.compare_at_price * 0.01,
          'productData.sku': variant.sku,
          'productData.name': this.product.title,
          'productData.variant': variant.title,
          'productData.variantId': selectedVariantID,
          'productData.url': siblingsSupplimentalJson[selectedSibling].url,
          'productData.imageUrl': siblingsSupplimentalJson[selectedSibling].featuredImage,
          'productData.collections': siblingsSupplimentalJson[selectedSibling].collections,
          'pinterestPage': this.product.title
        })
      }
    }
  }

  /**
   * Shows a stock warning notification if there
   * is less than 20 stock items available.
   */
  updateLowStockWarning () {
    const inventoryLevel = Number((variantStockData[this.variantID] || {}).stockLevel)
    const $warning = $('.low-stock-warning')
    if (inventoryLevel > 0 && inventoryLevel <= 20) {
      $warning.removeClass('hidden')
    } else {
      $warning.addClass('hidden')
    }
  }

  /**
   * Shows final sale messaging when there
   * are discontinued products (including the
   * current variant).
   */
  updateFinalSaleMessage () {
    const $warning = $('.final-sale-warning')
    if (window.discontinued.includes(this.variantID)) {
      $warning.removeClass('hidden')
    } else {
      $warning.addClass('hidden')
    }
  }

  getSelectedString () {
    var selectedText = []
    $('.variant-option').each(() => {
      if ($(this).hasClass('selected')) { // selected status get set in swatches.js
        selectedText.push($(this).text().trim())
      }
    })
    return selectedText.join(' / ')
  }

  /**
   * On click, scrolls down to Yotpo reviews
   */
  scrollToYotpo () {
    $('.pdp-main-product-yotpo').click(e => {
      $('html, body').animate({ scrollTop: (
        $('#reviews-widget').offset().top - 200
      ) }, 1000)
    })
  }

  /**
   * On mobile, the swatch groups sit next to
   * each other horizontally and are moved into
   * view by Flickity.
   */
  initSwatchCarousels () {
    const $groupsWrapper = select('.js-pdp-form-option-group--swatches')
    const $groups = select.all('.js-pdp-swatches-wrapper')
    if (!$groupsWrapper || $groups.length <= 1) {
      return
    }
    this.flickity = new Flickity(
      $groupsWrapper, {
        watchCSS: true,
        prevNextButtons: false,
        pageDots: false,
        contain: true,
        freeScroll: true
      })
  }

  /**
   * Since some times will overflow, we need to resize
   * the Flickity viewport whenever the swatch
   * changes.
   */
  updateSwatchCarouselSize () {
    if (this.flickity) {
      this.flickity.resize()
    }
  }

  /**
   * Trigger an event to let other modules know when the
   * active variant has been updated. Wrapped in a setTimeout
   * to make sure that it fires at the end of the call stack.
   */
  triggerVariantUpdateEvent () {
    setTimeout(() => {
      $(document).trigger('pdp.form.variant.change', {
        buttonState: this.buttonState,
        id: this.variantID,
        label: this.label,
        labelBucket: this.labelBucket,
        variant: this.variant,
        product: this.product
      })
    }, 0)
  }
}

export default el => {
  return new ProductForm(el)
}