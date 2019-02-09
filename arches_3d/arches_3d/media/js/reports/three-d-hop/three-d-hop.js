define([
    'underscore',
    'knockout',
    'viewmodels/report',
    'arches',
    'reports/three-d-hop/three-d-hop-setup',
    'trackball_sphere',
    'trackball_turntable',
    'trackball_turntable_pan',
    'trackball_pantilt',
    'knockstrap',
    'bindings/chosen'
], function (_, ko, ReportViewModel, arches, threeDHopSetup, trackball_sphere, trackball_turntable, trackball_turntable_pan, trackball_pantilt) {

        function getConceptValue(valueid){
            var val;
            $.ajax({
                type: 'GET',
                url: arches.urls.concept_value,
                data: { valueid: valueid },
                async: false,
                success: function(response){
                    val = response.value;
                }
            });
            return val;
        }

        function addProperty(object, key, value, index) {
            var keys = key.split('.');
            object = initializeParentProperties(object, keys);

            if (index != null){
                addArrayProperty(object, keys, value, index)
            }
            else {
                object[keys[0]] = value;
            }
        }

        function initializeParentProperties(object, keys){
            while (keys.length > 1){
                var k = keys.shift();
                if (!object.hasOwnProperty(k)) {
                    object[k] = {};
                }

                object = object[k];
            }
            return object;
        }

        function addArrayProperty(object, keys, value, index){
            var propertyName = keys[0];
            initializeArrayIfNotExists(object, propertyName);
            object[propertyName][index] = value;
        }

        function initializeArrayIfNotExists(object, propertyName){
            if (!object.hasOwnProperty(propertyName)){
                object[propertyName] = [];
            }
        }

        function removeDotsFromString(string) {
            return string.replace('.', '-');
        }

        function cleanEmptyProperties(object) {
            let parent = object;
            Object.keys(parent).forEach(function(key){
                const property = parent[key];
                if (property && typeof property === 'object') {
                    cleanEmptyProperties(property);
                }
                if (property == null || property === "" || (Array.isArray(property) && property.length === 0)) {
                    if (Array.isArray(parent)) {
                        parent.splice(parent[key], 1);
                    }
                    else {
                        delete parent[key];
                    }
                }
            })
        }

        return ko.components.register('three-d-hop-report', {
        viewModel: function (params) {
            var self = this;
            params.configKeys = ['nodes'];
            ReportViewModel.apply(this, [params]);

            self.threeDHopFileCount = ko.observable(0);

            if (self.report.get('tiles')) {
                let config = {}
                self.report.get('tiles').forEach(function (tile) {
                    _.each(tile.data, function (val, key) {

                        if (val == null){
                            return;
                        }

                        // 3D model file
                        if (Array.isArray(val)) {
                            val.forEach(function (item) {

                                if (item.status &&
                                    item.status === 'uploaded' &&
                                    (item.name.split('.').pop() == 'ply' || item.name.split('.').pop() == 'nxs')
                                ) {
                                    var mesh = { url: item.url };
                                    var meshName = removeDotsFromString(item.name);
                                    addProperty(config, `meshes.${meshName}`, mesh)

                                    var instance = { mesh: meshName };
                                    var instanceName = removeDotsFromString(item.name);
                                    addProperty(config, `modelInstances.${instanceName}`, instance)
                                }
                            });
                            return;
                        }


                        // // Trackball

                        // TrackballType
                        if (key === '1123258a-226e-11e9-8639-0242ac170002'){
                            var conceptValue = getConceptValue(val);
                            var conceptAsType = window[conceptValue];
                            addProperty(config, 'trackball.type', conceptAsType);
                            return;
                        }

                        // Start Phi
                        if (key === '4fef73c2-226e-11e9-9e1e-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.startPhi', val);
                            return;
                        }    

                        // Start Theta
                        if (key === '77472ef6-226e-11e9-8bd2-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.startTheta', val);
                            return;
                        }

                        // Start Distance
                        if (key === '84a2c6fa-226e-11e9-b4cd-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.startDistance', val);
                            return;
                        }

                        // Start Pan X
                        if (key === '92d84f1a-226e-11e9-8639-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.startPanX', val);
                            return;
                        }

                        // Start Pan Y
                        if (key === 'a4030654-226e-11e9-b29f-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.startPanY', val);
                            return;
                        }

                        // Start Pan Z
                        if (key === 'b772a67c-226e-11e9-ab9d-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.startPanZ', val);
                            return;
                        }

                        // Min Dist
                        if (key === '43195b86-26e7-11e9-b29f-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxDist', val, 0);
                            return;
                        }

                        // Max Dist
                        if (key === '67f05c8e-26e7-11e9-8639-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxDist', val, 1);
                            return;
                        }

                        // Min Phi
                        if (key === '97b84d6e-26e7-11e9-ab9d-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxPhi', val, 0);
                            return;
                        }

                        // Max Phi
                        if (key === 'b18eb494-26e7-11e9-b4cd-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxPhi', val, 1);
                            return;
                        }

                        // Min Theta
                        if (key === '1c873974-26e8-11e9-8bd2-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxTheta', val, 0);
                            return;
                        }

                        // Max Theta
                        if (key === '2d7ebcb6-26e8-11e9-8639-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxTheta', val, 1);
                            return;
                        }

                        // Min Pan X
                        if (key === '49977ba4-26e8-11e9-ad1e-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxPanX', val, 0);
                            return;
                        }

                        // Max Pan X
                        if (key === '5ca61af2-26e8-11e9-8639-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxPanX', val, 1);
                            return;
                        }

                        // Min Pan Y
                        if (key === '743bc66c-26ed-11e9-8639-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxPanY', val, 0);
                            return;
                        }

                        // Max Pan Y
                        if (key === '8b10fdf8-26ed-11e9-8c52-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxPanY', val, 1);
                            return;
                        }

                        // Min Pan Z
                        if (key === 'b1d2d47a-26ed-11e9-8c52-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxPanZ', val, 0);
                            return;
                        }
                        
                        // Max Pan Z
                        if (key === 'c00d79f0-26ed-11e9-b29f-0242ac170002'){
                            addProperty(config, 'trackball.trackOptions.minMaxPanZ', val, 1);
                            return;
                        }


                        // //Space

                        // Center Mode
                        if (key === 'af717052-2273-11e9-b4cd-0242ac170002'){
                            addProperty(config, 'trackball.space.centerMode', getConceptValue(val));
                            return;
                        }

                        // Explicit Center X
                        if (key === '4badaf1c-2274-11e9-ad1e-0242ac170002'){
                            addProperty(config, 'trackball.space.explicitCenter', val, 0);
                            return;
                        }

                        // Explicit Center Y
                        if (key === '41e3ad9c-2274-11e9-ad1e-0242ac170002'){
                            addProperty(config, 'trackball.space.explicitCenter', val, 1);
                            return;
                        }

                        // Explicit Center Z
                        if (key === 'cc736a92-2274-11e9-b29f-0242ac170002'){
                            addProperty(config, 'trackball.space.explicitCenter', val, 2);
                            return;
                        }


                        // Radius Mode
                        if (key === 'd3843830-2273-11e9-b7c2-0242ac170002'){
                            addProperty(config, 'trackball.space.radiusMode', getConceptValue(val));
                            return;
                        }

                        // Explicit Radius X
                        if (key === '1553379c-2275-11e9-9e1e-0242ac170002'){
                            addProperty(config, 'trackball.space.explicitRadius', val, 0);
                            return;
                        }

                        // Explicit Radius Y
                        if (key === '8954efdc-2275-11e9-b7c2-0242ac170002'){
                            addProperty(config, 'trackball.space.explicitRadius', val, 1);
                            return;
                        }

                        // Explicit Radius Z
                        if (key === '97d7004a-2275-11e9-8bd2-0242ac170002'){
                            addProperty(config, 'trackball.space.explicitRadius', val, 2);
                            return;
                        }


                        // Camera Type
                        if (key === '0b40d042-2276-11e9-8bd2-0242ac170002'){
                            addProperty(config, 'trackball.space.cameraType', getConceptValue(val));
                            return;
                        }

                        // Camera FOV
                        if (key === '758debf6-2276-11e9-9e1e-0242ac170002'){
                            addProperty(config, 'trackball.space.cameraFOV', val);
                            return;
                        }

                        // Camera Near
                        if (key === 'cb30e982-2276-11e9-ad1e-0242ac170002'){
                            addProperty(config, 'trackball.space.cameraNearFar', val, 0);
                            return;
                        }
                        
                        // Camera Far
                        if (key === 'da582a92-2276-11e9-b4cd-0242ac170002'){
                            addProperty(config, 'trackball.space.cameraNearFar', val, 1);
                            return;
                        }

                        // Scene Lighting
                        if (key === 'd316cfe2-27c9-11e9-8639-0242ac170002'){
                            addProperty(config, 'space.sceneLighting', val);
                            return;
                        }

                    }, self);
                }, self);


                cleanEmptyProperties(config);

                if (config.meshes) {
                    var threeDHopFileCount = Object.keys(config.meshes).length;
                    if (threeDHopFileCount > 0){
                        self.threeDHopFileCount(threeDHopFileCount);
                        window.presenter = new Presenter("draw-canvas");
                        init3dhop();
                        threeDHopSetup.setup3DHOP(config);
                        sectiontoolInit();
                    }
                }
            }

            var widgets = [];
            var getCardWidgets = function(card) {
                widgets = widgets.concat(card.model.get('widgets')());
                card.cards().forEach(function(card) {
                    getCardWidgets(card);
                });
            };
            ko.unwrap(self.report.cards).forEach(getCardWidgets);

            this.nodeOptions = ko.observableArray(
                widgets.map(function (widget) {
                    return widget.node
                }).filter(function (node) {
                    return ko.unwrap(node.datatype) === 'file-list';
                })
            );
        },
        template: {
            require: 'text!report-templates/three-d-hop'
        }
    });
});