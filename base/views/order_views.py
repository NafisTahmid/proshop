from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.http import JsonResponse
from base.models import Product, Order, OrderItem, ShippingAddress
from rest_framework import status
from base.serializers import OrderSerializer
from datetime import datetime
import stripe
from django.conf import settings

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data["orderItems"]

    if orderItems and len(orderItems) == 0:
        return Response({"detail":"No order items found"}, status=status.HTTP_400_BAD_REQUEST)
    
    # 1. Create order
    order = Order.objects.create(
        user=user,
        paymentMethod=data["paymentMethod"],
        taxPrice=data["taxPrice"],
        shippingPrice=data["shippingPrice"],
        totalPrice=data["totalPrice"])

    # 2. Shipping address
    shipping = ShippingAddress.objects.create(
        order=order,
        address=data["shippingAddress"]["address"],
        city=data["shippingAddress"]["city"],
        postalCode=data["shippingAddress"]["postalCode"],
        country=data["shippingAddress"]["country"]
    )

    # 3. Create order items and set order to order items relationship
    for i in orderItems:
        product = Product.objects.get(_id=i["product"])

        item = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty = i["qty"],
            price = i["price"],
            image = product.image.url
        )

        # 4. Update stock
        product.countInStock -= int(item.qty)
        product.save()
    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    try:
        user = request.user
        order = Order.objects.get(_id=pk)

        if user.is_staff or user == order.user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({"detail":"User not authorized to view the order!"}, status=status.HTTP_400_BAD_REQUEST)    
    except:
        return Response({"detail":"Order doesn't exist!"}, status=status.HTTP_400_BAD_REQUEST)                        


stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def createPaymentIntent(request, pk):
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    
    # Create payment intent with order amount
    intent = stripe.PaymentIntent.create(
        amount=int(order.totalPrice * 100),  # convert to cents
        currency="usd",
        metadata={'order_id': order._id}
    )
    order.save()
    
    return Response({'clientSecret': intent.client_secret})

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response("Order has been paid :D")

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    print("User:", request.user)  # Check if user is authenticated
    print("Auth:", request.auth)  # Check authentication object
    
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True;
    order.deliveredAt = datetime.now()
    order.save()

    return Response("Order was paid :D")