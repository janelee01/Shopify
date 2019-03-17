import select from 'dom-select'

export default el => {
  const $widget = select('.js-instagram-widget', el)

  let interval = false

  const yotpoActive = () => {
    return !!select('.yotpo-single-image-container')
  }

  const showYotpo = () => {
    clearTimeout(interval)
    setTimeout(() => {
      $widget.classList.remove('is-hidden')
    }, 500)
  }

  const conditionallyShow = () => {
    if (yotpoActive()) {
      showYotpo()
    } else {
      interval = setTimeout(conditionallyShow, 500)
    }
  }

  conditionallyShow()
}
