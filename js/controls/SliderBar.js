import { isMobile } from  "../Mobile"
import { Ayamel } from  "../Ayamel"
import { CustomEvent } from  "../CustomEvent"

var template =
    '<div class="sliderContainer">\
        <div class="sliderLevel">\
            <div class="sliderKnob"></div>\
        </div>\
    </div>';

class SliderBar {
    constructor(args) {
        var parent = args.parent,
        max = isNaN(+args.max) ? 1 : (+args.max),
        min = +args.min || 0,
        scale = 100 / (max - min),
        value = Math.min(+args.level || 0, max),
        element = Ayamel.utils.parseHTML(template),
        level = element.querySelector(".sliderLevel"),
        left = 0, lastX = 0, moving = false;

        this.element = element;
        args.holder.appendChild(element);
        level.style.width = (value - min) * scale + "%";
        function pxToValue(px) {
            var pmax, pc;
            pmax = parseInt(global.getComputedStyle(element, null).getPropertyValue('width'), 10);
            pc = Math.min(Math.max(px, 0), pmax) / pmax;
            if (typeof parent === 'object' && typeof parent.scale === 'number') {
                pc /= parent.scale;
            }
            return pc * (max - min) + min;
        }
        element.addEventListener(isMobile ? "touchstart" : "mousedown", function (event) {
            var val, newEvent;
            if (moving) {
                return;
            }
            moving = true;
            left = level.getBoundingClientRect().left + 7;
            lastX = event.clientX;
            val = pxToValue(lastX - left);
            element.dispatchEvent(new CustomEvent('scrubstart', { detail: { progress: val } }));
            element.dispatchEvent(new CustomEvent('levelchange', { detail: { level: val } }));
        }, false);
        document.addEventListener(isMobile ? "touchmove" : "mousemove", function (event) {
            var val;
            if (!moving) {
                return;
            }
            lastX = event.clientX;
            val = pxToValue(lastX - left);
            element.dispatchEvent(new CustomEvent('scrubupdate', { detail: { progress: val } }));
            element.dispatchEvent(new CustomEvent('levelchange', { detail: { level: val } }));
        }, false);
        document.addEventListener(isMobile ? "touchend" : "mouseup", function (event) {
            if (!moving) {
                return;
            }
            moving = false;
            element.dispatchEvent(new CustomEvent('scrubend', { detail: { progress: pxToValue((isMobile ? lastX : event.clientX) - left) } }));
        }, false);
        Object.defineProperties(this, {
            level: {
                set: function (val) {
                    value = Math.max(Math.min(+val || 0, max), min);
                    level.style.width = (value - min) * scale + "%";
                    return value;
                },
                get: function () {
                    return value;
                }
            },
            title: {
                set: function (val) { return element.title = val; },
                get: function () { return element.title; }
            }
        });
    }
    dispatchEvent(evt) {
        this.element.dispatchEvent(evt);
    }
    addEventListener(name, cb, capture) {
        this.element.addEventListener(name, cb, capture);
    }
    removeEventListener(name, cb, capture) {
        this.element.removeEventListener(name, cb, capture);
    }
}

export { SliderBar as Slider }

