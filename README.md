JS Motion Detection
===================

This project tries to provide a basis for other motion-detection apps, by separating the framework and its consumption.

The app uses WebRTC, HTML5 Canvas and some math, and is refactored out of the [Magic Xylophone](http://www.soundstep.com/blog/experiments/jsdetection/) by [soundstep](https://github.com/soundstep).
You can learn more about the process fom Romuald himself [on Adobe Developer Connection](http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html) and [his blog post](http://www.soundstep.com/blog/2012/03/22/javascript-motion-detection/).

### Usage
Any child element you add inside `<div id="hotSpots"></div>` will automagically work as a hotSpot, which means it will fire `motion` events on itself with extra data upon motion detection.

You could control its appearance & position with CSS, and hook to the `motion` events with jQuery / plain JS.

#### Sample Usage & DEMO

* See some examples in [sample.js](https://github.com/ReallyGood/js-motion-detection/blob/master/js/sample.js)
* Open up the demo **[here](http://reallygood.co.il/plugins/motion/)**. Hit Allow, check the console.

_Tested in Chrome Canary, might not yet work in your browser_