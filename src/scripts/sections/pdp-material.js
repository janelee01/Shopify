import Flickity from 'flickity'

export default el => {
  if (!el) return
  var $main = el.querySelector('.js-pdp-material-images')
  var $nav = el.querySelector('.js-pdp-material-tiles')
  let n = 0

  let flkty1 = new Flickity($main, {
    pageDots: true,
    prevNextButtons: false
  })

  el.querySelectorAll('.js-pdp-material-tile').forEach(
    $tile => {
      $tile.setAttribute('data-index', n++)

      if (n === 1) $tile.classList.add('is-selected')

      $tile.addEventListener(
        'click',
        e => {
          let n = parseInt($tile.getAttribute('data-index'))
          if (el.querySelector('.js-pdp-material-tile.is-selected')) el.querySelector('.js-pdp-material-tile.is-selected').classList.remove('is-selected')
          $tile.classList.add('is-selected')
          flkty1.select(n)
        }
      )
    }
  )
}
