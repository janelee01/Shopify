$(document).ready(function(){
  const setData = function (data, columnIndex) {
    for (let index = 0; index < data.length; index++) {
      let key = data[index][0];
      let value = data[index][1];
      $('[data-key="' + key + '"').children().eq(columnIndex).html(value);
    }
  };

  let defaultProductKey = window.comparisonData['default'];
  $('.comparison-options').eq(0).val(defaultProductKey);
  setData(window.comparisonData[defaultProductKey],1);
  
  $('.comparison-options').on('change',function(){
    var productKey = $(this).val();
    if ($(this).val() in window.comparisonData) {
      setData(window.comparisonData[productKey],$(this).closest('td').index());
    }
  });
});
