from rest_framework import serializers
from .models import Subscriber, Subscription


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ("id", "name", "address", "phone", "family_name", "monthly_sub_amt", "created_at")

        

class CreateSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ("name", "address", "phone", "family_name", "monthly_sub_amt")

class UpdateSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ("id", "name", "address", "phone", "family_name", "monthly_sub_amt")
        
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ("id", "amt", "remarks", "subscriber")

class CreateSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ("amt", "remarks", "subscriber")