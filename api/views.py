from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subscriber, Subscription, Donation, Expenses
from .serializers import SubscriberSerializer, CreateSubscriberSerializer, SubscriptionSerializer, CreateSubscriptionSerializer, DonationSerializer, CreateDonationSerializer, ExpensesSerializer
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
    serializer_class = CreateSubscriberSerializer

    def patch(self, request, format=None):
        print("Update data:", request.data)
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.data.get("name")
            address = serializer.data.get("address")
            phone_num = serializer.data.get("phone")
            family_name = serializer.data.get("family_name")
            monthly_sub_amt = serializer.data.get("monthly_sub_amt")
            
            if Subscriber.objects.filter(Q(phone=phone_num) & ~Q(pk=request.data['id'])).exists():
                print(serializer)
                return Response({"Duplicate Phone Number" : "This phone number already exists!"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            
            subscriber = Subscriber.objects.get(pk=request.data['id'])
            subscriber.name = name
            subscriber.address = address
            subscriber.phone = phone_num
            subscriber.family_name = family_name
            subscriber.monthly_sub_amt = monthly_sub_amt
            subscriber.save(update_fields=["name", "address", "phone", "family_name", "monthly_sub_amt"]) 
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print()
            return Response({"Bad Request" : "Invalid data...\n" + str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)



class SubscriptionView(generics.ListAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer



class CreateSubscriptionView(APIView):
    serializer_class = CreateSubscriptionSerializer

    def post(self, request, format=None):
        print(request.data)
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            date = serializer.data.get("date")
            amt = serializer.data.get("amt")
            remarks = serializer.data.get("remarks")
            subscriber = Subscriber.objects.filter(id = serializer.data.get("subscriber"))[0]
            
            subscription = Subscription(date=date, amt=amt, remarks=remarks, subscriber=subscriber, subscriber_name=subscriber.name)
            subscription.save()

            return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_200_OK)
        
        return Response({"Bad Request" : "Invalid data... " + str(serializer.error_messages)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateSubscriptionView(APIView):
    serializer_class = CreateSubscriptionSerializer

    def patch(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            subscription = Subscription.objects.get(pk=request.data["id"])
            
            subscription.date = serializer.data.get("date")
            subscription.amt = serializer.data.get("amt")
            subscription.remarks = serializer.data.get("remarks")
            subscription.subscriber = Subscriber.objects.filter(id = serializer.data.get("subscriber"))[0]
            subscription.subscriber_name = subscription.subscriber.name

            subscription.save(update_fields=["date", "amt", "remarks", "subscriber", "subscriber_name"])
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response({"Message": "Data is not valid, please try again"}, status=status.HTTP_400_BAD_REQUEST)

class DeleteSubscriptionView(APIView):
    
    def post(self, request, format=None):
        subscription = Subscription.objects.get(pk=request.data["id"])
        if subscription is not None:
            subscription.delete()
            return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
        return Response({'Error': 'Subscriber not found!!!'}, status=status.HTTP_404_NOT_FOUND)


class DonationView(generics.ListAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer


class CreateDonationView(APIView):
    serializer_class = CreateDonationSerializer
    
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # fields = ("date", "amt", "remarks", "is_subscriber", "donor_name", "donor_phone")
            date = serializer.data.get("date")
            amt = serializer.data.get("amt")
            remarks = serializer.data.get("remarks")
            is_subscriber = serializer.data.get("is_subscriber")
            donor_name = serializer.data.get("donor_name")
            donor_phone = serializer.data.get("donor_phone")
            donation = Donation(date=date, amt=amt, remarks=remarks, is_subscriber=is_subscriber, donor_name=donor_name, donor_phone=donor_phone)
            donation.save()
            return Response(DonationSerializer(donation).data, status=status.HTTP_200_OK)
        
        return Response({"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST)

class UpdateDonationView(APIView):
    serializer_class = CreateDonationSerializer

    def patch(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            donation = Donation.objects.get(pk=request.data["id"])
            donation.date = serializer.data.get("date")
            donation.amt = serializer.data.get("amt")
            donation.remarks = serializer.data.get("remarks")
            donation.is_subscriber = serializer.data.get("is_subscriber")
            donation.donor_name = serializer.data.get("donor_name")
            donation.donor_phone = serializer.data.get("donor_phone")
            
            donation.save(update_fields=["date", "amt", "remarks", "is_subscriber", "donor_name", "donor_phone"])

            return Response(CreateDonationSerializer(donation).data, status=status.HTTP_200_OK)
        
        print(serializer.error_messages)
        return Response({"Message": "Data is not valid, please try again"}, status=status.HTTP_400_BAD_REQUEST)

class DeleteDonationView(APIView):

    def post(self, request, format=None):
        donation = Donation.objects.get(pk=request.data["id"])
        if donation is not None:
            donation.delete()
            return Response({"Message": "Success!!!"}, status=status.HTTP_200_OK)
        return Response({"Message": "Bad Request!!!"}, status=status.HTTP_400_BAD_REQUEST)


class ExpensesView(generics.ListAPIView):
    queryset = Expenses.objects.all()
    serializer_class = ExpensesSerializer


class CreateExpensesView(APIView):
    serializer_class = ExpensesSerializer
    
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            date = serializer.data.get("date")
            amt = serializer.data.get("amt")
            type = serializer.data.get("type")
            remarks = serializer.data.get("remarks")
            expenses = Expenses(date=date, amt=amt, type=type, remarks=remarks)
            expenses.save()
            return Response(ExpensesSerializer(expenses).data, status=status.HTTP_200_OK)
        print(serializer)
        return Response({"Bad Request": "The data is not valid, please check!!!"}, status=status.HTTP_400_BAD_REQUEST)

class UpdateExpensesView(APIView):
    serializer_class = ExpensesSerializer

    def patch(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            expenses = Expenses.objects.get(pk=request.data["id"])
            expenses.date = serializer.data.get("date")
            expenses.amt = serializer.data.get("amt")
            expenses.type = serializer.data.get("type")
            expenses.remarks = serializer.data.get("remarks")

            expenses.save(update_fields=["date", "amt", "type", "remarks"])
            return Response(ExpensesSerializer(expenses).data, status=status.HTTP_200_OK)
        print(serializer)
        return Response({"Bad Request": "The data is not valid, please check!!!"}, status=status.HTTP_400_BAD_REQUEST)

class DeleteExpensesView(APIView):
    
    def post(self, request, format=None):
        expenses = Expenses.objects.get(pk=request.data["id"])
        if expenses is not None:
            expenses.delete()
            return Response({"Message": "Success!!!"}, status=status.HTTP_200_OK)
        return Response({"Message": "Bad Request!!!"}, status=status.HTTP_400_BAD_REQUEST)