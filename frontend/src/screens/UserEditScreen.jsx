import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import { updateUser } from "../actions/userActions";
const UserEditScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success } = userUpdate;
  const { id } = useParams();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        _id: user._id,
        name: name,
        username: email,
        email: email,
        isAdmin: isAdmin,
      }),
    );
    navigate("/admin/userList");
  };
  useEffect(() => {
    if (success) {
      dispatch({
        type: USER_UPDATE_RESET,
      });
    } else {
      if (!user.name || user._id !== Number(id)) {
        dispatch(getUserDetails(id));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, user, id, success]);
  return (
    <div>
      <Link to="/admin/userList">
        <Button className="btn btn-light">Go Back</Button>
      </Link>
      <FormContainer>
        <h1>Edit User</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Please enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Please enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2">
              Update User
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default UserEditScreen;
