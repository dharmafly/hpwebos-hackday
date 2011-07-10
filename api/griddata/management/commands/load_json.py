from django.core.management.base import BaseCommand
from django.contrib.gis.geos import fromstr
from django.contrib.gis.geos import Point, Polygon

import urllib2
import json

from django.conf import settings
from griddata.models import GeoItem, Attachment

URLS = (
    "https://github.com/dharmafly/hpwebos-hackday/raw/master/app/extractors/guardian/data/guardian-travel.json",
)

class Command(BaseCommand):
    
    def find_center(self, ons_code):
        """
        Looks up an ONS code from mapit, creates a poly from it and finds the 
        center point.
        """
        print ons_code
        url = "http://mapit.mysociety.org/area/%s.json" % ons_code
        result = json.loads(urllib2.urlopen(url).read())
        print result['id']
        url = "http://mapit.mysociety.org/area/%s.wkt" % result['id']
        result = urllib2.urlopen(url).read()
        poly = fromstr(result, srid=27700)
        pnt = poly.centroid
        pnt.transform(4326)
        return pnt
    
    def handle(self, **options):
        for url in URLS:
            data =  json.loads(urllib2.urlopen(url).read())
            for area in data:
                center = self.find_center(area['ons_code'])
                for result in area['results']:
                    try:
                        item = GeoItem.objects.get(item_type='guardian-article', url=result['url'])
                    except GeoItem.DoesNotExist:
                        item = GeoItem(item_type='guardian-article', url=result['url'])
                    
                    item.description = result['description']
                    item.image_url = result.get('imageUrl', None)
                    item.url = result.get('url', None)
                    
                    if result.get('lat'):
                        item.location = Point(map(float, (result['lng'], result['lat'])))
                    else:
                        item.location = Point((center.x, center.y))
                    
                    item.save()
                    
                    if 'attachments' in result:
                        for attachment in result['attachments']:
                            try:
                                a = Attachment.objects.get(geoitem=item, url=attachment['url'])
                            except Attachment.DoesNotExist:
                                a = Attachment(geoitem=item, url=attachment['url'])
                            a.caption = attachment['caption']
                            a.save()
