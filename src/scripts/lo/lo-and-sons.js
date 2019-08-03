var LS = LS || window.LS || {};
var dataLayer = window.dataLayer || [];

LS.getHeader = function(){
  var $ = jQuery;
  return $('#site-header');
}
LS.getPageNav = function(){
  var $ = jQuery;
  return $('.page-nav');
}
LS.getScrollTo = function(el, offset){
  return el.offset().top;
  // return el.offset().top - offset - 30; // offset added to accomodate fixed header plus a little extra for space below header after the scroll
};
LS.isTransparentHeader = function(){
  return $('body').hasClass('has-tw-header') || $('body').hasClass('has-tb-header');
}

// we only want to report video watched events once per page to not over-report
var reported25 = false;
var reported50 = false;
var reported75 = false;
var reported100 = false;

LS.tabletBreakpoint = 768;
LS.desktopBreakpoint = 1025;
LS.largeBreakpoint = 1400;
LS.galleries = [];

LS.reportVideoProgress = function(currentTime, duration){
  var completed = currentTime/duration;
  if( completed >= 0.25 && !reported25 ){
    reported25 = true;
    dataLayer.push({
      'event' : 'videoProgress',
      'videoProgress' : 25
    });
  }else if( completed >= 0.5 && !reported50 ){
    reported50 = true;
    dataLayer.push({
      'event' : 'videoProgress',
      'videoProgress' : 50
    });
  }else if( completed >= 0.75 && !reported75 ){
    reported75 = true;
    dataLayer.push({
      'event' : 'videoProgress',
      'videoProgress' : 75
    });
  }else if( completed == 0 && !reported100 ){ // first update will be > 0, so when we hit 0 again, the video finished and started over
    reported100 = true;
    dataLayer.push({
      'event' : 'videoProgress',
      'videoProgress' : 100
    });
  }
};

LS.isDevSite = function(){
  var host = window.location.hostname;
  if( host.indexOf('.dev') !== -1 || host.indexOf('electric') !== -1 ){
    return true;
  }

  return false;
}

LS.haveAnalytics = function(){
  return typeof ga !== 'undefined';
};

LS.haveFbTracking = function(){
  return typeof fbq !== 'undefined';
};

LS.havePinterestTracking = function(){
  return typeof pintrk !== 'undefined';
};

LS.haveSegment = function(){
  return typeof analytics !== 'undefined';
};
LS.segmentTrack = function(eventName, data){
  if( LS.isDevSite() ){
    // console.log('SEGMENT DEBUG :: ' + eventName, data);
  }else{
    analytics.track(eventName, data);
  }
};

LS.toggleGalleryControls = function($gallery){
  var $ = jQuery;
  var $parent = $gallery.parent('.product-gallery');
  var itemsWidth = 0;
  $gallery.find('.item').each(function(){
    itemsWidth = itemsWidth + $(this).width();
  });
  if( itemsWidth < $(window).width() ){
    $parent.addClass('is-singular');
  }else{
    $parent.removeClass('is-singular');
  }
};

LS.overlay = {
  open: function(){
    var $ = jQuery;
    $('#overlay').fadeIn(300);
  },
  close: function(){
    var $ = jQuery;
    $('#overlay').fadeOut(300);
  }

};

LS.linkImagesToVideos = function(){
  var $ = jQuery;
  $('.has-video').on('click', function(e){
      e.preventDefault();
      LS.productVideoOpen($(this).data('video-id'));
  });
};

LS.productVideoOpen = function(videoId){
  var $ = jQuery;
  var $container = $('#product-video-container');
  var dataLayer = window.dataLayer || [];
  var embedCode = ''

  // video{n}Embed variables are defined in /app/design/frontend/lo-rwd/default/template/catalog/product/view.phtml
  switch(videoId){
    case 2:
      embedCode = video2Embed;
    break;
    case 3:
      embedCode = video3Embed;
    break;
    case 4:
      embedCode = video4Embed;
    break;
    case 5:
      embedCode = video5Embed;
    break;
    case 6:
      embedCode = video6Embed;
    break;
    default:
      embedCode = video1Embed;
    break;
  }

  // embed it
  $container.prepend(embedCode);
  var $iframe = $container.find('iframe');

  // set the width to a value that makes the height of the embed 80% of the window height,
  // then convert that width to a percentage of the window width so it scales,
  // but only when that size isn't wider than the current window
  var iframeEmbedWidth = $iframe.attr('width');
  var ratio = ( $(window).height() * 0.8 ) / $iframe.attr('height');
  // console.log(iframeEmbedWidth * ratio, $(window).width());
  if( iframeEmbedWidth * ratio > $(window).width() ){
    $container.css('width', '100%');
  }else{
    $container.css('width', ((iframeEmbedWidth * ratio) / $(window).width()) * 100 +'%' );
  }

  // responsify it now that we have its size defined
  $container.fitVids();

  // show it
  $('#product-video').fadeIn();

  // center it in the window, do this after the fade in so the height is available. The user shouldn't see the shift.
  $container.css('margin-top', '-'+($container.outerHeight()/2)+'px' );

  // use the vimeo API to auto-play
  // NOTE: iOS doesn't allow js to auto-play media, so the user will still have to click play.
  var player = new Vimeo.Player($iframe[0]);

  // only attempt the auto play for desktop. Vimeo changed something so autoplay attempts will leave the video in a paused state.
  if( $(window).width() >= LS.desktopBreakpoint ){
    player.play();
  }

  player.on('play', function(data){
      player.getVideoTitle().then(function(title) {
        dataLayer.push({
          'event' : 'videoStart',
          'videoName' : title
        });
      }).catch(function(error) {
        console.log(error);
      });
  });
  player.on('ended', function(data){
      player.getVideoTitle().then(function(title) {
        LS.reportVideoProgress(0,1);// pass 0 as current time to indicate 100% watched
          dataLayer.push({
            'event' : 'videoEnd',
            'videoName' : title
          });
      }).catch(function(error) {
        console.log(error);
      });
  });
  player.on('timeupdate',function(data){
    LS.reportVideoProgress(data.seconds,data.duration);
  });
};

LS.productVideoClose = function(){
  var $ = jQuery;
  $('#product-video').fadeOut();
    $('#product-video .fluid-width-video-wrapper').remove(); // have to destroy the video for iOS
};

LS.isElementInViewport = function(el) {
    var rect = el.getBoundingClientRect();
    return (
        // rect.top >= 0 &&
        // rect.left >= 0 &&
        rect.bottom >= 0 && // if bottom < 0, element has scrolled out of view
        // rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */

        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
};

// dynamically calculate our page jump position based on fixed element visibility
LS.setJumpHeight = function(jumpHeight){
  $('#jumpheight').remove();
  $('head').append('<style id="jumpheight">.jumptarget::before{height:' + jumpHeight + 'px;margin-top:-' + jumpHeight + 'px}</style>');
}


