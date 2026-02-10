import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = () => {
  const [payment, setPayment] = useState("Stripe");
  const navigate = useNavigate();
  const shippingAddressDetails = useSelector((state) => state.cart);
  const { shippingAddress } = shippingAddressDetails;
  const dispatch = useDispatch();

  if (!shippingAddress.address) {
    navigate("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(payment));

    navigate("/placeorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Payment Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              checked
              label="Stripe"
              id="stripe"
              name="paymentMethod"
              onChange={(e) => setPayment(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
