from __future__ import unicode_literals
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [('arches_3d', '002_three_d_hop_report_template')]

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
                '50000000-0000-0000-0000-000000000006', 
                'Potree Template', 
                'Displays Potree models', 
                'reports/potree/potree', 
                'potree-report', 
                '{"nodes": []}');
            """,

            """
            DELETE FROM report_templates
                WHERE componentname = 'potree-report';
            """
        )
    ]
