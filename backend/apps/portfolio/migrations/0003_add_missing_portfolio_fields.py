# Generated migration to add missing fields to portfolio table

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0002_alter_portfolio_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='portfolio',
            name='sector',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='portfolio',
            name='is_automated',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='portfolio',
            name='target_allocation',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
