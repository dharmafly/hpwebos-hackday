from django.contrib.gis import admin
from models import GeoItem

class GeoItemAdmin(admin.OSMGeoAdmin):
    list_display = ['title', 'item_type']

admin.site.register(GeoItem, GeoItemAdmin)