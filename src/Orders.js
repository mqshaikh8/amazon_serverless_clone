import { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import Order from './Order';
import './Orders.css';
import { db, doc, getDoc } from './firebase';

function Orders() {
    const [{basket, user}] = useStateValue();
    const [ orders, setOrders ] = useState([]);

    useEffect(() => {
        const fetchPastOrderData = async () => {
            if(user){
                const userRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(userRef)
                if (docSnap.exists()) {
                    const { orders } = docSnap.data()
                    setOrders([...orders])
                } else {
                    console.log("No such document!");
                }

            } else{
                setOrders([])
            }
        }
        
        fetchPastOrderData()
    }, [user])

  return (
    <div className='orders'>
        <h1>Your Orders</h1>
        <div className='orders_order'>
            {orders?.map( order => (
                <Order order={order} />
            ))}
        </div>
    </div>
  )
}

export default Orders