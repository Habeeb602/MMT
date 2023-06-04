from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subscriber, Subscription
from .serializers import SubscriberSerializer, CreateSubscriberSerializer, SubscriptionSerializer, CreateSubscriptionSerializer, UpdateSubscriberSerializer
# Create your views here.


class SubscriberView(generics.ListAPIView):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer


class CreateSubscriberView(APIView):
    serializer_class = CreateSubscriberSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            
            name = serializer.data.get("name")
            address = serializer.data.get("address")
            phone_num = serializer.data.get("phone")
            family_name = serializer.data.get("family_name")
            monthly_sub_amt = serializer.data.get("monthly_sub_amt")

            if Subscriber.objects.filter(phone=phone_num).exists():
                print(serializer)
                return Response({"Duplicate Phone Number" : "This phone number already exists!"}, status=status.HTTP_406_NOT_ACCEPTABLE)

            subscriber = Subscriber(name=name, address=address, phone=phone_num, family_name=family_name, monthly_sub_amt=monthly_sub_amt)
            subscriber.save()
            
            return Response(SubscriberSerializer(subscriber).data, status=status.HTTP_200_OK)
        
        return Response({"Bad Request" : "Invalid data, Check data size and format!!!"}, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteSubscriberView(APIView):
    def post(self, request, format=None):
        subscriber = Subscriber.objects.get(pk=request.data['id'])
        if subscriber is not None:
            subscriber.delete()
            return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
        return Response({'Error': 'Subscriber not found!!!'}, status=status.HTTP_404_NOT_FOUND)

class UpdateSubscriberView(APIView):
    serializer_class = UpdateSubscriberSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        # if seri

class SubscriptionView(generics.ListAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer


class CreateSubscriptionView(APIView):
    serializer_class = CreateSubscriptionSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            amt = serializer.data.get("amt")
            remarks = serializer.data.get("remarks")
            subscriber = Subscriber.objects.filter(id = serializer.data.get("subscriber"))[0]
            
            subscription = Subscription(amt=amt, remarks=remarks, subscriber=subscriber)
            subscription.save()

            return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_200_OK)
        
        return Response({"Bad Request" : "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST)


