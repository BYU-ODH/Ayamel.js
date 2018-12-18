var userAgent = navigator.userAgent || navigator.vendor || window.opera,
	mobileRegex = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i,
	mobileTest = userAgent.match(mobileRegex);

export default {
    register: function(ayamel) {
        ayamel.utils.mobile = {
            isMobile: !!mobileTest,
            deviceName: (!!mobileTest && mobileTest[0].split(" ")[0]) || "desktop"
        };
    }
}

