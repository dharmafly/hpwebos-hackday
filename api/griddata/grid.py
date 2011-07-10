from django.conf import settings
from django.contrib.gis.geos import Point, Polygon

class Grid():
    def __init__(self, zoom, grid_size):
        self.zoom = zoom
        self.grid_size = grid_size
        self.point = None
        self.X_OFFSET = 0
        self.Y_OFFSET = 0
        
        grid_bounds = settings.GRID_BOUNDS
        
        self.X_STEPS = self._make_ranges(grid_bounds['SOUTH'], grid_bounds['NORTH'])
        self.Y_STEPS = self._make_ranges(grid_bounds['WEST'], grid_bounds['EAST'])
        
        
    def _make_ranges(self, start, end, step_range=None):
        if not step_range:
            step_range = self.grid_size
        STEPS = []
        while start < end:
            STEPS.append(start)
            start = start + step_range
        return STEPS
    
    def box_from_point(self, x, y):
        top = y
        left = x
        bottom = top + self.grid_size
        right = left + self.grid_size
        poly = Polygon.from_bbox((top, left, bottom, right))
        poly.set_srid(4326)
        poly.north = top
        poly.south = bottom
        poly.west = left
        poly.east = right
        return poly
    
    def get_next_grid_point(self):
        x,y = self.X_STEPS[self.X_OFFSET], self.Y_STEPS[self.Y_OFFSET]
        AT_END = 0
        
        if self.X_OFFSET == len(self.X_STEPS)-1:
            AT_END = AT_END + 1
            self.X_OFFSET = 0
            self.Y_OFFSET = self.Y_OFFSET + 1
            if self.Y_OFFSET == len(self.Y_STEPS):
                AT_END = AT_END +1
        else:
            self.X_OFFSET = self.X_OFFSET + 1
        if AT_END == 2:
            raise StopIteration
    
        print x,y, AT_END
        return self.box_from_point(x,y)
        
    def next(self):
        return self.get_next_grid_point()
        
    
    def __iter__(self):
        return self