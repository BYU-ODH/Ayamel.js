import { CustomEvent } from "./CustomEvent"

function renderHead(name) {
	var result = document.createElement('li');
	result.className = 'tabHead';
	result.textContent = name;
	return result;
}

function renderBody(content, tab, player) {
	var result = document.createElement('div');
	result.className = 'tabBody';
	if(typeof content === 'function'){
		result.appendChild(content(tab, player));
	}else if(content instanceof Node){
		result.appendChild(content);
	}else{
		result.textContent = ""+content;
	}
	return result;
}

class SidebarTab {
	constructor(args) {
		var that = this, title = args.title, content = args.content, sidebar = args.sidebar;
		this.title = title;
		this.content = content;
		this.head = renderHead(title);
		this.body = renderBody(content, this, args.player);
		this.sidebar = sidebar;
		this.head.addEventListener('click', function () {
			if (that.body.classList.contains('visible')) {
				sidebar.baseVisible = false;
				sidebar.hide();
			}
			else {
				sidebar.baseTab = that;
				sidebar.baseVisible = true;
				that.select();
			}
		});
	}
}

SidebarTab.prototype = {
	select: function(){
		if(this.body.classList.contains('visible')){ return; }
		this.body.classList.add('visible');
		this.head.classList.add('selected');
		this.sidebar._selectTab(this);
		this.body.dispatchEvent(new CustomEvent("select", {bubbles: true}));
	},
	deselect: function(){
		if(!this.body.classList.contains('visible')){ return; }
		this.sidebar.hide();
		this._deselect();
	},
	_deselect: function(){
		this.body.classList.remove('visible');
		this.head.classList.remove('selected');
		this.body.dispatchEvent(new CustomEvent("deselect", {bubbles: true}));
	},
	addEventListener: function(event, cb, capture){
		this.body.addEventListener(event, cb, !!capture);
	},
	removeEventListener: function(event, cb, capture){
		this.body.removeEventListener(event, cb, capture);
	}
}

export { SidebarTab }
