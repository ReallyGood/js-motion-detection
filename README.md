JS Motion Detection
===================

This project tries to provide a basis for other motion-detection apps, by separating the framework and its consumption.
It uses WebRTC &amp; Canvas, and is refactored out of the [Magic Xylophone](http://www.soundstep.com/blog/experiments/jsdetection/) by [soundstep](https://github.com/soundstep)

Any child element you add inside `<div id="hotSpots"></div>` will automagically work as a hotSpot, which means it will fire `motion` events on itself with extra data upon motion detection.

You could control its appearance & position with CSS, and hook to the `motion` events with jQuery / plain JS.

See some examples in [remote.js](https://github.com/RonnyO/js-motion-detection/blob/master/js/remote.js) (open your console when you run it).