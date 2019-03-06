import 'imageviewer/imageviewer.min'

export default (el, viewers) => {
  if (!el) return
  let x = el

  let viewer

  let thumbOffset = 0
  let thumbSize = 60
  let visibleThumbs = 5
  let visibleArea = thumbSize * visibleThumbs
  let totalThumbs = el.querySelectorAll('.pdp-gallery-thumbs a').length

  let flkty = new Flickity(el.querySelector('.pdp-gallery-mobile'), {
    draggable: '>1',
    groupCells: true
  })

  // thumbsGallery(el.querySelector('.pdp-gallery-thumbs'))

  let $img = el.querySelector('.pdp-gallery-featured img')
  let src = $img.getAttribute('src')

  $img.setAttribute('data-high-res-src', src)
  viewer = ImageViewer($img)

  let variantId = el.getAttribute('data-sibling')

  viewers[variantId] = viewer

  el.querySelector('.pdp-chevron-down').addEventListener(
    'click', e => {
      e.preventDefault()

      if (totalThumbs + thumbOffset - visibleThumbs <= 1) el.querySelector('.pdp-chevron-down').setAttribute('disabled', true)

      if (totalThumbs + thumbOffset - visibleThumbs <= 0) return

      el.querySelector('.pdp-chevron-up').setAttribute('disabled', false)

      thumbOffset--

      let top = (thumbOffset * thumbSize)

      el.querySelector('.pdp-gallery-thumbs-inner').style.top = top + 'px'

      return false
    }
  )

  el.querySelector('.pdp-chevron-up').setAttribute('disabled', true)

  el.querySelector('.pdp-chevron-up').addEventListener(
    'click', e => {
      e.preventDefault()

      if (thumbOffset >= 0) return

      thumbOffset++

      if (thumbOffset === 0) el.querySelector('.pdp-chevron-up').setAttribute('disabled', true)

      el.querySelector('.pdp-chevron-down').setAttribute('disabled', false)

      let top = (thumbOffset * thumbSize)

      el.querySelector('.pdp-gallery-thumbs-inner').style.top = top + 'px'

      return false
    }
  )

  // First thumb should be set to "active" as default
  el.querySelectorAll('.pdp-gallery-thumbs a')[0].classList.add('active')

  el.querySelectorAll('.pdp-gallery-thumbs a').forEach(
    $a => {
      // Add a click event listener to each of the thumbs
      $a.addEventListener(

        'click', e => {
          e.preventDefault()
          let src = $a.getAttribute('data-src')

          if (el.querySelector('.pdp-gallery-thumbs a.active')) el.querySelector('.pdp-gallery-thumbs a.active').classList.remove('active')

          $a.classList.add('active')

          // Run through click event path to search for '.pdp-gallery-featured img'
          e.path.forEach(
            pathElement => {
              if (pathElement.classList && pathElement.classList.contains('pdp-gallery')) {
                viewer.load(src, src)
                viewer.refresh()
              }
            }

          )

          return false
        }
      )
    }
  )
}

function thumbsGallery ($thumbGallery) {
  let thumbOffset = 0
  let thumbSize = 60
  let visibleThumbs = 5
  let visibleArea = thumbSize * visibleThumbs

  $thumbGallery.querySelector('').style.marginTop = marginTop + 'px'
}
