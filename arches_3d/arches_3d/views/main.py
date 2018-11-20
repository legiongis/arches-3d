from django.shortcuts import render


def report_templates(request, template="text"):
    print 'In report_templates view'
    viewer_only = request.GET.get('viewer_only', False)
    print viewer_only
    if viewer_only:
        extends = 'views/report-templates/empty-template.htm'
    else:
        extends = 'views/report-templates/default.htm'
    print extends 
    return render(request, 'views/report-templates/%s.htm' % template, { 'extends': extends })