var Belay = (function () {
	var settings = {
		strokeColor: '#fff',
		strokeWidth: 2,
		opacity: 1,
		fill: 'none',
		animate: true,
		animationDirection: 'right',
		animationDuration: .35
	};
	var me = {};

	me.init = function (initObj) {
		if (initObj) {
			$.each(initObj, function (index, value) {
				//TODO validation on settings
				settings[index] = value;
			});
		}
	}

	me.set = function (prop, val) {
		//TODO validate
		settings[prop] = val;
	}

	me.on = function (el1, el2) {

		var svgheight,
			p,
			svgleft,
			svgtop,
			svgwidth;

		var el1pos = $(el1).offset();
		var el2pos = $(el2).offset();

		var el1H = $(el1).outerHeight();
		var el1W = $(el1).outerWidth();

		var el2H = $(el2).outerHeight();
		var el2W = $(el2).outerWidth();

		svgleft = Math.round(el1pos.left + el1W);
		svgwidth = Math.round(el2pos.left - svgleft);

		////Determine which is higher/lower
		//If lower/higher
		if ((el2pos.top + (el2H / 2)) <= (el1pos.top + (el1H / 2))) {
			svgheight = Math.round((el1pos.top) + el1H / 2) - (el2pos.top + el2H / 2);
			svgtop = Math.round(el2pos.top + el2H / 2);
			// Curve Up -- (Left,Bottom Right,Bottom Left,Top Right,Top) http://blogs.sitepointstatic.com/examples/tech/svg-curves/cubic-curve.html
			p = "M0," + (svgheight + settings.strokeWidth) + " C" + (svgwidth / 2) + "," + (svgheight + settings.strokeWidth) + " " + (svgwidth / 2) + "," + settings.strokeWidth + " " + svgwidth + "," + settings.strokeWidth;
		} else {
			svgheight = Math.round((el2pos.top) + el2H / 2) - (el1pos.top + el1H / 2);
			svgtop = Math.round(el1pos.top + el1H / 2);
			// Curve Down -- (Left,Top Right,Top Left,Bottom, Right,Bottom)
			p = "M0," + settings.strokeWidth + " C" + (svgwidth / 2) + "," + settings.strokeWidth + " " + (svgwidth / 2) + "," + (svgheight + settings.strokeWidth) + " " + svgwidth + "," + (svgheight + settings.strokeWidth);
		}

		//ugly one-liner
		$ropebag = $('#ropebag').length ? $('#ropebag') : $('body').append($("<div id='ropebag' />")).find('#ropebag');

		var svgnode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		var newpath = document.createElementNS('http://www.w3.org/2000/svg', "path");
		newpath.setAttributeNS(null, "d", p);
		newpath.setAttributeNS(null, "stroke", settings.strokeColor);
		newpath.setAttributeNS(null, "stroke-width", settings.strokeWidth);
		newpath.setAttributeNS(null, "opacity", settings.opacity);
		newpath.setAttributeNS(null, "fill", settings.fill);
		svgnode.appendChild(newpath);

		// Adding the stroke width * 2 to the height so path is not cropped and adjusting the top offset by the stroke width
		$(svgnode).css({ height: svgheight + (settings.strokeWidth * 2), left: svgleft, position: 'absolute', top: svgtop - settings.strokeWidth, width: svgwidth });

		$ropebag.append(svgnode);
		if (settings.animate) {
			// THANKS to http://jakearchibald.com/2013/animated-line-drawing-svg/
			var pl = newpath.getTotalLength();
			// Set up the starting positions
			newpath.style.strokeDasharray = pl + ' ' + pl;

			if (settings.animationDirection == 'right') {
				newpath.style.strokeDashoffset = pl;
			} else {
				newpath.style.strokeDashoffset = -pl;
			}

			// Trigger a layout so styles are calculated & the browser
			// picks up the starting position before animating
			// WON'T WORK IN IE. If you want that, use requestAnimationFrame to update instead of CSS animation
			newpath.getBoundingClientRect();
			newpath.style.transition = newpath.style.WebkitTransition = 'stroke-dashoffset ' + settings.animationDuration + 's ease-in-out';
			// Go!
			newpath.style.strokeDashoffset = '0';
		}
	}

	me.off = function () {
		$("#ropebag").empty();
	}

	return me;
}());