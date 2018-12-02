from __future__ import unicode_literals
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [('arches_3d', '005_sketchfab_report_template')]

    operations = [
        migrations.RunSQL(
            """
            INSERT INTO report_templates(
                templateid, 
                name, 
                description, 
                component, 
                componentname, 
                defaultconfig) 
            VALUES (
                '70000000-0000-0000-0000-000000000007', 
                'Video Template', 
                'Displays Video models', 
                'reports/video/video', 
                'video-report', 
                '{"nodes": []}');
            """,

            """
            DELETE FROM report_templates
                WHERE componentname = 'video-report';
            """
        )
    ]
