import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import products from "../products";
import Product from "../components/Product";
import axios from "axios";
import { listProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSearchParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
const HomeScreen = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  let keyword = searchParams.get("keyword");
  let page = searchParams.get("page") || 1;
  if (keyword == null) {
    keyword = "";
  }

  const productList = useSelector((state) => state.products);
  const {
    loading,
    error,
    products,
    page: paginationPage,
    pages: paginationPages,
  } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, page));
  }, [keyword, page]);
  return (
    <div>
      {!keyword && <ProductCarousel />}

      <h1>Latest Products: </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            page={paginationPage}
            pages={paginationPages}
            keyword={keyword}
          />
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
