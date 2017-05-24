(function(){
    if (document.documentElement.outerHTML.match(/<(img|link|script) [^>]+wp-content/i)) {
        chrome.runtime.sendMessage({action: 'prepare', siteURL: location.href, siteHTML: document.documentElement.outerHTML, siteTitle: document.title});
    }
}());
