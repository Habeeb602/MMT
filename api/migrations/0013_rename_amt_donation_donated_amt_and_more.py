# Generated by Django 4.1.4 on 2023-06-13 08:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0012_remove_donation_is_subscriber"),
    ]

    operations = [
        migrations.RenameField(
            model_name="donation",
            old_name="amt",
            new_name="donated_amt",
        ),
        migrations.RenameField(
            model_name="donation",
            old_name="date",
            new_name="donated_date",
        ),
        migrations.RenameField(
            model_name="donation",
            old_name="remarks",
            new_name="donation_remarks",
        ),
    ]
