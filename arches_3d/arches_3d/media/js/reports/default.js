define(['knockout', 'viewmodels/report'], function (ko, ReportViewModel) {

    $(document).on("click", "#report-body-toggle-button", function() {
        $("#report-body").toggle(function(){
            $('.report-metadata-section').get(0).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        $('#report-body-toggle-button-icon').toggleClass("fa-plus fa-minus");
    });

    return ko.components.register('default-report', {
        viewModel: function(params) {
            params.configKeys = [];

            ReportViewModel.apply(this, [params]);
        },
        template: { require: 'text!report-templates/default' }
    });
});
