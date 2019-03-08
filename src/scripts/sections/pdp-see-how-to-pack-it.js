import video from '../sections/pdp-video'
import select from 'dom-select'

export default el => {
  const $video = select('.js-video', el)
  video($video)
}
