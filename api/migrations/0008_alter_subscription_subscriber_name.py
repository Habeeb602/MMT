# Generated by Django 4.1.4 on 2023-06-07 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_subscription_subscriber_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="subscription",
            name="subscriber_name",
            field=models.CharField(default="None", max_length=40),
        ),
    ]
