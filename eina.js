var eina = {
  
  vp: function()
  // eina.vp()
  // 
  // Get viewport dimensions
  // Return object {
  //   w: int, viewport width
  //   h: int, viewport width
  // }
  {
  	var w = window, d = document, e = d.documentElement, b = d.getElementsByTagName('body')[0],
  		x = w.innerWidth||e.clientWidth||b.clientWidth,
  		y = w.innerHeight||e.clientHeight||b.clientHeight
  	return { w: x, h: y }
  },
  
	offset: function( _o )
	// eina.offset( _o )
	// 
	// Calculate element document offset
	// Parameter:
	//   _o: element
	// Returns object {
	//   l: offset left
	//   t: offset top
	// }
	// http://www.quirksmode.org/js/findpos.html
	{
		var l = t = 0
		if( _o.offsetParent) {
		  do {
		  			l += _o.offsetLeft
		  			t += _o.offsetTop
		  } while (_o = _o.offsetParent)
		  return { l:l, t:t }
		}
	},
  
  retina: function()
  // eina.retina()
  // 
  // Check for retina resolution
  // Returns boolean
  {
    return window.devicePixelRatio > 1
  },
  
  video: function()
  // eina.video()
  // 
  // Check for HTML5 native video support
  // Returns object {
  //   mpeg4: boolean
  //   h264:  boolean
  //   ogg:   boolean
  //   webm:  boolean
  // }
  // For each video type true if supported, false if not
  // 
  // http://stackoverflow.com/questions/7451635/how-to-detect-supported-video-formats-for-the-html5-video-tag
  {
    var v = document.createElement('video'),
        r = { 
          mpeg4: undefined, 
          h264:  undefined, 
          ogg:   undefined, 
          webm:  undefined 
        }
    
    if( v.canPlayType ){
      
      // Check for MPEG-4 support
      r.mpeg4 = v.canPlayType( 'video/mp4; codecs="mp4v.20.8"' )
  
      // Check for h264 support
      r.h264 = ( v.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )
              || v.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) )
  
      // Check for Ogg support
      r.ogg = v.canPlayType( 'video/ogg; codecs="theora"' )
  
      // Check for Webm support
      r.webm = v.canPlayType( 'video/webm; codecs="vp8, vorbis"' )
    }
    return r
  },
  
  autoplay: function( _e )
  // eina.autoplay( _e)
  // 
  // Check for HTML5 native video autoplay support
  // Parameter
  //   _e: function to call if video supports autoplay
  {
    var v = document.querySelector('video[autoplay]')
    if( v ){
      v.addEventListener( 'playing', function(){
        v.removeEventListener( 'playing' )
        _e()
      }, false )
    }
    else 
      return undefined
  },
  
  addClass: function( el, className )
  // eina.addClass( el, className )
  // 
  // Add class to element
  // Paramenters
  //   el:        element
  //   className: class
  {
    if (el.classList)
      el.classList.add(className)
    else
      el.className += ' ' + className
  },
  
  hasClass: function( el, className )
  // eina.hasClass( el, className )
  // 
  // Check if element has class
  // Paramenters
  //   el:        element
  //   className: class
  // Returns boolean
  {
    if (el.classList)
      el.classList.contains(className)
    else
      new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
  },
  
  removeClass: function( el, className )
  // eina.removeClass( el, className )
  // 
  // Remove class from element
  // Paramenters
  //   el:        element
  //   className: class
  {
    if (el.classList)
      el.classList.remove(className)
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
  },
  
  throttle: function(func, wait, options)
  // Underscore.js
  {
    var context, args, result
    var timeout = null
    var previous = 0
    options || (options = {})
    var later = function() {
      previous = options.leading === false ? 0 : new Date().getTime()
      timeout = null
      result = func.apply(context, args)
      context = args = null
    }
    return function() {
      var now = new Date().getTime()
      if (!previous && options.leading === false) previous = now
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout)
        timeout = null
        previous = now
        result = func.apply(context, args)
        context = args = null
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  },
	
	debounce: function(func, wait, immediate) 
	// Underscore.js
	{
    var timeout, args, context, timestamp, result

    var later = function() {
      var last = new Date().getTime() - timestamp

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }

    return function() {
      context = this
      args = arguments
      timestamp = new Date().getTime()
      var callNow = immediate && !timeout
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }

      return result
    }
  },
  
  orientation: function()
  // eina.orientation()
  // 
  // Get viewport orientation
  // Returns boolean
  //   true:  landscape
  //   false: portrait
  {
    var vp = eina.vp()
    return vp.w > vp.h
  },
  
  orientationLandscape: function()
  // eina.orientationLandscape()
  // 
  // Check if viewport orientation is landscape
  // Returns boolean
  {
    return eina.orientation() === true
  },
  
  orientationPortrait: function()
  // eina.orientationPortrait()
  // 
  // Check if viewport orientation is portrait
  // Returns boolean
  {
    return eina.orientation() === false
  },
  
  touch: function() 
  // eina.touch()
  // 
  // Check for touch event support
  // Desktop browser also support those, though
  // Returns boolean
  {
    return 'ontouchstart' in window || 'onmsgesturechange' in window
  },
  
  mouseMove: function()
  // eina.mouseMove()
  // 
  // A simple way to check if your on a desktop or not
  // Listen for mouse move
  // Add class hasmouse to html tag
  {
    document.addEventListener('mousemove', function(){
      eina.addClass( document.documentElement, 'hasmouse' )
//      document.removeEventListener('mousemove')
    })
  }
  
}
