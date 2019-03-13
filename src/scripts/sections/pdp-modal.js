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

    // Disable scrolling of body while modal is active
    bodyScrollLock.disableBodyScroll($modal, {
      allowTouchMove: el => {
        while (el && el !== document.body) {
          if (el.getAttribute('body-scroll-lock-ignore') !== null) {
            return true
          }
          el = el.parentNode
        }
      }
    })
    on(
      select('.js-panel-close', $modal),
      'click',
      e => {
        // Re-enable scrolling of body
        bodyScrollLock.clearAllBodyScrollLocks()

        select('.pdp-modal.active').classList.remove('active')
      }
    )
  })
}
