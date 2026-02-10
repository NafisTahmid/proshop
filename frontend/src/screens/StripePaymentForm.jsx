import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { STRIPE_ORDER_PAY_RESET } from "../constants/orderConstants";
import Loader from "../components/Loader";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const orderDetailsStuffs = useSelector((state) => state.orderDetails);
  const { loading: orderLoading, order } = orderDetailsStuffs;
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://127.0.0.1:8000/#/order/${order._id}`,
        // return_url: `https://nafist.pythonanywhere.com/order/${order._id}`,
      },
    });

    if (error) {
      setMessage(error.message || "An error occurred.");
    }

    setLoading(false);
    dispatch({
      type: STRIPE_ORDER_PAY_RESET,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        variant="primary"
        className="my-2"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : "Pay"}
      </Button>
    </form>
  );
};

export default StripePaymentForm;
