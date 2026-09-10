import axios from 'axios'
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartConstants'

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/product/${id}`)
    const cartItems = getState().cart.cartItems || JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log("cartItems", cartItems);
    const existItem = cartItems.find(item => item.product === data.product._id)
    console.log("existItem", existItem);
    let finalQuantity = Number(quantity)
    if (existItem) {
        finalQuantity = Number(existItem.quantity) + Number(quantity)
        console.log("finalQuantity", finalQuantity);
        if (finalQuantity > data.product.stock) {
            finalQuantity = data.product.stock
        }
    }
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity: finalQuantity
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeItemFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })
    localStorage.setItem('shippingInfo', JSON.stringify(data))

}