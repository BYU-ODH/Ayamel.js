(function(Ayamel){
	"use strict";

	var accountNum = "1126213333001";
	var playerId = "d3af83a6-196d-4b91-bb6a-9838bdff05ec";
	var counter = 0;

	function supportsFile(file) {
		return file.streamUri && file.streamUri.substr(0,13) === "brightcove://";
	}

	function getNewId() {
		return "BrightcoveVideo_" + (counter++).toString();
	}

	/*
	 * https://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
	 */
	function loadScript(url,callback) {
		var script = document.createElement("script")
		script.type = "text/javascript";

		if (script.readyState){  //IE
			script.onreadystatechange = function(){
				if (script.readyState == "loaded" ||
						script.readyState == "complete"){
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {  //Others
			script.onload = function(){
				callback();
			};
		}

		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	function generateBrightcoveTemplate(videoId, tagId){
		return Ayamel.utils.parseHTML('<div><video style="width:100%;height:100%;overflow:hidden;" id="' + tagId + '" data-video-id="' + videoId + '"  data-account="' + accountNum +
			'" data-player="' + playerId + '" data-embed="default" class="video-js"></video></div>');
	}

	function BrightcoveVideoPlayer(args) {
		var that = this, player,
			startTime = args.startTime, endTime = args.endTime,
			file = Ayamel.utils.findFile(args.resource, supportsFile),
			videoId = file.streamUri.substr(13),
			tagId = getNewId(),
			element = generateBrightcoveTemplate(videoId, tagId);

		this.resource = args.resource;

		this.element = element;
		args.holder.appendChild(element);

		this.loaded = false;
		this.properties = {
			duration: 0,
			currentTime: startTime,
			paused: true,
			volume: 1,
			muted: false,
			playbackRate: 1
		};

		var brightcoveScript = "//players.brightcove.net/" + accountNum + "/" + playerId + "_default/index.min.js";
		loadScript(brightcoveScript, function(elem){
			var c = document.querySelector('.vjs-control-bar');
			c.parentElement.removeChild(c);
			c = document.querySelector('.vjs-big-play-button');
			c.parentElement.removeChild(c);

			bc(tagId);
			that.player = videojs(tagId);
			player = that.player;

			that.loaded = true;
			[	'play','pause','ended',
				'timeupdate',
				'durationchange',
				'volumechange'
			].forEach(function(ename){
				player.on(ename, function(){
					that.properties.currentTime = player.currentTime();
					that.properties.duration = player.duration();
					that.properties.paused = player.paused();
					that.properties.volume = player.volume();
					that.properties.muted = player.muted();
					that.properties.playbackRate = player.playbackRate();
					element.dispatchEvent(new Event(ename,{
						bubbles:true,cancelable:false
					}));
				});
			});

			
			player.height(element.innerHeight, true);
			player.width(element.innerWidth, true);
			player.currentTime(that.properties.currentTime);
			player.volume(that.properties.volume);
			player.muted(that.properties.muted);
			player.playbackRate(that.properties.playbackRate);
			if(!that.properties.paused){ player.play(); }
		});
		
		Object.defineProperties(this, {
			height: {
				get: function(){ return element.clientHeight; },
				set: function(h){
					h = +h || element.clientHeight;
					element.style.height = h + "px";
					if (this.loaded)
						player.height(h, true);
					return h;
				}
			},
			width: {
				get: function(){ return element.clientWidth; },
				set: function(w){
					w = +w || element.clientWidth;
					element.style.width = w + "px";
					if (this.loaded)
						player.width(w, true);
					return w;
				}
			}
		});
	}

	Object.defineProperties(BrightcoveVideoPlayer.prototype,{
		duration: {
			get: function(){ return this.properties.duration; }
		},
		currentTime: {
			get: function(){ return this.properties.currentTime; },
			set: function(time){
				time = +time||0;
				this.properties.currentTime = time;
				if (this.loaded)
					this.player.currentTime(time);
				return time;
			}
		},
		muted: {
			get: function(){ return this.properties.muted; },
			set: function(muted){
				muted = !! muted;
				this.properties.muted = muted;
				if (this.loaded)
					this.player.muted(muted);
				return muted;
			}
		},
		volume: {
			get: function(){ return this.properties.volume; },
			set: function(volume){
				volume = Math.max(+volume || 0, 0);
				this.properties.volume = volume;
				if (this.loaded)
					this.player.volume(volume);
				return volume;
			}
		},
		paused: {
			get: function(){ return this.properties.paused; }
		},
		playbackRate: {
			get: function(){ return this.properties.playbackRate; },
			set: function(rate){
				rate = +rate || 1;
				this.properties.playbackRate = rate;
				if (this.loaded)
					this.player.playbackRate(rate);
				return rate;
			}
		},
		readyState: {
			get: function(){ return 4; }
		}
	});

	BrightcoveVideoPlayer.prototype.play = function(){
		if (this.loaded)
			this.player.play();
		this.properties.paused = false;
	};

	BrightcoveVideoPlayer.prototype.pause = function(){
		if (this.loaded)
			this.player.pause();
		this.properties.paused = true;
	};

	BrightcoveVideoPlayer.prototype.enterFullScreen = function(availableHeight, availableWidth){
		this.normalHeight = this.element.clientHeight;
		this.normalWidth = this.element.clientWidth;
		this.element.style.height = availableHeight + 'px';
		if (this.loaded) {
			this.player.height(availableHeight, true);
			this.player.width(availableWidth, true);
		}
	};

	BrightcoveVideoPlayer.prototype.exitFullScreen = function(){
		this.element.style.height = this.normalHeight + 'px';
		if (this.loaded) {
			this.player.height(this.normalHeight, true);
			this.player.width(this.normalWidth, true);
		}
	};

	BrightcoveVideoPlayer.prototype.addEventListener = function(name, handler, capture){
		this.element.addEventListener(name, handler, !!capture);
	};

	BrightcoveVideoPlayer.prototype.removeEventListener = function(name, handler, capture){
		this.element.removeEventListener(name, handler, !!capture);
	};

	BrightcoveVideoPlayer.prototype.features = {
		desktop: {
			captions: true,
			annotations: true,
			fullScreen: true,
			lastCaption: true,
			play: true,
			seek: true,
			rate: true,
			timeCode: true,
			volume: true,
			sideToggle: true
		},
		mobile: {
			captions: true,
			annotations: true,
			fullScreen: true,
			lastCaption: true,
			play: true,
			seek: true,
			rate: true,
			timeCode: false,
			volume: false,
			sideToggle: true
		}
	};

	Ayamel.mediaPlugins.video.brightcove = {
		install: function(args){
			return new BrightcoveVideoPlayer(args);
		},
		supports: function(args){
			return args.resource.type === "video" &&
					args.resource.content.files.some(supportsFile);
		}
	};

}(Ayamel));
