
import './App.css';
import {useEffect} from 'react';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import Payment from './Payment';
import Orders from './Orders'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {auth} from './firebase';
import { useStateValue } from './StateProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const promise = loadStripe(
  'pk_test_51CON8PHAZxeW5yowITeSH38vcU8ktA7kCI4Njnr2etvuk8BiWUij3ic71qFMWAd2oId8AvCXS1ookfRNDw8kxtOb00Q1zW8SgV'
  );

const PaymentContainer = () => (
  <>
    <Elements stripe={promise}>
      <Payment/>
   </Elements>
  </>
)

function App() {
  const [{}, dispatch] = useStateValue();
  useEffect(() => {

    auth.onAuthStateChanged(authUser => {
      console.log("The User is >>>>>>>>>>>", authUser)

      if(authUser){
      
        dispatch({
          type:'SET_USER',
          user: authUser
        })
      }else{
        dispatch({
          type:'SET_USER',
          user: null
        })
      }
    })


  },[])

  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path='/orders' element={ <Orders/> }/>
          <Route path='/login' element={ <Login/> }/>
          <Route  path='/payment' element={ <PaymentContainer/> }/>
          <Route path='/checkout' element={ <Checkout/> }/>
          <Route path='/' element={ <Home/> }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
