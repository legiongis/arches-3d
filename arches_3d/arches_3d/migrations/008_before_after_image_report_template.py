from __future__ import unicode_literals
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [('arches_3d', '007_360_image_report_template')]

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
                '70000000-0000-0000-0000-000000000009', 
                'Before & After Image Template', 
                'Displays Before/After images', 
                'reports/before-after-image', 
                'before-after-image-report', 
                '{"nodes": []}');
            """,

            """
            DELETE FROM report_templates
                WHERE componentname = 'before-after-image-report';
            """
        )
    ]
