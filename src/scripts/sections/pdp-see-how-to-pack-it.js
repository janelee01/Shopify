export default el => {
  // Add in module JS code here

  el.querySelector('.pdp-see-how-to-pack-it-video').addEventListener(

    'click',

    e => {
      e.preventDefault()

      var $videoWrapper = el.querySelector('.pdp-see-how-to-pack-it-video')
      var $video = el.querySelector('video')

      if ($videoWrapper.classList.contains('playing')) {
        $videoWrapper.classList.remove('playing')
        $video.pause()
      } else {
        $videoWrapper.classList.add('playing')
        $video.play()
      }

      return false

      // e.preventDefault()

      // let $a = e.target

      // let dataModal = $a.getAttribute('data-modal')

      // let modalId = `pdp-modal-${dataModal}`

      // let $modal = document.getElementById(modalId)

      // if (!$modal) return console.warn(`modal id ${modalId} not found!`)

      // $modal.classList.add('active')

      // $modal.querySelector('.panel-close').addEventListener(

      //   'click',

      //   e => {
      //     document.querySelector('.pdp-modal.active').classList.remove('active')
      //   }

      // )
    }
  )
}
