/*
 * Highcharts Defer Animate
 * Highcharts plugin to defer initial series animation until the element has appeared
 *
 * Requires: jQuery.appear (https://github.com/morr/jquery.appear)
 *
 * @version 1.0.0
 * @author  Torstein Honsi
 */
(function(H) {

  function deferAnimate(proceed, init) {

    var series = this, 
        $renderTo = $(this.chart.container.parentNode);
    
    // Prevent pre-rendering without animation
    if(init) {
      series.group.hide();
    }
    
    // Prepare for animation
    if(init) {
      $renderTo.appear(); // Initialize appear plugin
      proceed.call(this, init);
    
    // It is appeared, run animation
    } 
    else if($renderTo.is(':appeared')) {
      proceed.call(series);
      series.group.show();
        
    // It is not appeared, halt animation until appear
    } 
    else  {
      $renderTo.on('appear', function() {
        if(!series.animated) { 
          proceed.call(series);
          series.group.show();
          series.animated = true;
        }
      });
    }
  };
  
  H.wrap(H.Series.prototype, 'animate', deferAnimate);
  H.wrap(H.seriesTypes.column.prototype, 'animate', deferAnimate);
  H.wrap(H.seriesTypes.pie.prototype, 'animate', deferAnimate);
    
}(Highcharts));