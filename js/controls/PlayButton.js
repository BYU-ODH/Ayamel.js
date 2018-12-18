import { Ayamel } from "../Ayamel"

var template = '<div class="control button play paused" title="play"></div>';

class PlayButton {
    constructor(args) {
        var _this = this, playing = false, element = Ayamel.utils.parseHTML(template);
        this.element = element;
        args.holder.appendChild(element);
        // Set up events
        element.addEventListener('click', function (e) {
            e.stopPropagation();
            element.dispatchEvent(new Event(playing ? 'pause' : 'play', { bubbles: true, cancelable: true }));
        }, false);
        // Be able to set the playing attribute
        Object.defineProperty(this, "playing", {
            enumerable: true,
            get: function () {
                return playing;
            },
            set: function (value) {
                playing = !!value;
                if (playing) {
                    element.title = "pause";
                    element.classList.remove('paused');
                }
                else {
                    element.title = "play";
                    element.classList.add('paused');
                }
                return playing;
            }
        });
        if (typeof args.parent === 'object') {
            Object.defineProperties(args.parent, {
                playing: {
                    enumerable: true,
                    set: function (value) {
                        return _this.playing = !!value;
                    },
                    get: function () {
                        return playing;
                    }
                }
            });
        }
    }
}

export default {
    register: function(ayamel) {
        ayamel.controls.play = PlayButton;
    }
};

