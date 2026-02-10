import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducers,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productCreateReviewReducer,
  productTopRatedReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  orderCreateReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderListMyReducer,
  orderListReducer,
  orderPayReducer,
  stripeOrderPayReducer,
} from "./reducers/orderReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";

const reducer = combineReducers({
  products: productListReducers,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productCreateReview: productCreateReviewReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  stripeOrderPay: stripeOrderPayReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
});
const cartItemsFromStorage = (() => {
  try {
    const items = localStorage.getItem("cartItems");
    if (!items || items === "undefined" || items === "null") {
      return [];
    }
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return [];
  }
})();
const shippingAddressFromStorage = (() => {
  const shippingAddress = localStorage.getItem("shippingAddress");
  if (
    !shippingAddress ||
    shippingAddress === "undefined" ||
    shippingAddress === "null"
  ) {
    return {};
  }
  const parsed = JSON.parse(shippingAddress);
  return parsed ? parsed : {};
})();
const paymentMethodFromStorage = (() => {
  const paymentMethod = localStorage.getItem("paymentMethod");
  if (
    !paymentMethod ||
    paymentMethod === "undefined" ||
    paymentMethod === "null"
  ) {
    return {};
  }
  const parsed = JSON.parse(paymentMethod);
  return parsed ? parsed : {};
})();
const userInfoFromStorage = (() => {
  try {
    const items = localStorage.getItem("userLogin");
    if (!items || items === "undefined" || items === "null") {
      return {}; // Changed from {}
    }
    const parsed = JSON.parse(items);
    return parsed ? { userInfo: parsed } : {};
  } catch (error) {
    console.error("Error loading user info from storage:", error);
    return null; // Changed from []
  }
})();
const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
  userLogin: userInfoFromStorage,
};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);
export default store;
