define([
    'underscore',
    'jquery',
    'knockout',
    'knockout-mapping',
    'viewmodels/report',
    'arches',
    'imagesloaded',
    'twentytwenty',
    'twentytwenty-move',
    'knockstrap',
    'bindings/chosen'
], function(_, $, ko, koMapping, ReportViewModel, arches) {

    function displayThrobber() {
        $('.loading-mask').css("display", "block");
    }
    
    function hideThrobber() {
        $('.loading-mask').css("display", "none");
    }
    
    function setBeforeAfterLabels(beforeLabel, afterLabel) {
        $('.twentytwenty-before-label').attr('data-content', beforeLabel);
        $('.twentytwenty-after-label').attr('data-content', afterLabel);
    }
    
    return ko.components.register('before-after-image-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['nodes'];
            ReportViewModel.apply(this, [params]);

            var beforeLabel = "";
            var afterLabel = "";

            self.imgs = ko.computed(function() {
                var imgs = [];
                var nodes = self.nodes();

                self.tiles().forEach(function(tile) {
                    _.each(tile.data, function(val, key) {

                        val = koMapping.toJS(val);

                        if (key === "2d908f60-1c0f-11e9-9ce8-0242ac120004"){
                            afterLabel = val;
                            return;
                        }

                        if (key === "10443880-1c0f-11e9-9ce8-0242ac120004") {
                            beforeLabel = val;
                        }

                        if (Array.isArray(val)) {
                            val.forEach(function(item) {
                                if (item.status &&
                                    item.type &&
                                    item.status === 'uploaded' &&
                                    item.type.indexOf('image') > -1 &&
                                    _.contains(nodes, key)
                                ) {
                                    var img = {
                                        src: item.url,
                                        alt: item.name
                                    }

                                    if (key === "780108d0-1661-11e9-bf95-0242ac140004"){
                                        img.type = "before"
                                    }
                                    else if (key === "8ce12c52-1662-11e9-bf95-0242ac140004"){
                                        img.type = "after"
                                    }

                                    imgs.push(img);
                                }
                            });
                            return;
                        }
                    }, self);
                }, self);
                if (imgs.length === 0) {
                    imgs = [{
                        src: arches.urls.media + 'img/photo_missing.png',
                        alt: ''
                    }];
                }
                return imgs;
            });

            if (self.imgs().length > 1) {
                var beforeImg = self.imgs().find(img => {
                    return img.type === 'before'
                });
                var afterImage = self.imgs().find(img => {
                    return img.type === 'after'
                });

                $('#before-image').attr('src', beforeImg.src);
                $('#before-image').attr('alt', beforeImg.alt);

                $('#after-image').attr('src', afterImage.src);
                $('#after-image').attr('alt', afterImage.alt);

                $('#before-after-image-container')
                    .imagesLoaded()
                    .progress(function () {
                        displayThrobber();
                    })
                    .done(function () {
                        hideThrobber();
                        $('#before-after-image-container').twentytwenty();

                        setBeforeAfterLabels(beforeLabel, afterLabel);
                    });
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
                widgets.map(function(widget) {
                    return widget.node;
                }).filter(function(node) {
                    return ko.unwrap(node.datatype) === 'file-list';
                })
            );
        },
        template: {
            require: 'text!report-templates/before-after-image'
        }
    });
});