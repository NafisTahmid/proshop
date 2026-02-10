import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import { Form, Row, Col, Button } from "react-bootstrap";
import { saveShippingAddress } from "../actions/cartActions";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const shippingAddressDetails = useSelector((state) => state.cart);
  const { shippingAddress } = shippingAddressDetails;
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };
  return (
    <FormContainer onSubmit={submitHandler}>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Address"
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="City"
            value={city ? city : ""}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Postal Code"
            value={postalCode ? postalCode : ""}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Country"
            value={country ? country : ""}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
