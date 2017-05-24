/* globals chrome */

window.addEventListener('load', function(){
    document.querySelector('#twitter-share-iframe').setAttribute('src', 'http://platform.twitter.com/widgets/tweet_button.html?url=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fwordpress-themes-recogniz%2Fjdflfokckhmchfpokjmpcoblghjngjja&amp;counturl=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fwordpress-themes-recogniz%2Fjdflfokckhmchfpokjmpcoblghjngjja&amp;count=horizontal');
    document.querySelector('#facebook-share-iframe').setAttribute('src', 'http://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fwordpress-themes-recogniz%2Fjdflfokckhmchfpokjmpcoblghjngjja&amp;width=&amp;layout=button_count&amp;action=recommend&amp;show_faces=false&amp;share=true&amp;height=21&amp;appId=259442077562276');
});


    var patternURl = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i;
    chrome.tabs.getSelected(null,function(tab){
        chrome.extension.sendMessage({action: "get", tabId: tab.id}, function(response){

            var data = response && response.data ? response.data : {};

            //For non-blocking load
            var iFrame = document.getElementById('plugins-iframe');
            iFrame.setAttribute('src', 'http://iframe.factory-wp.com');

            iFrame.onload = function(e){
                iFrame.contentWindow.postMessage({
                    action: 'get-plugins',
                    client: 'chrome',
                    url: data.siteURL,
                    extVersion: data.extVersion
                }, '*');
            };

            //ScreenShot
            if(data.screenShot.exists){
                document.querySelector('.top-content .screen-shot a img#screen-shot').setAttribute('src', data.screenShot.value);
            }

            //Description
            if(data.description.exists){
                document.querySelector('.theme-info .description p').innerHTML = data.description.value.replace(/(target)="[^"]+"/i, '').replace(/<a/, '<a target="_blank"');
            }else{
                removeElement(document.querySelector('.theme-info .description'))
            }

            var screenAnchor = document.querySelector('.top-content .screen-shot a');
            var theme = document.querySelector('.top-content .meta .theme a');
            if(data.themeName.exists){
                theme.innerHTML = data.themeName.value;
            }else{
                removeElement(document.querySelector('.top-content .meta .theme'));
            }

            if(data.themeURI.exists){
                theme.setAttribute('href', data.themeURI.value);
                removeClass(theme, 'no-link');

                screenAnchor.setAttribute('href', data.themeURI.value);
                removeClass(screenAnchor, 'no-link');
            }

            //Author
            var author = document.querySelector('.top-content .meta .author a');
            if(data.author.exists){
                author.innerHTML = data.author.value;
                if(data.authorURI.exists){
                    author.setAttribute('href', data.authorURI.value);
                    removeClass(author, 'no-link');
                }

            }else{
                removeElement(document.querySelector('.top-content .meta .author'));
            }

            //Version
            if(data.version.exists){
                document.querySelector('.top-content .meta .theme-version p').innerHTML = data.version.value;
            }else{
                removeElement(document.querySelector('.top-content .meta .theme-version'));
            }

            //WP Version
            if(data.wpVersion.exists){
                document.querySelector('.top-content .meta .wp-version p').innerHTML = data.wpVersion.value;
            }else{
                removeElement(document.querySelector('.top-content .meta .wp-version'))
            }

            attachEventListenersForAncors(document);
        });
    });

    if (HTMLCollection.prototype.forEach === undefined) {
        HTMLCollection.prototype.forEach = function(callback, thisObj) {
            Array.prototype.forEach.call(this, callback, thisObj);
        }
    }

    if (NodeList.prototype.forEach === undefined) {
        NodeList.prototype.forEach = function(callback, thisObj) {
            Array.prototype.forEach.call(this, callback, thisObj);
        }
    }

    function attachEventListenersForAncors(container) {

        container.querySelectorAll('a.no-link').forEach(function(el){ console.log('no link'); console.log(el);
            el.addEventListener('click', function(e){
                e.preventDefault();
            });
        });

        container.querySelectorAll('a:not(.no-link)').forEach(function(el){
            el.addEventListener('click', function(e){
                var url = e.currentTarget.href;
                if (patternURl.test(url)) {
                    chrome.tabs.create({url: 'http://redirect.factory-wp.com/?url=' + encodeURI(e.currentTarget.href), active: false});
                    e.preventDefault();
                }
            });
        });
    }

    function hasClass(ele,cls) {
        return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }

    function addClass(ele,cls) {
        if (!hasClass(ele,cls)) ele.className += " "+cls;
    }

    function removeClass(ele,cls) {
        if (hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }

    function removeElement(el){
        el.parentNode.removeChild(el);
    }

    window.addEventListener('message', function (e) {

        if(typeof e.data['action'] === 'undefined'){
            return false;
        }
        switch (e.data['action']) {
            case 'open-url':
                chrome.tabs.create({url: e.data['url'], active: false});
                break;
            case 'set-height':
                var height = (e.data['height']>0) ? e.data['height'] + 60 : e.data['height'];
                document.getElementById('plugins-iframe').height =  height + "px";
                break;
            default :
                break;
        }
    }, false);
});