import Flickity from 'flickity'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default.js'
import select from 'dom-select'
import on from 'dom-event'

const testURL = 'https://cdn.shopify.com/s/files/1/2185/1497/products/front-brookline-nylon-black-gold-lavender-tote-lo-and-sons_ca96bb20-154e-4c8c-a46a-9790951556e8.jpg'

class ProductGallery {
  constructor (el) {
    this.$el = el
    this.$thumbs = select.all('.js-pdp-gallery-thumbs a', el)
    this.$thumbsContainer = select('.js-pdp-thumbs-container', el)
    this.$mobileCarousel = select('.js-pdp-gallery-mobile', el)
    this.$featuredImg = select('.js-pdp-gallery-featured img', el)
    this.$arrowUp = select('.js-gallery-up', el)
    this.$arrowDown = select('.js-gallery-down', el)
    this.$swipeTemplate = select('.js-pswp')

    this.thumbOffset = 0
    this.thumbSize = 45
    this.visibleThumbs = 5
    this.visibleArea = this.thumbSize * this.visibleThumbs
    this.totalThumbs = this.$thumbs.length
    this.variantId = this.$el.getAttribute('data-sibling')

    this.setBindings()
    this.setListeners()
    this.setInitStates()
    this.initResponsiveSlider()

    $(document).on('pdp.galleries.resize', () => {
      this.flkty.resize()
    })
  }

  setBindings () {
    this.onThumbClick = this.onThumbClick.bind(this)
  }

  setListeners () {
    this.$thumbs.forEach(el => (
      on(el, 'click', this.onThumbClick)
    ))
    on(this.$arrowUp, 'click', e => {
      e.preventDefault()
      this.updateThumbScroller('up')
    })
    on(this.$arrowDown, 'click', e => {
      e.preventDefault()
      this.updateThumbScroller('down')
    })
    on(this.$featuredImg, 'click', e => {
      this.initPhotoSwipe()
    })
    on(this.$mobileCarousel, 'click', e => {
      this.initPhotoSwipe()
    })
  }

  setInitStates () {
    this.$thumbs[0].classList.add('active')
    this.$arrowUp.setAttribute('disabled', true)
  }

  updateThumbScroller (direction = 'down') {
    if (direction === 'up') {
      if (this.thumbOffset >= 0) {
        return
      }
      if (!this.thumbOffset) {
        this.$arrowUp.setAttribute('disabled', true)
      }
      this.thumbOffset++
      this.$arrowDown.setAttribute('disabled', false)
    } else {
      this.$arrowUp.setAttribute('disabled', false)
      if (this.totalThumbs + this.thumbOffset - this.visibleThumbs <= 0) {
        return
      }
      this.thumbOffset--
    }

    this.$thumbsContainer.style.top = (
      `${(this.thumbOffset * this.thumbSize)}px`
    )
  }

  onThumbClick (e) {
    e.preventDefault()
    const target = slate.utils.getClosest(e.target, 'a')
    this.$thumbs.forEach(el => el.classList.remove('active'))
    target.classList.add('active')
    this.$featuredImg.src = target.getAttribute('data-src')
  }

  initResponsiveSlider () {
    this.flkty = new Flickity(this.$mobileCarousel, {
      draggable: '>1',
      groupCells: true,
      contain: true
    })
  }

  initPhotoSwipe () {
    const _ = this
    const el = document.querySelector('.pswp')
    const index = this.$thumbs.reduce((active, el, i) => {
      if (el.classList.contains('active')) {
        active = i
      }
      return active
    }, 0)

    const items = this.$thumbs.map(el => (
      ~document.location.href.indexOf('test')
        ? {
          msrc: el.getAttribute('data-small'),
          src: testURL,
          w: 1500,
          h: 1500
        } : {
          msrc: el.getAttribute('data-small'),
          src: el.getAttribute('data-src'),
          w: el.getAttribute('data-width'),
          h: el.getAttribute('data-height')
        }
    ))

    this.photoSwipe = new PhotoSwipe(
      this.$swipeTemplate,
      PhotoSwipeUI,
      items,
      {
        index,
        showHideOpacity: true,
        showAnimationDuration: 500,
        loop: false,
        history: false,
        closeOnVerticalDrag: false,
        allowPanToNext: false,
        pinchToClose: false,
        errorMsg: '<p class="pswp__error-msg">Error Message..</p>',
        getDoubleTapZoom (e, t) {
          return e ? 1.6 : t.initialZoomLevel < 0.7 ? 1 : 1.33
        },
        getThumbBoundsFn (e) {
          const scrollTop = (window.pageYOffset || document.documentElement.scrollTop)
          const rect = _.$featuredImg.getBoundingClientRect()

          return {
            x: rect.left,
            y: rect.top + scrollTop,
            w: rect.width
          }
        }
      }
    )

    on(
      select('.js-pswp-left'),
      'click',
      () => this.photoSwipe.prev()
    )
    on(
      select('.js-pswp-close'),
      'click',
      () => this.photoSwipe.close()
    )
    on(
      select('.js-pswp-right'),
      'click',
      () => this.photoSwipe.next()
    )

    this.photoSwipe.init()
  }
}

export default (el) => new ProductGallery(el)
