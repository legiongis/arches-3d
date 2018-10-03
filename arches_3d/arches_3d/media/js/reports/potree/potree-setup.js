
define('three-wrapped', ['three-official'], function (THREE) {
    window.THREE = THREE;
    return THREE;
});

define('proj4-wrapped', ['proj4'], function (proj4) {
    window.proj4 = proj4;
    return proj4;
});

define('ol-wrapped', ['ol'], function (ol) {
    window.ol = ol;
    return ol;
});

define([
    'module',
    'arches',
    'jquery',
    'jquery-ui',
    'proj4-wrapped',
    'spectrum',
    'perfect-scrollbar',
    'three-wrapped',
    'binary-heap',
    'tween',
    'd3',
    'ol-wrapped',
    'i18next',
    'jstree',
    'potree-official',
    'laslaz'
], function (module, arches, $, jqueryUi, proj4, spectrum, perfectScrollbar, three, binaryHeap, tween, d3, ol, i18next, jstree, Potree, laslaz) {

    var currentUrl = module.uri;
    urlWithoutQueryString = currentUrl.split(/[?#]/)[0];
    urlWithoutFilename = urlWithoutQueryString.substr(0, urlWithoutQueryString.lastIndexOf('/'))
    potreePath = location.origin + urlWithoutFilename + '/libs/potree' 
    Potree.scriptPath = new URL(potreePath);
    Potree.resourcePath = Potree.scriptPath + '/resources';

    return {
        setupPotree: function (sourcePath, pointcloudName) {
            
            viewer.setEDLEnabled(true);
            viewer.setFOV(60);
            viewer.setPointBudget(1 * 1000 * 1000);

            viewer.setEDLEnabled(false);
            viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
            viewer.setDescription(``);
            viewer.loadSettingsFromURL();

            viewer.loadGUI(() => {
                viewer.setLanguage('en');
                $("#menu_appearance").next().show();
                $("#menu_tools").next().show();
                $("#menu_scene").next().show();
            });

            Potree.loadPointCloud(sourcePath, pointcloudName, e => {
                let pointcloud = e.pointcloud;
                let material = pointcloud.material;
                viewer.scene.addPointCloud(pointcloud);
                material.pointColorType = Potree.PointColorType.RGB; // any Potree.PointColorType.XXXX 
                material.size = 1;
                material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
                material.shape = Potree.PointShape.SQUARE;
                viewer.fitToScreen();
            });
        }
    }

});