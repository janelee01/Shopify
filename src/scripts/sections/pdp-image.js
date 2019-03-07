import on from 'dom-event'
import Layzr from 'layzr.js'

// Check if object fit is supported
let objectFit = false
for (let prop in document.documentElement.style) {
  if (/object(?:-f|F)it$/.test(prop)) {
    objectFit = true
    break
  }
}

// Setup LazyLoad
const instance = Layzr({
  normal: 'data-normal',
  retina: 'data-retina',
  srcset: 'data-srcset',
  threshold: 0
})

instance
  .on('src:before', image => {
    on(image, 'load', (event) => {
      let wrapper = image.parentNode
      wrapper.classList.add('is-loaded')
    })
  })

const objectFitShim = (el) => {
  // We'll compare the aspect ratio of media items with the aspect ratio of the parent container to decide how
  const elAspect = el.clientHeight / el.clientWidth
  const elMediaItems = el.querySelectorAll('img,video')

  // We need to hide overflow for the shim to properly replicate object-fit:cover
  el.style.overflow = 'hidden'

  // Grab each media-item and adjust its class-names
  for (var i = 0; i < elMediaItems.length; i++) {
    let mediaItem = elMediaItems[i]
    let mediaAspect = mediaItem.clientHeight / mediaItem.clientWidth
    let mediaClass = mediaItem.getAttribute('data-js-class')

    mediaItem.className = mediaItem.className.replace(mediaClass, mediaClass + '--shim')

    setTimeout(() => { // TODO: how to handle transforms
      // add a class to some things that can make them transform
    }, 10)

    // Establish which edge of the mdia will hit container last (horizontal or vertical)
    // This is used specifically for the object-fit:cover shim, but both max-width:100%
    // and max-height:100% are necessary (and already established) for the
    // object-fit:contain shim, so why build the logic to scope it?
    if (mediaAspect <= elAspect) {
      mediaItem.style.maxWidth = '100%'
    }
    if (mediaAspect > elAspect) {
      mediaItem.style.maxHeight = '100%'
    }
  }
}
export default (el) => {
  instance
    .update()
    .check()
    .handlers(true)

  if (objectFit) {
    return
  }

  objectFitShim(el)
}
