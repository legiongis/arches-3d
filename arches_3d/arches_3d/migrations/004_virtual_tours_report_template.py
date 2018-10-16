from __future__ import unicode_literals
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [('arches_3d', '003_potree_report_template')]

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
                '50000000-0000-0000-0000-000000000007', 
                'Virtual Tours Template', 
                'Displays Virtual Tours', 
                'reports/virtual-tours/virtual-tours', 
                'virtual-tours-report', 
                '{"nodes": []}');
            """,

            """
            DELETE FROM report_templates
                WHERE componentname = 'virtual-tours-report';
            """
        )
    ]
