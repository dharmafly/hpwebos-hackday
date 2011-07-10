from django.contrib.gis.db import models

class GeoItem(models.Model):
    item_type = models.CharField(blank=True, max_length=255)
    url = models.URLField(blank=True, verify_exists=False)
    rank = models.CharField(blank=True, max_length=100)
    title = models.CharField(blank=True, max_length=255)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, verify_exists=False, null=True)
    location = models.PointField(srid=4326)
    
    objects = models.GeoManager()
    
    def as_dict(self):
        obj_dict = {
            'type' : self.item_type,
            'url' : self.url,
            'rank' : self.rank,
            'title' : self.title,
            'description' : self.description,
        }

        l = self.location
        obj_dict['wgs84_lat'] = l.y
        obj_dict['wgs84_lon'] = l.x
        
        attachments = self.attachment_set.all()
        if attachments:
            obj_dict['attachments'] = []
            for a in attachments:
                obj_dict['attachments'].append(a.as_dict())
            
        
        return obj_dict
        
class Attachment(models.Model):
    geoitem = models.ForeignKey(GeoItem)
    url = models.URLField(blank=True, verify_exists=False)
    caption = models.TextField(blank=True)
    
    def as_dict(self):
        obj_dict = {
            'url' : self.url,
            'caption' : self.caption,
        }
        return obj_dict