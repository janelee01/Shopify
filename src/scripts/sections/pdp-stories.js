import Flickity from 'flickity'

export default el => {
  if (!el) return
  var flkty = new Flickity(el, {
    draggable: '>1',
    groupCells: true,
    contain: true,
    watchCSS: true,
    pageDots: false,
    prevNextButtons: false,
    freeScroll: true
  })
}
