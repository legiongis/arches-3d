from __future__ import unicode_literals
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [('arches_3d', '006_video_report_template')]

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
                '70000000-0000-0000-0000-000000000008', 
                '360 Image Template', 
                'Displays 360 images', 
                'reports/360-image', 
                '360-image-report', 
                '{"nodes": []}');
            """,

            """
            DELETE FROM report_templates
                WHERE componentname = '360-image-report';
            """
        )
    ]
