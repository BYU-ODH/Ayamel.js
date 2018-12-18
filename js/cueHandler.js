import { CustomEvent } from "./CustomEvent"

export function cueHandler(player, type, e) {
	var cue = e.target, text = cue.text, data;
	if (cue.track.kind !== "metadata") {
		return;
	}
	if (text.substr(0, 13) !== "[AyamelEvent]") {
		return;
	}
	try {
		data = JSON.parse(text.substr(13))[type];
	}
	catch (_) {
		return;
	}
	if (typeof data === "object" && data.events instanceof Array) {
		data.events.forEach(function (e) {
			player.element.dispatchEvent(new CustomEvent(e.name, { bubbles: e.bubbles, detail: e.detail }));
		});
	}
	var mutatorFlag = false;
	var cueMutations = {};
	// Cue handling
	if (type === "enter") {
		// ENTER
		if (typeof data !== "object") {
			return;
		}
		if (data.actions instanceof Array) {
			data.actions.forEach(function (i) {
				switch (i.type) {
					case "pause":
						player.pause();
						break;
					case "skip":
						player.currentTime = cue.endTime;
						break;
					case "setvolume":
						mutatorFlag = true;
						cueMutations.volume = true;
						var oldVolume = player.volume;
						player.volume = i.value;
						player.cachedValues.volume = oldVolume;
						break;
					case "setrate":
						mutatorFlag = true;
						cueMutations.playbackRate = true;
						var oldRate = player.playbackRate;
						player.playbackRate = i.value;
						player.cachedValues.playbackRate = oldRate;
						break;
					case "mute":
						mutatorFlag = true;
						cueMutations.muted = true;
						var oldMute = player.muted;
						// player.muted = i.value;
						player.muted = true;
						player.cachedValues.muted = oldMute;
						break;
					case "blank":
						mutatorFlag = true;
						cueMutations.blank = true;
						player.cachedValues.blank = player.mediaPlayer.blank;
						player.mediaPlayer.blank = true;
						break;
					case "blur":
						mutatorFlag = true;
						cueMutations.blur = true;
						player.cachedValues.blur = player.mediaPlayer.blur;
						player.mediaPlayer.blur = i.value;
						break;
				}
			});
			// Add mutating cues to mutatorCues
			if (mutatorFlag) {
				player.mutatorCues.set(cue, cueMutations);
			}
		}
	}
	// EXIT
	else {
		if (typeof data === "object" && data.actions instanceof Array) {
			data.actions.forEach(function (i) {
				switch (i.type) {
					case "pause":
						player.pause();
						break;
				}
			});
		}
		// Restore values from cache
		if (player.mutatorCues.has(cue)) {
			cueMutations = player.mutatorCues.get(cue);
			player.mutatorCues.delete(cue);
			["volume", "playbackRate", "muted", "blank", "blur"].forEach(function (p) {
				if (!cueMutations[p]) {
					return;
				}
				player.mediaPlayer[p] = player.cachedValues[p];
			});
		}
	}
}
