# Generated by Django 4.1.4 on 2023-06-05 09:06

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_subscription_created_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="date",
            field=models.DateField(default=datetime.date(2023, 6, 5)),
        ),
    ]