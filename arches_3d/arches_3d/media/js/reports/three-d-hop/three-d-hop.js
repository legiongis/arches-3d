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

                        // TrackballType
                        if (key === 'a06ca0f2-1109-11e9-8b03-0242ac140004'){
                            config.trackballType = getValue(val);
                        }

                        // 3D model file
                        else if (Array.isArray(val)) {
                            val.forEach(function (item) {

                                if (item.status &&
                                    item.status === 'uploaded' &&
                                    (item.name.split('.').pop() == 'ply' || item.name.split('.').pop() == 'nxs')
                                ) {
                                    threeDHopFiles.push({
                                        src: item.url,
                                        alt: item.name
                                    });
                                }
                            });
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
