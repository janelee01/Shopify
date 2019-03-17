import Flickity from 'flickity'
import select from 'dom-select'

export default el => {
  if (!el) return
  var $main = select('.js-pdp-material-images', el)
  var $nav = select('.js-pdp-material-tiles', el)
  let n = 0

  let flkty1 = new Flickity($main, {
    pageDots: true,
    prevNextButtons: false
  })

  select.all('.js-pdp-material-tile', el).forEach(
    $tile => {
      $tile.setAttribute('data-index', n++)

      if (n === 1) $tile.classList.add('is-selected')

      $tile.addEventListener(
        'click',
        e => {
          const n = parseInt($tile.getAttribute('data-index'))
          const $selected = select('.js-pdp-material-tile.is-selected', el)
          if ($selected) {
            $selected.classList.remove('is-selected')
          }
          $tile.classList.add('is-selected')
          flkty1.select(n)
        }
      )
    }
  )
}
