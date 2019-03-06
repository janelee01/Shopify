import Flickity from 'flickity'
import select from 'dom-select'

export default el => {
  const container = select('.js-container', el)
  const flkty = new Flickity(container, {
    draggable: '>1',
    groupCells: true
  })
}
