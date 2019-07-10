import select from 'dom-select'
import on from 'dom-event'

/**
 * Adds a class to a DOM Node.
 *
 * @param {*} item
 * @param {*} selector
 */
export const set = (item, selector) => {
  if (item instanceof Array) {
    for (let i of item) {
      i.classList.add(selector)
    }
  } else {
    item.classList.add(selector)
  }
}

const initVideo = (el) => {
  let video = select('video', el)

  if (video) {
    let src = video.getAttribute('data-src')

    video.setAttribute('src', src)
    video.onloadeddata = () => {
      updateVideo(video, el)
      on(window, 'resize', () => {
        updateVideo(video, el)
      })
    }
    video.oncanplaythrough = () => {
      set(el, 'is-loaded')
    }
  }

  set(el, 'is-init')
}

const getRatio = (el) => {
  return el.offsetHeight / el.offsetWidth
}

const updateVideo = (video, container) => {
  if (getRatio(video) > getRatio(container)) {
    video.style.height = 'auto'
    video.style.width = '100%'
  } else {
    video.style.height = '100%'
    video.style.width = 'auto'
  }
}

export default el => {
  if (!el.classList.contains('is-init')) {
    initVideo(el)
  }
}
