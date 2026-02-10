import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listUsers } from "../actions/userActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.products);
  const productDelete = useSelector((state) => state.productDelete);
  const productCreate = useSelector((state) => state.productCreate);
  const [searchParams] = useSearchParams();
  let keyword = searchParams.get("keyword") || "";
  let page = searchParams.get("page") || 1;
  const { loading, error, products, page: paginationPage, pages } = productList;
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete the product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createHandler = () => {
    dispatch(createProduct());
  };

  useEffect(() => {
    dispatch({
      type: PRODUCT_CREATE_RESET,
    });
    if (!userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      if (successDelete) {
        dispatch(listProducts(keyword, page));
      }
      dispatch(listProducts(keyword, page));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successCreate,
    createdProduct,
    successDelete,
    keyword,
    page,
  ]);

  return (
    <div>
      {loadingCreate && <Loader />}
      {errorCreate && <Message>{errorCreate}</Message>}
      <Row className="align-items-center">
        <Col md={9}>
          <h1>Products</h1>
        </Col>
        <Col md={3}>
          <Button className="text-right" onClick={createHandler}>
            <i className="fas fa-plus"></i>Create Product
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      className="btn btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            page={paginationPage}
            pages={pages}
            keyword={keyword}
            isAdmin={true}
          />
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
