function loadCaptionTrack(resource, kind){
    var supportedFiles, file;
    if(!TimedText){ throw new Error("TimedText library not loaded."); }
    if(resource instanceof TextTrack){
        return Promise.resolve(resource);
    }else{
        supportedFiles = resource.content.files.filter(function(file){
            return TimedText.isSupported(file.mime);
        });
        if(supportedFiles.length === 0){
            return Promise.reject(new Error("Unsupported MIME-Type"));
        }
        file = supportedFiles[0];
        return new Promise(function(resolve, reject){
            TextTrack.get({
                kind: kind || "subtitles",
                label: resource.title || "Untitled",
                lang: resource.languages.iso639_3[0] || "eng",
                src: file.downloadUri,
                error: reject,
                success: function(track, mime){
                    resolve({track: track, mime: mime});
                }
            });
        });
    }
};

export default {
        register: function(ayamel) {
        ayamel.utils.loadCaptionTrack = loadCaptionTrack;
    }
}

