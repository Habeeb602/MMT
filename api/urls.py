from django.urls import path
from .views import SubscriberView, CreateSubscriberView, CreateSubscriptionView, SubscriptionView, DeleteSubscriberView, UpdateSubscriberView

urlpatterns = [
    path("subscriber", SubscriberView.as_view()),
    path("create-subscriber", CreateSubscriberView.as_view()),
    path("subscription", SubscriptionView.as_view()),
    path("create-subscription", CreateSubscriptionView.as_view()),
    path("delete-subscriber", DeleteSubscriberView.as_view()),
    path("update-subscriber", UpdateSubscriberView.as_view()),

]
