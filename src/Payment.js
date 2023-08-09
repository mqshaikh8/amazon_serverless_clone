import './Payment.css';
import { useState} from 'react';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import {Link, useNavigate} from 'react-router-dom';
import {CardElement} from '@stripe/react-stripe-js';
import { getBasketTotal } from './reducer';
import { db, doc, setDoc,  } from './firebase';

export default function Payment() {
    const [{basket,user}, dispatch] = useStateValue();
    const navigate = useNavigate();

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(false);
    const [disabled, setDisabled] = useState(null);
    const [processing, setProcessing] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const paymentIntent = `${user?.uid} payment_intent`
        const data = {
            "orders": [
                {
                id: paymentIntent,
                basket: basket,
                amount: getBasketTotal(basket),
                created: new Date()
                }
            ]
            
        }
        const userDocRef = doc(db, 'users', user?.uid);
            
        setDoc(userDocRef, data, {merge: true})
        .then(() => {
            console.log('Data successfully written to Firestore!');
        })
        .catch((error) => {
            console.error('Error writing data to Firestore:', error);
        })

        setSucceeded(true);
        setProcessing(false)

        dispatch({
            type: 'EMPTY_BASKET'
        })

        navigate('/orders', {replace: true})

    }

    const handleChange = event => {
        setDisabled(event.empty)
        setError(event.error ? event.error.message : '')
    }
  return (
    <div className='payment'>
        <div className='payment__container'>
            <h1>
                Checkout (
                    <Link to='/checkout'>{basket?.length} items</Link>
                )
            </h1>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Delivery Address</h3>
                </div>
                <div className='payment__address'>
                    <p>{user?.email}</p>
                    <p>123 React Lane</p>
                    <p>Los Angeles, CA</p>
                </div>
            </div>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3> Review items and delivery</h3>
                </div>
                <div className='payment__items'>
                    {
                        basket.map(({id, title, image, price, rating}) => (
                            <CheckoutProduct
                                id={id}
                                title={title}
                                image={image}
                                price={price}
                                rating={rating}
                            />
                        ))
                    }
                </div>
            </div>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3> Payment Method</h3>
                </div>
                <div className='payment__details'>
                    {/* Stripe */}
                    <form onSubmit={handleSubmit}>
                        <CardElement onChange={handleChange}/>
                        <div className='payment__priceContainer'>
                            <p>
                                Order Total: <strong>{getBasketTotal(basket)}</strong>
                            </p>
                            <button disabled={processing || disabled || succeeded}>
                                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                            </button>
                        </div>
                    </form>
                    {error ? `Error: ${error}` : null}
                </div>
            </div>
        </div>
    </div>
  )
}
