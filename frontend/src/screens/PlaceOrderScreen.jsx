import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Card, ListGroup, Image, Button } from "react-bootstrap";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link } from "react-router-dom";
import { createOrder } from "../actions/orderActions";
import { useNavigate } from "react-router-dom";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
const PlaceOrderScreen = () => {
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, error, order, success } = orderCreate;
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);
  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);
  cart.taxPrice = (Number(0.082) * cart.itemsPrice).toFixed(2);
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  if (!cart.paymentMethod) {
    navigate("/payment");
  }
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, navigate]);

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }),
    );
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>SHIPPING:</h2>
              <p>
                <strong>Shipping: </strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.postalCode} {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>PAYMENT METHOD</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>ORDERS: </h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty!</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>ORDER SUMMARY: </h2>
              </ListGroup.Item>
              <ListGroup.Item>Item: ${cart.itemsPrice}</ListGroup.Item>
              <ListGroup.Item>Shipping: ${cart.shippingPrice}</ListGroup.Item>
              <ListGroup.Item>Tax: ${cart.taxPrice}</ListGroup.Item>
              <ListGroup.Item>Total: ${cart.totalPrice}</ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  variant="primary"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
