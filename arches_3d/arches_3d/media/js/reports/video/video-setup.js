define([
    'module',
    'arches',
    'jquery',
    'utils/get-query-string-parameter'
], function (module, arches, $, getQueryStringParameter) {

    let currentUrl = module.uri;
    urlWithoutQueryString = currentUrl.split(/[?#]/)[0];
    urlWithoutFilename = urlWithoutQueryString.substr(0, urlWithoutQueryString.lastIndexOf('/'))

    var fullscreenImageOff = arches.urls.media + 'img/fullscreen_off_white.svg';
    var fullscreenImageOn = arches.urls.media + 'img/fullscreen_on_white.svg';

    function toggleFullscreen() {
        $('#video-render-area').toggleClass('fullscreen');
        $('#fullscreen-button').toggleClass('fullscreen');
        $('#video-container').toggleClass('fullscreen');
        
        let button = $('#fullscreen-button');
        if (button.attr('src').indexOf('fullscreen_off_white.svg') != -1) {
            button.attr('src', fullscreenImageOn);
        }
        else {
            button.attr('src', fullscreenImageOff) 
        }
    }

    function getEmbedUrlForVideoPlayerType(videoUrl, videoPlayerType){
        if (videoPlayerType === "YouTube"){
            return '//www.youtube.com/embed/' + getVideoIdFromYoutubeUrl(videoUrl);
        }
    }

    function getVideoIdFromYoutubeUrl(youtubeUrl){
        let matches = youtubeUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)
        if (matches && matches[2].length == 11){
            return matches[2];
        }
        else {
            throw "Could not read YouTube video id from provided URL"
        }
    }

    return {
        setupVideo: function (videoUrl, videoPlayerType) {

            $('#fullscreen-button').click(toggleFullscreen);

            let embedUrlForVideoPlayerType = getEmbedUrlForVideoPlayerType(videoUrl, videoPlayerType)

            let videoRenderArea = $('#video-render-area');
            videoRenderArea.attr('src', embedUrlForVideoPlayerType);

            // Run in fullscreen if requested through query string
            let fullscreenBool = getQueryStringParameter('fullscreen');
            if (fullscreenBool){
                if (fullscreenBool.toLowerCase() === "true"){
                    toggleFullscreen();
                }
            }
        }
    }

});