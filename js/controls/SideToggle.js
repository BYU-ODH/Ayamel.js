(function(Ayamel) {
	"use strict";

	var template = '<div class="control button sideToggle" title="toggle sidebar"></div>';

	function SideToggle(args) {
		var element = Ayamel.utils.parseHTML(template);

        this.element = element;
        args.holder.appendChild(element);
	}

	Ayamel.controls.sideToggle = SideToggle;
}(Ayamel));