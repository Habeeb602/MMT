# Generated by Django 4.1.4 on 2023-06-15 07:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0015_expense"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="Expense",
            new_name="Expenses",
        ),
    ]
