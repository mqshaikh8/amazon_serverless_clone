import React from 'react';
import './Order.css';
import CheckoutProduct from './CheckoutProduct';

function Order({order}) {
  console.log("THis is the order comp", order)
  return (
    <div className='order'>
        <h2>Order</h2>
        <p>{order.created.seconds}</p>
        <p className='order__id'> <small>{order.id}</small></p>
        {
            order.basket?.map(({id, title, image, price, rating}) => (
                <CheckoutProduct
                    id={id}
                    title={title}
                    image={image}
                    price={price}
                    rating={rating}
                    hideButton
                />
            ))
        }
        <p> <small>{ order.amount / 100 }</small> </p>
    </div>
  )
}

export default Order