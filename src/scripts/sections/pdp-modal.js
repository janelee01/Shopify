export default el => {
  // Add in module JS code here

  el.addEventListener(

    'click',

    e => {
      e.preventDefault()

      let $a = e.target

      let dataModal = $a.getAttribute('data-modal')

      let modalId = `pdp-modal-${dataModal}`

      let $modal = document.getElementById(modalId)

      if (!$modal) return console.warn(`modal id ${modalId} not found!`)

      $modal.classList.add('active')

      $modal.querySelector('.panel-close').addEventListener(

        'click',

        e => {
          document.querySelector('.pdp-modal.active').classList.remove('active')
        }

      )
    }
  )
}
