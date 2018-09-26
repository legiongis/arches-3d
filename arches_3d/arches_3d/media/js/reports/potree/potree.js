define([
    'underscore',
    'knockout',
    'viewmodels/report',
    'reports/potree/potree-setup',
    'arches',
    'knockstrap',
    'bindings/chosen',
], function (_, ko, ReportViewModel, potreeSetup) {
        return ko.components.register('potree-report', {
        viewModel: function (params) {
            var self = this;
            params.configKeys = ['nodes'];
            ReportViewModel.apply(this, [params]);

            self.potreeZipFiles = ko.observableArray([]);

            if (self.report.get('tiles')) {
                var potreeZipFiles = [];
                self.report.get('tiles').forEach(function (tile) {
                    _.each(tile.data, function (val) {
                        if (Array.isArray(val)) {
                            val.forEach(function (item) {

                                if (item.status &&
                                    item.status === 'uploaded' &&
                                    (item.name.split('.').pop() == 'zip')
                                ) {
                                    potreeZipFiles.push({
                                        src: item.url,
                                        alt: item.name
                                    });
                                }
                            });
                        }
                    }, self);
                }, self);

                if (potreeZipFiles.length > 0) {
                    self.potreeZipFiles(potreeZipFiles);
                    var filepath = potreeZipFiles[0].src;
                    window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));
                    potreeSetup.setupPotree("https://testarchesstorage.blob.core.windows.net/arches/uploadedfiles/stanford_bunny_reduced.ply.potree/cloud.js", "Bunny Point Cloud")
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
            require: 'text!report-templates/potree'
        }
    });
});
