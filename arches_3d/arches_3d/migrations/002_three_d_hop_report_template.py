from __future__ import unicode_literals
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [('arches_3d', '001_report_template')]

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
                '50000000-0000-0000-0000-000000000005', 
                '3D HOP Template', 
                'Displays 3D HOP models', 
                'reports/three-d-hop/three-d-hop', 
                'three-d-hop-report', 
                '{"nodes": []}');
            """,

            """
            DELETE FROM report_templates
                WHERE componentname = 'three-d-hop-report';
            """
        )
    ]
