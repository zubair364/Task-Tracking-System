from django.contrib import admin
from django.utils.translation import gettext_lazy as _

# Customize admin site
admin.site.site_header = _('Task Management System')
admin.site.site_title = _('Task Management Admin')
admin.site.index_title = _('Administration')