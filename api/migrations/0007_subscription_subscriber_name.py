# Generated by Django 4.1.4 on 2023-06-07 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_remove_subscription_subscriber_name_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="subscriber_name",
            field=models.CharField(
                default="<django.db.models.fields.related.ForeignKey>", max_length=40
            ),
        ),
    ]
