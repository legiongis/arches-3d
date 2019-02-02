define([
    'underscore',
    'knockout',
    'viewmodels/report',
    'arches',
    'reports/three-d-hop/three-d-hop-setup',
    'knockstrap',
    'bindings/chosen'
], function (_, ko, ReportViewModel, arches, threeDHopSetup) {

        function getValue(valueid){
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

        return ko.components.register('three-d-hop-report', {
        viewModel: function (params) {
            var self = this;
            params.configKeys = ['nodes'];
            ReportViewModel.apply(this, [params]);

            self.threeDHopFiles = ko.observableArray([]);

            if (self.report.get('tiles')) {
                var threeDHopFiles = [];
                var config = {}
                self.report.get('tiles').forEach(function (tile) {
                    _.each(tile.data, function (val, key) {

                        // 3D model file
                        if (Array.isArray(val)) {
                            val.forEach(function (item) {

                                if (item.status &&
                                    item.status === 'uploaded' &&
                                    (item.name.split('.').pop() == 'ply' || item.name.split('.').pop() == 'nxs')
                                ) {
                                    threeDHopFiles.push({
                                        src: item.url,
                                        alt: item.name
                                    });

                                    var mesh = new Object();
                                    mesh[item.name] = { url: item.url};
                                    config.meshes.push(mesh);

                                    var instance = new Object;
                                    instance[item.name] = { mesh: item.name}
                                    config.modelInstances.push(instance);
                                }
                            });
                            return;
                        }


                        // // Trackball

                        // TrackballType
                        if (key === '1123258a-226e-11e9-8639-0242ac170002'){
                            config.trackball.type = getValue(val);
                            return;
                        }

                        // Start Phi
                        if (key === '4fef73c2-226e-11e9-9e1e-0242ac170002'){
                            config.trackball.trackOptions.startPhi = val;
                            return;
                        }    

                        // Start Theta
                        if (key === '77472ef6-226e-11e9-8bd2-0242ac170002'){
                            config.trackball.trackOptions.startTheta = val;
                            return;
                        }

                        // Start Distance
                        if (key === '84a2c6fa-226e-11e9-b4cd-0242ac170002'){
                            config.trackball.trackOptions.startDistance = val;
                            return;
                        }

                        // Start Pan X
                        if (key === '92d84f1a-226e-11e9-8639-0242ac170002'){
                            config.trackball.trackOptions.startPanX = val;
                            return;
                        }

                        // Start Pan Y
                        if (key === 'a4030654-226e-11e9-b29f-0242ac170002'){
                            config.trackball.trackOptions.startPanY = val;
                            return;
                        }

                        // Start Pan Z
                        if (key === 'b772a67c-226e-11e9-ab9d-0242ac170002'){
                            config.trackball.trackOptions.startPanZ = val;
                            return;
                        }

                        // Min Dist
                        if (key === '43195b86-26e7-11e9-b29f-0242ac170002'){
                            config.trackball.trackOptions.minMaxDist[0] = val;
                            return;
                        }

                        // Max Dist
                        if (key === '67f05c8e-26e7-11e9-8639-0242ac170002'){
                            config.trackball.trackOptions.minMaxDist[1] = val;
                            return;
                        }

                        // Min Phi
                        if (key === '97b84d6e-26e7-11e9-ab9d-0242ac170002'){
                            config.trackball.trackOptions.minMaxPhi[0] = val;
                            return;
                        }

                        // Max Phi
                        if (key === 'b18eb494-26e7-11e9-b4cd-0242ac170002'){
                            config.trackball.trackOptions.minMaxPhi[1] = val;
                            return;
                        }

                        // Min Theta
                        if (key === '1c873974-26e8-11e9-8bd2-0242ac170002'){
                            config.trackball.trackOptions.minMaxTheta[0] = val;
                            return;
                        }

                        // Max Theta
                        if (key === '2d7ebcb6-26e8-11e9-8639-0242ac170002'){
                            config.trackball.trackOptions.minMaxTheta[1] = val;
                            return;
                        }

                        // Min Pan X
                        if (key === '49977ba4-26e8-11e9-ad1e-0242ac170002'){
                            config.trackball.trackOptions.minMaxPanX[0] = val;
                            return;
                        }

                        // Max Pan X
                        if (key === '5ca61af2-26e8-11e9-8639-0242ac170002'){
                            config.trackball.trackOptions.minMaxPanX[1] = val;
                            return;
                        }

                        // Min Pan Y
                        if (key === '743bc66c-26ed-11e9-8639-0242ac170002'){
                            config.trackball.trackOptions.minMaxPanY[0] = val;
                            return;
                        }

                        // Max Pan Y
                        if (key === '8b10fdf8-26ed-11e9-8c52-0242ac170002'){
                            config.trackball.trackOptions.minMaxPanY[1] = val;
                            return;
                        }

                        // Min Pan Z
                        if (key === 'b1d2d47a-26ed-11e9-8c52-0242ac170002'){
                            config.trackball.trackOptions.minMaxPanZ[0] = val;
                            return;
                        }
                        
                        // Max Pan Z
                        if (key === 'c00d79f0-26ed-11e9-b29f-0242ac170002'){
                            config.trackball.trackOptions.minMaxPanZ[1] = val;
                            return;
                        }


                        // //Space

                        // Center Mode
                        if (key === 'af717052-2273-11e9-b4cd-0242ac170002'){
                            config.space.centerMode = getValue(val);
                            return;
                        }

                        // Explicit Center X
                        if (key === '4badaf1c-2274-11e9-ad1e-0242ac170002'){
                            config.space.explicitCenter[0] = val;
                            return;
                        }

                        // Explicit Center Y
                        if (key === '41e3ad9c-2274-11e9-ad1e-0242ac170002'){
                            config.space.explicitCenter[1] = val;
                            return;
                        }

                        // Explicit Center Z
                        if (key === 'cc736a92-2274-11e9-b29f-0242ac170002'){
                            config.space.explicitCenter[2] = val;
                            return;
                        }


                        // Radius Mode
                        if (key === 'd3843830-2273-11e9-b7c2-0242ac170002'){
                            config.space.radiusMode = getValue(val);
                            return;
                        }

                        // Explicit Radius X
                        if (key === '1553379c-2275-11e9-9e1e-0242ac170002'){
                            config.space.explicitRadius[0] = val;
                            return;
                        }

                        // Explicit Radius Y
                        if (key === '8954efdc-2275-11e9-b7c2-0242ac170002'){
                            config.space.explicitRadius[1] = val;
                            return;
                        }

                        // Explicit Radius Z
                        if (key === '97d7004a-2275-11e9-8bd2-0242ac170002'){
                            config.space.explicitRadius[2] = val;
                            return;
                        }


                        // Camera Type
                        if (key === '0b40d042-2276-11e9-8bd2-0242ac170002'){
                            config.space.cameraType = getValue(val);
                            return;
                        }

                        // Camera FOV
                        if (key === '758debf6-2276-11e9-9e1e-0242ac170002'){
                            config.space.cameraFOV = val;
                            return;
                        }

                        // Camera Near
                        if (key === 'cb30e982-2276-11e9-ad1e-0242ac170002'){
                            config.space.cameraNearFar[0] = val;
                            return;
                        }
                        
                        // Camera Far
                        if (key === 'da582a92-2276-11e9-b4cd-0242ac170002'){
                            config.space.cameraNearFar[1] = val;
                            return;
                        }

                    }, self);
                }, self);

                if (threeDHopFiles.length > 0) {
                    config.source = threeDHopFiles[0].src;
                    self.threeDHopFiles(threeDHopFiles);
                    window.presenter = new Presenter("draw-canvas");
                    init3dhop();
                    threeDHopSetup.setup3DHOP(config);
                    sectiontoolInit();
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
