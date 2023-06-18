from django.urls import path
from .views import SubscriberView, CreateSubscriberView, CreateSubscriptionView, SubscriptionView, DeleteSubscriberView, UpdateSubscriberView, UpdateSubscriptionView, DeleteSubscriptionView, DonationView, CreateDonationView, UpdateDonationView, DeleteDonationView, ExpensesView, CreateExpensesView, UpdateExpensesView, DeleteExpensesView

urlpatterns = [
    path("subscriber", SubscriberView.as_view()),
    path("create-subscriber", CreateSubscriberView.as_view()),
    path("update-subscriber", UpdateSubscriberView.as_view()),
    path("delete-subscriber", DeleteSubscriberView.as_view()),
    path("subscription", SubscriptionView.as_view()),
    path("create-subscription", CreateSubscriptionView.as_view()),
    path("update-subscription", UpdateSubscriptionView.as_view()),
    path("delete-subscription", DeleteSubscriptionView.as_view()),
    path("donation", DonationView.as_view()),
    path("create-donation", CreateDonationView.as_view()),
    path("update-donation", UpdateDonationView.as_view()),
    path("delete-donation", DeleteDonationView.as_view()),
    path("expenses", ExpensesView.as_view()),
    path("create-expenses", CreateExpensesView.as_view()),
    path("update-expenses", UpdateExpensesView.as_view()),
    path("delete-expenses", DeleteExpensesView.as_view()),
]
