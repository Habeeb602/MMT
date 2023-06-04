from django.db import models

# Create your models here.



class Subscriber(models.Model):
    name = models.CharField(max_length=30, null= False)
    address = models.CharField(max_length=50, null = True)
    phone = models.CharField(max_length=10, null = False)
    family_name = models.CharField(max_length=30, null= True)
    monthly_sub_amt = models.IntegerField(null = False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ID: {self.id}"


class Subscription(models.Model):
    amt = models.IntegerField(null=False)
    remarks = models.CharField(max_length=30, null=True)
    subscriber = models.ForeignKey(Subscriber, on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(auto_now_add=True)

