# Generated by Django 4.1.4 on 2023-06-13 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0013_rename_amt_donation_donated_amt_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="donation",
            old_name="donated_amt",
            new_name="amt",
        ),
        migrations.RenameField(
            model_name="donation",
            old_name="donated_date",
            new_name="date",
        ),
        migrations.RenameField(
            model_name="donation",
            old_name="donation_remarks",
            new_name="remarks",
        ),
        migrations.AddField(
            model_name="donation",
            name="is_subscriber",
            field=models.BooleanField(default=False),
        ),
    ]
