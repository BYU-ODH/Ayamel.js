import { Ayamel } from "../Ayamel"
import { CustomEvent } from "../CustomEvent"

var template = '<span class="control">\
    <div class="button lastCaption" title="jump to previous cue"></div>\
    <div class="button nextCaption" title="jump to following cue"></div>\
</span>';

class LastCaptionButton {
    constructor(args) {
        var element = Ayamel.utils.parseHTML(template);
        this.element = element;
        args.holder.appendChild(element);
        //Set up events
        function jump(dir, e) {
            e.stopPropagation();
            element.dispatchEvent(new CustomEvent('captionJump', { bubbles: true, cancelable: true, detail: { direction: dir } }));
        }
        element.querySelector('.lastCaption')
            .addEventListener('click', jump.bind(null, "back"), false);
        element.querySelector('.nextCaption')
            .addEventListener('click', jump.bind(null, "forward"), false);
    }
}

export default {
    register: function(ayamel) {
        ayamel.controls.lastCaption = LastCaptionButton;
    }
};

