
define([
    'spidergl',
    'jquery',
    'presenter',
    'nexus',
    'ply',
    'trackball_sphere',
    'trackball_turntable',
    'trackball_turntable_pan',
    'trackball_pantilt',
    'init',
    'utils/get-query-string-parameter'
], function (spidergl, $, presenter, nexus, ply, trackball_sphere, trackball_turntable, trackball_turntable_pan, trackball_pantilt, init, getQueryStringParameter) {

    function setScene(config) {
        window.presenter.setScene(config);
        window.presenter.ui.postDrawEvent();
    }

    function setConfigDefaults(config){
        if (config.trackball.type === undefined){
            config.trackball.type = 'SphereTrackball'
        }
    }

    function setSceneOnStartup(){
        // Run in fullscreen if requested through query string
        let fullscreenBool = getQueryStringParameter('fullscreen');
        if (fullscreenBool){
            if (fullscreenBool.toLowerCase() === "true"){
                toggleFullscreen();
                return;
            }
        }
        setScene(window.config);
    }

    function toggleFullscreen() {
        $('#tdhop_render_area').toggleClass('fullscreen');
        $('#3dhop').toggleClass('fullscreen');
        $('#draw-canvas').toggleClass('fullscreen');
        $('#toolbar').toggleClass('fullscreen');

        $(document).ready(function(){
            resizeCanvas($('#3dhop').parent().width(),$('#3dhop').parent().height());
            window.presenter._resizable = true;
        })

        $('#full').toggle();
        $('#full_on').toggle();
        setScene(window.config);
    }

    window.actionsToolbar = function actionsToolbar(action) {
        if (action == 'home') window.presenter.resetTrackball();
        else if (action == 'zoomin') window.presenter.zoomIn();
        else if (action == 'zoomout') window.presenter.zoomOut();
	    else if (action=='lighting' || action=='lighting_off') { window.presenter.enableSceneLighting(!window.presenter.isSceneLightingEnabled()); lightingSwitch(); }
        else if (action == 'light' || action == 'light_on') { window.presenter.enableLightTrackball(!window.presenter.isLightTrackballEnabled()); lightSwitch(); }
        else if (action=='perspective' || action=='orthographic') { window.presenter.toggleCameraType(); cameraSwitch(); }
        else if (action=='color' || action=='color_on') { window.presenter.toggleInstanceSolidColor(HOP_ALL, true); colorSwitch(); }
        else if (action=='measure' || action=='measure_on') { window.presenter.enableMeasurementTool(!window.presenter.isMeasurementToolEnabled()); measureSwitch(); }
        else if (action=='pick' || action=='pick_on') { window.presenter.enablePickpointMode(!window.presenter.isPickpointModeEnabled()); pickpointSwitch(); }
        else if (action == 'sections' || action == 'sections_on') { sectiontoolReset(); sectiontoolSwitch(); }
        else if (action == 'full' || action == 'full_on') toggleFullscreen();
    }


    function onEndMeasure(measure) {
        // measure.toFixed(2) sets the number of decimals when displaying the measure
        // depending on the model measure units, use "mm","m","km" or whatever you have
        $('#measure-output').html(measure.toFixed(2));
    }

    function onEndPick(point) {
        // .toFixed(2) sets the number of decimals when displaying the picked point
        var x = point[0].toFixed(2);
        var y = point[1].toFixed(2);
        var z = point[2].toFixed(2);
        $('#pickpoint-output').html("[ "+x+" , "+y+" , "+z+" ]");
    }


    return {

        setup3DHOP: function (config) {

            setConfigDefaults(config);

            window.config = config
            window.presenter._onEndMeasurement = onEndMeasure;
            window.presenter._onEndPickingPoint = onEndPick;
            
            setSceneOnStartup();
        }
    }
});