define([
    'module',
    'arches',
    'jquery',
], function (module, arches, $) {

    let currentUrl = module.uri;
    urlWithoutQueryString = currentUrl.split(/[?#]/)[0];
    urlWithoutFilename = urlWithoutQueryString.substr(0, urlWithoutQueryString.lastIndexOf('/'))

    var fullscreenImageOff = arches.urls.media + 'img/fullscreen_off_white.svg';
    var fullscreenImageOn = arches.urls.media + 'img/fullscreen_on_white.svg';

    function toggleFullscreen() {
        $('#potree_render_area').toggleClass('fullscreen');
        $('#potree_sidebar_container').toggleClass('fullscreen');
        
        let button = $('#potree_fullscreen_button');
        if (button.attr('src').indexOf('fullscreen_off_white.svg') != -1) {
            button.attr('src', fullscreenImageOn);
        }
        else {
            button.attr('src', fullscreenImageOff) 
        }
    }

    return {
        setupVirtualTours: function (sourcePath) {

            // let fullScreenToggle = document.createElement('img');
            // fullScreenToggle.src = fullscreenImageOff;
            // fullScreenToggle.id = 'potree_fullscreen_button'
            // fullScreenToggle.onclick = toggleFullscreen;
            // fullScreenToggle.classList.add('potree_button');

            // $('#message_listing').append(fullScreenToggle)

            
            let virtual_tours_container = $('#virtual_tours_container');
            virtual_tours_container.attr('src', sourcePath);
        }
    }

});