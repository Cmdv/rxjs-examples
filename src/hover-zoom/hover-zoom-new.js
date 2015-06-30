'use strict';
/**
 * Created by cmdv on 16/06/15.
 */

import Rx from 'rx';
import $ from 'jquery';

var dw, dh, rw, rh, lx, ly;

var $target = $('.hoverzoom'),
  $flyout = $('<div class="hoverzoom-flyout" />'),
  $link = $target.find('a'),
  $image = $target.find('img'),
  parentDiv = $('.thumbnail'),
  zoom = new Image,
  zoomed = {},

// setting up Observable
  mouseEnter = Rx.Observable.fromEvent($target, 'mouseenter'),
  mouseLeave = Rx.Observable.fromEvent($target, 'mouseleave'),
  targetClick = Rx.Observable.fromEvent($target, 'click');


(function getStarted () {

  var link = $link.attr('href');

  $target.append($flyout);
  $flyout.append(zoom);

  zoom.style.position = 'absolute';
  zoom.src = link;

  zoomed = $(zoom);

})();

// prevent default clicks
var preventDefault = targetClick.subscribe((e) => {
  e.preventDefault();
});

// make sure $flyout is on DOM
var _onEnter = mouseEnter.filter(() => $($flyout).length == 1);


var _entered = _onEnter.map(() => {

    var w1, h1, w2, h2, padding;

    w1 = $target.width();
    h1 = $target.height();

    w2 = $flyout.width();
    h2 = $flyout.height();

    dw = zoomed.width() - w2;
    dh = zoomed.height() - h2;

    rw = dw / w1;
    rh = dh / h1;

    padding = parentDiv.outerWidth();

    $flyout.css({opacity: 1, left: padding, top: -20, width: w1, height: h1});

  }).filter( ()=> zoomed.width() != 0 );



var enterSubscribe = _entered.subscribe(() => {

  zoomed.width() == 0 ? console.log('zero') : console.log('more');

  var mouseMove = Rx.Observable.fromEvent($target, 'mousemove').map((e) =>{
    lx = e.pageX || lx;
    ly = e.pageY || ly;

    var offset = $target.offset(),
      pt = ly - offset.top,
      pl = lx - offset.left,
      xt = Math.ceil(pt * rh),
      xl = Math.ceil(pl * rw),
      top = xt * -1,
      left = xl * -1;

    console.log(xt);
    console.log(xl);

    return {top, left}

  });

  var moveSubscribe = mouseMove.subscribe((a) => {


    zoomed.css({top: a.top, left: a.left})

  });

});


mouseLeave.subscribe(() => {
  console.log('left now');
  $flyout.css({opacity: 0});
});