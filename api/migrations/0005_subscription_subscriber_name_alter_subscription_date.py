# Generated by Django 4.1.4 on 2023-06-07 12:05

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_subscription_date"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="subscriber_name",
            field=models.CharField(
                default="<django.db.models.fields.related.ForeignKey>", max_length=40
            ),
        ),
        migrations.AlterField(
            model_name="subscription",
            name="date",
            field=models.DateField(default=datetime.date(2023, 6, 7)),
        ),
    ]
