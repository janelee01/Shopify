import on from 'dom-event'
import select from 'dom-select'

export default el => {
  on(el, 'click', (e) => {
    e.preventDefault()
    const $a = e.target
    const dataModal = $a.getAttribute('data-modal')
    const modalId = `pdp-modal-${dataModal}`
    const $modal = document.getElementById(modalId)

    if (!$modal) return console.warn(`modal id ${modalId} not found!`)

    $modal.classList.add('active')

    on(
      select('.js-panel-close', $modal),
      'click',
      e => {
        select('.pdp-modal.active').classList.remove('active')
      }
    )
  })
}
