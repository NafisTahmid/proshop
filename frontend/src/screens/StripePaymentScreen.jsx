import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import StripePaymentForm from "./StripePaymentForm";
import Loader from "../components/Loader";

const StripePaymentScreen = () => {
  const stripePromise = loadStripe(
    "pk_test_51RqaweFyCdc7BJNOMBdb9j0nsaXYnaXZuuXkremmPpS45rhVNrFSYRJEXjRcWsHRwLDfjBoPK3yD6bA1VAtxdTOM00gAup19Gt",
  );
  const [options, setOptions] = useState(null);
  const stripePayStuffs = useSelector((state) => state.stripeOrderPay);
  const { loading, success, client_secret, error } = stripePayStuffs;
  console.log("Client secret: ", client_secret);

  useEffect(() => {
    if (client_secret) {
      setOptions({
        clientSecret: client_secret.clientSecret,
        appeareance: {
          theme: "stripe",
        },
      });
    }
  }, [client_secret]);
  return (
    <FormContainer>
      <h1>Complete Payment via Stripe</h1>
      {options ? (
        <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm />
        </Elements>
      ) : (
        <Loader />
      )}
    </FormContainer>
  );
};

export default StripePaymentScreen;
