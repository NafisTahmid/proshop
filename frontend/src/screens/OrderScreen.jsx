import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Card, ListGroup, Image, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { getOrderDetails } from "../actions/orderActions";
import { useNavigate, useParams } from "react-router-dom";
import {
  payOrder,
  createStripeSession,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  STRIPE_ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = () => {
  const { orderId } = useParams();
  const orderFetch = useSelector((state) => state.orderDetails);
  const orderPayStuffs = useSelector((state) => state.orderPay);
  const { loading, error, order } = orderFetch;
  const { loading: loadingPay, success, error: errorPay } = orderPayStuffs;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const makePayment = () => {
  //   dispatch(payOrder(orderId, "payPal"));
  // };
  const makePayment = () => {
    dispatch(createStripeSession(orderId, "stripe"));
    navigate("/stripe-payment");
  };
  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!order || order._id !== Number(orderId) || successDeliver) {
      dispatch(getOrderDetails(orderId));
      dispatch({
        type: ORDER_DELIVER_RESET,
      });
    } else if (success) {
      dispatch(getOrderDetails(orderId));
      // dispatch({
      //   type: STRIPE_ORDER_PAY_RESET,
      // });
    }
  }, [dispatch, orderId, success, successDeliver, userInfo, navigate, order]);

  const itemsPrice = order?.orderItems
    ? order.orderItems
        .reduce((acc, item) => acc + item.price * item.qty, 0)
        .toFixed(2)
    : 0;

  console.log("Order: ", order);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message>{error}</Message>
  ) : (
    <div>
      <h1>Order: {orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>SHIPPING:</h2>
              <p>
                <strong>Shipping: </strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.postalCode}{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="info">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>PAYMENT METHOD</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="info">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>ORDERS: </h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty!</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
              <ListGroup.Item>Item: ${itemsPrice}</ListGroup.Item>
              <ListGroup.Item>Shipping: ${order.shippingPrice}</ListGroup.Item>
              <ListGroup.Item>Tax: ${order.taxPrice}</ListGroup.Item>
              <ListGroup.Item>Total: ${order.totalPrice}</ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  <Button variant="primary" onClick={() => makePayment()}>
                    Confirm Payment
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn"
                    variant="primary"
                    onClick={deliverHandler}
                  >
                    Mark as Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
