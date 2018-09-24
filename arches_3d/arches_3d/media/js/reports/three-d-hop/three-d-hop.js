define([
    'underscore',
    'knockout',
    'viewmodels/report',
    'arches',
    'reports/three-d-hop/three-d-hop-setup',
    'knockstrap',
    'bindings/chosen'
], function (_, ko, ReportViewModel, arches, threeDHopSetup) {
        return ko.components.register('three-d-hop-report', {
        viewModel: function (params) {
            var self = this;
            params.configKeys = ['nodes'];
            ReportViewModel.apply(this, [params]);

            self.threeDHopFiles = ko.observableArray([]);

            if (self.report.get('tiles')) {
                var threeDHopFiles = [];
                self.report.get('tiles').forEach(function (tile) {
                    _.each(tile.data, function (val) {
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
                                }
                            });
                        }
                    }, self);
                }, self);

                if (threeDHopFiles.length > 0) {
                    self.threeDHopFiles(threeDHopFiles);
                    var filepath = threeDHopFiles[0].src;
                    window.presenter = new Presenter("draw-canvas");
                    init3dhop();
                    threeDHopSetup.setup3DHOP(filepath);
                    sectiontoolInit()
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
