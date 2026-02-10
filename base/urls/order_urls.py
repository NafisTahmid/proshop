from django.urls import path
from base.views import order_views as views


urlpatterns = [
    path("", views.getOrders, name="orders"),
    path("myorders/", views.getMyOrders, name="my-orders"),
    path("add", views.addOrderItems, name="orders-add"),
    path("<str:pk>/", views.getOrderById, name="user-order"),
    path("<str:pk>/pay/", views.updateOrderToPaid, name="order-pay"),
     path("<str:pk>/deliver/", views.updateOrderToDelivered, name="order-deliver"),
    path('<str:pk>/create-payment-intent/', views.createPaymentIntent, name="stripe-pay-create"),
]