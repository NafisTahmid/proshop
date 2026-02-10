import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/?keyword=${keyword}&page=1`);
    } else {
      navigate(navigate(window.location.pathname));
    }
  };
  return (
    <Form
      onSubmit={submitHandler}
      className="d-flex justify-content-center align-items-center"
    >
      <Form.Control
        type="text"
        name="q"
        className="mr-sm-2 ml-sm-5"
        onChange={(e) => setKeyword(e.target.value)}
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Submit
      </Button>
    </Form>
  );
};

export default SearchBox;
