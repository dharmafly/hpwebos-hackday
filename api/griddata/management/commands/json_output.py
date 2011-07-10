import json
import urllib2

from django.core.management.base import BaseCommand

from django.contrib.gis.geos import Point, Polygon

from django.conf import settings
from griddata.grid import Grid 
from griddata.models import GeoItem, Attachment


class Command(BaseCommand):
    
    def grid_id_from_point(self, point):
        # print map(str, [point.x, point.y,])
        point_id = "_".join(map(str, [point.x, point.y,]))
        return "loc_" + point_id
    
    def json_header(self):
        grid = self.neighbours()
        self.output['neighbours'] = dict(grid)
        
    def neighbours(self):
        directions = (('nw', 'n', 'ne'), ('w', 'x', 'e'), ('sw', 's', 'se'))
        grid_top = self.box.north - self.grid_size
        grid_left = self.box.west - self.grid_size
        grid = []
        for row in directions:
            for cell in row:
                grid.append(self.grid_id_from_point(Point(grid_top, grid_left)))
                grid_left = grid_left + self.grid_size
            grid_top = grid_top + self.grid_size
            grid_left = self.box.west - self.grid_size
        return zip([item for sublist in directions for item in sublist], grid)
    
    def get_title(self):
        url = "http://mapit.mysociety.org/point/4326/%s,%s" % (self.box.centroid.x, self.box.centroid.y)
        # print url
        result = json.loads(urllib2.urlopen(url).read())
        for k,v in result.items():
            if v['type_name'] == "London Assembly constituency":
                return v['name']
            if v['type_name'] == "County council ward":
                return v['name']
            if v['type_name'] == "District council ward":
                return v['name']
            if v['type_name'] == "London borough ward":
                return v['name']
            if v['type_name'] == "London borough":
                return v['name']
            if v['type_name'] == "UK Parliament constituency":
                return v['name']
            if v['type_name'] == "District council":
                return v['name']
            if v['type_name'] == "Greater London Authority":
                return v['name']
            if v['type_name'] == "County council":
                return v['name']
            if v['type_name'] == "Unitary Authority":
                return v['name']
            if "Super Output Area" in v['type_name']:
                return v['name']
            
            print k,v['type_name'], "---",v['name']
        # import sys
        # sys.exit()
        
    
    def handle(self, **options):
        for zoom, grid_size in settings.GRID_SIZES:
            self.grid_size = grid_size
            g = Grid(zoom, grid_size)
            for box in g:
                self.output = {}
                self.box = box
                self.output['box_title'] = self.get_title()
                grid = self.json_header()
                box.set_srid(4326)
                items = GeoItem.objects.filter(location__within=box)
                if items:
                    self.output['results'] = []
                    for i in items:
                        self.output['results'].append(i.as_dict())
                    print len(self.output['results'])
                file_id = self.grid_id_from_point(Point((box.north, box.west)))
                # print file_id
                out = open("%s%s/%s.json" % (settings.JSON_OUTPUT_DIR, zoom, file_id), 'w')
                out.write(json.dumps(self.output))