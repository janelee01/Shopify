import select from 'dom-select'
import on from 'dom-event'

class ProductForm {
  constructor (el) {
    this.$el = el
    this.$galleries = select.all('.js-pdp-gallery', el)
    this.$variantInput = select('.js-variant-input', el)
    this.$swatches = select.all('.js-pdp-swatch', el)
    this.$nonSwatchInputs = select.all('.js-pdp-non-swatch-input', el)
    this.$addToCartBtn = select('.js-add-to-cart', el)
    this.$colorLabelContainers = select.all('.js-pdp-selected-color', el)

    this.json = JSON.parse(
      select('[data-product-json]').innerHTML.trim()
    )
    this.siblingsJson = window.siblingsJson

    this.productID = ''

    this.bindContexts()
    this.updateWaitlistMeta()
    this.updateLowStockWarning()
    this.updateFinalSaleMessage()
    this.scrollToYotpo()
    this.attachEventListeners()
  }

  bindContexts () {
    this.onNonSwatchChange = this.onNonSwatchChange.bind(this)
    this.onSwatchChange = this.onSwatchChange.bind(this)
    this.onVariantChange = this.onVariantChange.bind(this)
    this.onAddToCart = this.onAddToCart.bind(this)
  }

  updateProductID (id) {
    this.productID = id
    this.variants = this.siblingsJson[id].variants
    this.product = this.siblingsJson[id]
  }

  attachEventListeners () {
    this.$nonSwatchInputs.forEach(el => (
      on(el, 'click', this.onNonSwatchChange)
    ))
    this.$swatches.forEach(el => (
      on(el, 'click', this.onSwatchChange)
    ))
    on(this.$variantInput, 'change', this.onVariantChange)
    on(this.$addToCartBtn, 'click', this.onAddToCart)
  }

  onSwatchChange (e) {
    e.preventDefault()

    const $target = e.target
    const productID = $target.getAttribute('data-sibling')
    const label = select('img', $target).getAttribute('data-color-label')

    this.updateProductID(productID)
    this.updateVariantInput()
    this.updatePricing(productID)
    this.updateCta()
    this.updateDataLayer()
    this.updateURL(url)
    this.updateLowStockWarning()
    this.updateFinalSaleMessage()
    this.updateWaitlistMeta()
    this.updateActiveProduct(target)
    this.updateLabels($target)

    this.$swatches.forEach(el => (
      el.classlist.removeClass('active')
    ))
    $target.classlist.add('active')
  }

  updateVariantInput () {
    this.$variantInput.innerHTML = ''
    $('.js-variant-buttons-wrap').html('')
    this.variants.forEach(variant => {
      $(this.$variantInput).append(
        `<option value="${variant.id}">${variant.title}</option>`
      )

      // hidden variants??
      if (!~hiddenVariants.indexOf(variant.id)) {
        $('.js-variant-buttons-wrap').append(
          `<a
            href="#"
            data-id="${variant.id}"
            class="btn btn-secondary variant-option">
            ${variant.title}
          </a>`
        )
      }
    })
  }

  updateLabels ($swatch) {
    this.colorLabelContainers.forEach(el = (el.innerHTML = ''))
    const $container = slate.utils.getClosest($swatch, '.js-pdp-swatches')
    select('.js-pdp-selected-color', $container).innerHTML = label
  }

  /**
   * Replace options in our Size selector. hard coded for single option variants
   * Reselect the size, or use the first option
   */
  updateSizeSelection ($target) {
    const currentSize = $('.js-variant-buttons-wrap .selected').text()
    let sizeFound = false
    $('.js-variant-buttons-wrap .btn').each(() => {
      if ($(this).text() !== currentSize) {
        return
      }
      sizeFound = true
      $target.click()
    })
    if (!sizeFound) {
      $('.js-variant-buttons-wrap .btn').first().click()
    }
  }

  onNonSwatchChange (e) {
    e.preventDefault()
    const $target = e.target

    $('.variant-buttons .validation-error').remove()

    $btn.closest('.variant-buttons').find('.variant-option').removeClass('selected')
    $btn.addClass('selected')

    if (!$(this).hasClass('gc-option')) { // size attributes
      $variants.find('option').each(() => {
        if ($(this).text().trim() === $btn.text()) {
          $variants.val($(this).attr('value'))
          $variants.trigger('change')
        }
      })

      $('#wl-variant').val($variants.val())

      this.updateCta()
      this.updateDataLayer()
      this.updateWaitlistMeta()
      this.updateLowStockWarning()
      this.updateFinalSaleMessage()
    } else { // gift card options
      const selectedString = getSelectedString()
      $variants.find('option').each(() => {
        if ($(this).text().trim() === selectedString) {
          $variants.val($(this).attr('value'))
        }
      })
      // update the featured image and hidden image field
      for (let i = 0; i < productJson.variants.length; i++) {
        if (productJson.variants[i].id === this.$variantInput.value) {
          const variantImage = productJson.variants[i].featured_image.src
          $('[data-product-featured-image]').attr('src', variantImage)
          $('[data-variant-image]').val(variantImage)
        }
      };
    }
  }

  onVariantChange () {
    this.updatePricing(
      $('.pdp-swatch.active').data('sibling')
    )
  }

  onAddToCart () {
    if (!this.$variantInput.value) {
      $('.js-variant-buttons-wrap').append('<div class="validation-error">Please select a size</div>')
      return false
    }
  }

  updateActiveGallery () {
    this.$galleries.forEach(el => el.classlist.remove('active'))
    this.$galleries.forEach(el => {
      if (el.getAttribute('data-sibling') !== this.siblingId) {
        return
      }
      el.classlist.add('active')

      // Need to ask Derek about this one..
      // dataLayer.push({
      //   'event' : 'galleryNavigation',
      //   'productImage' : active_slide_position
      // })
    })
  }

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

  updatePrice (siblingId) {
    const $discount = select('[data-discount-amount]', this.$el)
    const $badges = select.all('.discount-badge, .discount-label', this.$el)
    const $compare = select('.js-compare-price', this.$el)
    const $price = select('.js-product-price', this.$el)

    const variant = this.siblingsJson[siblingId].variants.find(variant => {
      return '' + variant.id === '' + this.variantInput.value
    })

    const {
      compare_at_price: compare = 0,
      price = 0
    } = variant

    const formattedCompare = slate.Currency.formatMoney(compare, theme.moneyFormat)
    const formattedPrice = slate.Currency.formatMoney(price, theme.moneyFormat)

    if (Number(compare)) {
      const formated = slate.Currency.formatMoney(compare, theme.moneyFormat)
      $discount.innerHTML = Math.round(100 * (compare - price) / compare)
      $badges.forEach(el => el.classlist.remove('is-hidden'))
      $compare.classlist.remove('is-hidden')
      $compare.innerHTML = formattedCompare
    } else {
      $compare.classlist.add('is-hidden')
      $badges.forEach(el => el.classlist.add('is-hidden'))
    }

    $price.innerHTML = formattedPrice.replace('.00', '')
  }

  updateCta () {
    const selectedVariantID = this.$variantInput.value
    const $soldOutMsg = $('#sold-out-message')
    const $addToCartRow = $('#add-to-cart')
    const $addToCartBtn = $('[data-add-to-cart]')
    const $addToWaitlistBtn = $('[data-add-to-waitlist]')
    const siblingId = $('.pdp-swatch.active').data('sibling')
    // reset to purchase or waitlist
    $addToCartRow.show()
    $soldOutMsg.hide()

    for (var i = 0; i < this.variants.length; i++) {
      if (this.variants[i].id === selectedVariantID) {
        if (this.variants[i].available) {
          // can buy
          $addToCartBtn.show()
          $addToWaitlistBtn.hide()
        } else {
          if (variantStockData[selectedVariantID].oosPolicy === 'soldout') {
            // can't buy
            $addToCartRow.hide()
            $soldOutMsg.show()
          } else {
            // can buy later
            $addToWaitlistBtn.data('variant-id', selectedVariantID).show()
            $addToCartBtn.hide()
            $('#wl-variant').val(selectedVariantID)
          }
        }
      }
    };
  }

  updateWaitlistMeta () {
    $('#wl-image').attr('src', this.product.featured_image)
    $('#wl-product').val(this.productID)
    const wlMeta = [$('#current-option span').text()]
    if ($('#variant-buttons ').length) {
      wlMeta.push(
        $('#variant-buttons .selected').text()
      )
    }
    $('[data-wl-meta]').text(wlMeta.join(' - '))

    const variant = this.$variantInput.value
    const wlExpected = variantStockData[variant].restockMessage
    if (wlExpected) {
      $('[data-wl-expected]').text('Expected in stock: ' + wlExpected)
    } else {
      $('[data-wl-expected]').text('')
    }
  }

  updateDataLayer () {
    const dataLayer = window.dataLayer || []
    const selectedSibling = $('.pdp-swatch.active').data('sibling')
    const selectedVariantID = this.$variantInput.value
    for (var i = 0; i < siblingsJson[selectedSibling].variants.length; i++) {
      if (siblingsJson[selectedSibling].variants[i].id === selectedVariantID) {
        dataLayer.push({
          'event': 'swatchClick',
          'productData.price': siblingsJson[selectedSibling].variants[i].price * 0.01,
          'productData.comparePrice': siblingsJson[selectedSibling].variants[i].compare_at_price * 0.01,
          'productData.sku': siblingsJson[selectedSibling].variants[i].sku,
          'productData.name': siblingsJson[selectedSibling].title,
          'productData.variant': siblingsJson[selectedSibling].variants[i].title,
          'productData.variantId': selectedVariantID,
          'productData.url': siblingsSupplimentalJson[selectedSibling].url,
          'productData.imageUrl': siblingsSupplimentalJson[selectedSibling].featuredImage,
          'productData.collections': siblingsSupplimentalJson[selectedSibling].collections,
          'pinterestPage': siblingsJson[selectedSibling].title
        })
      }
    }
  }

  updateLowStockWarning () {
    const variant = this.$variantInput.value
    const inventoryLevel = variantStockData[variant].stockLevel
    const $warning = $('.low-stock-warning')
    if (inventoryLevel > 0 && inventoryLevel <= 20) {
      $warning.addClass('shown')
    } else {
      $warning.removeClass('shown')
    }
  }

  updateFinalSaleMessage () {
    const variant = this.$variantInput.value
    const $warning = $('.final-sale-warning')
    if (discontinued.includes(variant)) {
      $warning.addClass('shown')
    } else {
      $warning.removeClass('shown')
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
}

export default el => {
  return new ProductForm(el)
}
