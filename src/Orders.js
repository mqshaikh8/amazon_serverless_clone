import { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import Order from './Order';
import './Orders.css';
import { db, doc, getDoc } from './firebase';

function Orders() {
    const [{basket, user}, dispatch] = useStateValue();
    const [ orders, setOrders ] = useState([]);

    useEffect(() => {
        const fetchPastOrderData = async () => {
            if(user){
                const userRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(userRef)
                if (docSnap.exists()) {
                    const { orders } = docSnap.data()
                    setOrders([...orders])
                    console.log("Document data:", docSnap.data());
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
                // db
                // .collection('users')
                // .doc(user?.uid)
                // .collection('orders')
                // .orderBy('created', 'desc')
                // .onSnapshot(snapshot => (
                //     setOrders(snapshot.docs.map(doc => ({
                //         id: doc.id,
                //         data: doc.data()
                //     })))
                // ))
            } else{
                setOrders([])
            }
        }
        
        fetchPastOrderData()
    }, [user])
    console.log("Orders Array:", orders)
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