$(document).ready(function(){
  if( $('.product-row-bar').length ){
    $('.product-row-bar').each(function(){
      var $productRow = $(this).prev('.product-row');
      var $handle = $(this).find('.handle');
      var $sampleItem = $productRow.find('.item').first();
      var naturalWidth = $sampleItem.outerWidth() * $productRow.find('.item').length; 
      var availableWidth = $productRow.outerWidth();
      if( $(window).outerWidth() < LS.tabletBreakpoint ){
        var mobileGutter = Number($sampleItem.css('padding-left').replace('px',''));
        availableWidth = availableWidth - mobileGutter; // reduce the actual scrolling amount by the gutters
      }
      // how many pixels are we hanging off the side
      var amountToScroll = naturalWidth - availableWidth;
      // how far does the handle need to move
      var handleAmountToScroll = availableWidth - $handle.outerWidth(); 
      $productRow.on('scroll', function(){
        // of the distance we need to scroll, how far have we gone?
        var percentScrolled = $productRow.scrollLeft()/amountToScroll;
        // apply this progress how far the handle should move
        var translateAmt = percentScrolled * handleAmountToScroll;
        $handle.css('transform', 'translate3d(' + translateAmt + 'px, 0, 0)');
      });
    });
  }
});