define(['jquery', 'knockout', 'arches', 'search-data', 'utils/masonry.pkgd'], function($, ko, arches, data) {
    /**
     * A base viewmodel for functions
     *
     * @constructor
     * @name SavedSearchesViewModel
     *
     * @param  {string} params - a configuration object
     */
    var SavedSearchesViewModel = function(params) {
        var self = this;
        var mediaUrl = arches.urls.uploadedfiles;
        self.items = ko.observableArray([]);
        data.saved_searches.forEach(
            function(search) {
                var searchImageUrl = (search.IMAGE && search.IMAGE.length > 0) ? search.IMAGE[0].url : '';
                self.items.push({
                    image: searchImageUrl,
                    title: search.SEARCH_NAME,
                    subtitle: search.SEARCH_DESCRIPTION,
                    searchUrl: search.SEARCH_URL
                })
            })

        self.options = {
            masonry: {
                itemSelector: '.ss-grid-item',
				columnWidth: 500,
                gutterWidth: 25,
            }
        };
    };
    return SavedSearchesViewModel;
});
