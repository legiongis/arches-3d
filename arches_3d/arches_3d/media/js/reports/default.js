define(['knockout', 'viewmodels/report'], function (ko, ReportViewModel) {

    $(document).on("click", "#report-body-toggle-button", function() {
        $("#report-body").toggle();
    })

    return ko.components.register('default-report', {
        viewModel: function(params) {
            params.configKeys = [];

            ReportViewModel.apply(this, [params]);
        },
        template: { require: 'text!report-templates/default' }
    });
});
