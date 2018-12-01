from __future__ import unicode_literals
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [('arches_3d', '004_virtual_tours_report_template')]

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
                '60000000-0000-0000-0000-000000000007', 
                'Sketchfab Template', 
                'Displays Sketchfab models', 
                'reports/sketchfab/sketchfab', 
                'sketchfab-report', 
                '{"nodes": []}');
            """,

            """
            DELETE FROM report_templates
                WHERE componentname = 'sketchfab-report';
            """
        )
    ]
