var activeMenu = null;

class Menu {
	constructor(menu) {
		var element, filter, data;
		if (menu instanceof HTMLElement) {
			element = menu;
			filter = function () { };
			Object.defineProperty(this, 'data', {
				get: function () { return data; },
				set: function (d) { return data = d; }
			});
		}
		else if (menu && (menu.element instanceof HTMLElement)) {
			element = menu.element;
			filter = typeof menu.filter === 'function' ? menu.filter.bind(menu) : function () { };
			Object.defineProperty(this, 'data', {
				get: function () { return menu.data; },
				set: function (d) { return menu.data = d; }
			});
		}
		else {
			throw new Error("Menu Not Displayable");
		}
		element.parentNode && element.parentNode.removeChild(element);
		this.element = element;
		Object.freeze(this);
	}
	open(x, y, d) {
		if (activeMenu) {
			activeMenu.close();
		}
		this.element.style.position = "absolute";
		this.element.style.top = (y || 0) + "px";
		this.element.style.left = (x || 0) + "px";
		this.data = d;
		(Ayamel.utils.FullScreen.fullScreenElement || document.body).appendChild(this.element);
		activeMenu = this;
	}
	close() { this.element.parentNode.removeChild(this.element); }
}

function mouseUp(e){
	if(!activeMenu){ return; }
	var trg = e.target, elm = activeMenu.element;
	if(trg === elm || (trg.compareDocumentPosition(elm) & Node.DOCUMENT_POSITION_CONTAINS)){ return; }
	activeMenu.close();
	activeMenu = null;
}

document.addEventListener('mouseup', mouseUp, false);
document.addEventListener('touchend', mouseUp, false);

export default {
    register: function(ayamel) {
        ayamel.utils.Menu = Menu;
    }
}
