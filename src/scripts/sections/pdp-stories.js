import Flickity from 'flickity'
import AsNavFor from 'flickity-as-nav-for'

export default el => {
  var flkty = new Flickity(el, {
    draggable: '>1',
    groupCells: true,
    contain: true,
    watchCSS: true
  })
}
