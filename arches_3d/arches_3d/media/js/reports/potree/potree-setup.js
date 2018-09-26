require([
    'jquery',
    'jquery-ui',
    'proj4',
    'spectrum',
    'perfect-scrollbar',
    'three',
    'binary-heap',
    'tween',
    'd3',
    'ol',
    'i18next',
    'jstree',
    'potree-official',
    'laslaz'
], function ($, jqueryUi, proj4, spectrum, perfectScrollbar, three, binaryHeap, tween, d3, ol, i18next, jstree, potreeOfficial, laslaz) {

    window.THREE = three;
    
    return {
        setupPotree: function (sourcePath, pointcloudName) {
            
            viewer.setEDLEnabled(true);
            viewer.setFOV(60);
            viewer.setPointBudget(1 * 1000 * 1000);
            document.title = "";
            viewer.setEDLEnabled(false);
            viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
            viewer.setDescription(``);
            viewer.loadSettingsFromURL();

            viewer.loadGUI(() => {
                viewer.setLanguage('en');
                $("#menu_appearance").next().show();
                $("#menu_tools").next().show();
                $("#menu_scene").next().show();
                viewer.toggleSidebar();
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