# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2018-11-05 02:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('snippets', '0003_auto_20181029_2253'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='assigned',
        ),
        migrations.RemoveField(
            model_name='task',
            name='sprint',
        ),
        migrations.DeleteModel(
            name='Sprint',
        ),
        migrations.DeleteModel(
            name='Task',
        ),
    ]
