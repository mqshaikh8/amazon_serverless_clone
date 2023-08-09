import React from 'react';
import './Subtotal.css';
import { useStateValue } from './StateProvider';
import { getBasketTotal } from './reducer';
import { useNavigate } from 'react-router-dom';

function Subtotal() {
    console.log("Subtotal")
    const navigate = useNavigate();
    const [ {basket} ] = useStateValue()
  return (
    <div className='subtotal'>
        <>
            <p>
                Subtotal ({basket.length} Items): <strong>{getBasketTotal(basket)}</strong>
            </p>
            <small className='subtotal__gift'>
                <input type='checkbox'/> This order contains a gift
            </small>

            <button onClick={e => navigate('/payment')}> Proceed to Checkout</button>
        </>
    </div>
  )
}

export default Subtotal