import 'imageviewer/imageviewer.min'

export default (el, viewers) => {
  // Add in module JS code here

  let x = el

  var viewer

  var thumbOffset = 0
  var thumbSize = 60
  let visibleThumbs = 5
  let visibleArea = thumbSize * visibleThumbs

  var flkty = new Flickity(el.querySelector('.pdp-gallery-mobile'), {
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

      thumbOffset--

      let top = (thumbOffset * thumbSize)

      el.querySelector('.pdp-gallery-thumbs-inner').style.top = top + 'px'

      return false
    }
  )

  el.querySelector('.pdp-chevron-up').addEventListener(
    'click', e => {
      e.preventDefault()

      if (thumbOffset >= 0) return

      thumbOffset++

      let top = (thumbOffset * thumbSize)

      el.querySelector('.pdp-gallery-thumbs-inner').style.top = top + 'px'

      return false
    }
  )

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
  var thumbOffset = 0
  var thumbSize = 60
  let visibleThumbs = 5
  let visibleArea = thumbSize * visibleThumbs

  $thumbGallery.querySelector('').style.marginTop = marginTop + 'px'
}
