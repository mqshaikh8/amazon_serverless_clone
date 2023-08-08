import {useEffect, useState} from 'react';
import './Payment.css';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import {Link, useNavigate} from 'react-router-dom';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { getBasketTotal } from './reducer';
import axios from './axios';
import { db, auth, doc, setDoc, collection } from './firebase';

export default function Payment() {
    console.log("Payment")
    const [{basket,user}, dispatch] = useStateValue();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(null);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            })
            setClientSecret(response.data.clientSecret)
        }

        // getClientSecret();
    }, [basket])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // const payload = await stripe.confirmCardPayment(clientSecret, {
        //     payment_method: {
        //         card: elements.getElement(CardElement)
        //     }
        // }).then(({ paymentIntent }) => {
            console.log(user, "Updating Orders:",basket)
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
            console.log("UserDocRef:", userDocRef)
            

            setDoc(userDocRef, data, {merge: true})
            .then(() => {
                console.log('Data successfully written to Firestore!');
            })
            .catch((error) => {
                console.error('Error writing data to Firestore:', error);
            })

            setSucceeded(true);
            setError(null)
            setProcessing(false)

            dispatch({
                type: 'EMPTY_BASKET'
            })
            console.log("Navigating out of Payments >>>>>")
            navigate('/orders', {replace: true})
        // })
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
                </div>
            </div>
        </div>
    </div>
  )
}
