import { Annotator } from './annotator.js'
import { Ayamel } from './Ayamel.js'
import { AyamelPlayer } from './AyamelPlayer.js'
import { ControlBar } from './ControlBar.js'
import { cueHandler } from './cueHandler.js'
import { KeyBinder } from './KeyBinder.js'
import { MediaPlayer } from './MediaPlayer.js'
import { ProgressBar } from './ProgressBar.js'
import { ResourceLibrary } from './Resource.js'
import { Sidebar } from './Sidebar.js'
import { SidebarTab } from './SidebarTab.js'
import { SoundManager } from './SoundManager.js'
import { Text } from './Text.js'
import { Translator } from './Translator.js'
import { CustomEvent } from './CustomEvent.js'

import controls from './controls/index.js'
import plugins from './plugins/index.js'
import utils from './utils.js'

export {
    Annotator,
    Ayamel,
    AyamelPlayer,
    ControlBar,
    cueHandler,
    KeyBinder,
    MediaPlayer,
    ProgressBar,
    ResourceLibrary,
    Sidebar,
    SidebarTab,
    SoundManager,
    Text,
    Translator,
    CustomEvent
}

function register(ayamelInstance, objs) {
    for (var name in objs) {
        if (objs.hasOwnProperty(name) && typeof objs[name].register === 'function') {
            objs[name].register(ayamelInstance)
        }
        else {
            console.error(`yvideojs: Object: ${name} does not have a register function.`)
        }
    }
}

// utils/controls/plugins registration function
function loadAyamel(ayamelInstance) {
    let ayamel = ayamelInstance || window.Ayamel
    if (!ayamel) {
        throw "yvideojs:ERROR: Ayamel not found."
    }
    register(ayamel, plugins)
    register(ayamel, controls)
    register(ayamel, utils)
}

// load components into the window instance of ayamel
loadAyamel()

