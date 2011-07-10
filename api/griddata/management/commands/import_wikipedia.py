from django.core.management.base import BaseCommand
import urllib2
import json

from django.contrib.gis.geos import Point, Polygon
from django.conf import settings
from griddata.grid import Grid 
from griddata.models import GeoItem

BASE_URL = "http://api.geonames.org/wikipediaBoundingBoxJSON?username=demo&maxRows=100"

class Command(BaseCommand):
    
    def handle(self, **options):
        for zoom, grid_size in settings.GRID_SIZES:
            g = Grid(zoom, grid_size)
            for box in g:
                url = BASE_URL + "&north=%s&south=%s&east=%s&west=%s" % (box.east, box.west, box.north, box.south)
                print url
                data = json.loads(urllib2.urlopen(url).read())
                print str(data)[:150]
                for page in data['geonames']:
                    location = Point(map(float, (page['lng'], page['lat'])))
                    try:
                        item = GeoItem.objects.get(item_type='wikipeida', title=page['title'])
                    except GeoItem.DoesNotExist:
                        item = GeoItem(item_type='wikipeida', title=page['title'])
                    item.location = location
                    item.image_url = page.get('thumbnailImg', None)
                    item.url = "http://" + page['wikipediaUrl']
                    item.description = page['summary']
                    item.save()
                    