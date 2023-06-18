from rest_framework import serializers
from .models import Subscriber, Subscription, Donation, Expenses


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ("id", "name", "address", "phone", "family_name", "monthly_sub_amt", "created_at")

        

class CreateSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ("name", "address", "phone", "family_name", "monthly_sub_amt")
        
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ("id", "date", "amt", "remarks", "subscriber", "subscriber_name")

class CreateSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ("date", "amt", "remarks", "subscriber", "subscriber_name")
    
class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ("id", "date", "amt", "remarks", "is_subscriber", "donor_name", "donor_phone")

class CreateDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ("date", "amt", "remarks", "is_subscriber", "donor_name", "donor_phone")
    
class ExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenses
        fields = ("id", "date", "amt", "type", "remarks")

class CreateExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenses
        fields = ("date", "amt", "type", "remarks")
