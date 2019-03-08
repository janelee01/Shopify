import Flickity from 'flickity'

export default el => {
  var flkty = new Flickity(el, {
    draggable: '>1',
    groupCells: true,
    contain: true,
    watchCSS: true,
    pageDots: false,
    prevNextButtons: false
  })
}
