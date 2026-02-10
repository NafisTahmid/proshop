import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSelector, useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useParams } from "react-router-dom";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import axios from "axios";

const ProductEditScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
    product: updatedProduce,
  } = productUpdate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { id } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    // Update Product
    dispatch(
      updateProduct({
        _id: product._id,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }),
    );
  };

  const uploadFileHandler = async (e) => {
    console.log("Uploading image!");
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product_id", id);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/products/upload/",
        formData,
        config,
      );
      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };
  useEffect(() => {
    if (successUpdate) {
      dispatch({
        type: PRODUCT_UPDATE_RESET,
      });
      navigate("/admin/productList");
    } else {
      if (!product.name || product._id !== Number(id)) {
        dispatch(listProductDetails(id));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, id, product, successUpdate]);
  return (
    <div>
      <Link to="/admin/productList">
        <Button className="btn btn-light">Go Back</Button>
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message>{errorUpdate}</Message>}

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
                placeholder="Please enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Please enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter product image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Label>Choose File</Form.Label>
              <Form.Control type="file" onChange={uploadFileHandler} />
            </Form.Group>
            {uploading && <Loader />}
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter product brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter product category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Please enter product count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2">
              Update Product
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default ProductEditScreen;
