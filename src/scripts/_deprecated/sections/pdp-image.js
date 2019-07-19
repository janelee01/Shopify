import on from 'dom-event'
import select from 'dom-select'
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
  if (!el) {
    return false
  }
  // We'll compare the aspect ratio of media items with the aspect ratio of the parent container to decide how
  const elAspect = el.clientHeight / el.clientWidth
  const elMediaItem = select('img', el)
  const src = elMediaItem.getAttribute('data-normal') || elMediaItem.getAttribute('src')
  const mediaClass = elMediaItem.getAttribute('data-js-class')

  elMediaItem.classList.add('hidden')

  el.style.backgroundImage = `url(${src})`
  el.classList.add('lazy-img--shim')
}
export default () => {
  instance
    .update()
    .check()
    .handlers(true)

  if (objectFit) {
    return
  }

  select.all('.js-lazy-img').forEach(el => {
    objectFitShim(el)
  })
}
