import React, {useState} from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { db, auth, addDoc, collection } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
function Login() {
    console.log("Login")
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = e => {
        e.preventDefault();

        signInWithEmailAndPassword(auth,email, password)
            .then(auth => {
                navigate('/')
            })
            .catch(error => alert(error.message))
    }

    const register = e => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (auth) => {
                // it successfully created a new user with email and password
                if (auth) {
                    console.log("Auth:", auth)
                    // db.collection('users').doc(auth.user.uid).set(auth.user)
                    await addDoc(collection(db, "users"), {
                        id: auth.user.uid,
                        email: auth.user.email
                    })
                    // console.log("User Created Auth:", auth)
                    // console.log("Firebase Doc refrence:",doc(db, 'users', auth.user.uid))
                    // console.log("Firebase email:",{...auth.user})
                    // setDoc(doc(db, 'users', auth.user.uid), auth.user) 
                    // .then(() => {
                    //     console.log('Data successfully written to Firestore!');
                    // })
                    // .catch((error) => {
                    //     console.error('Error writing data to Firestore:', error);
                    // })
                    navigate('/')
                }
            })
            .catch(error => alert(error.message))
    }
    
  return (
    <div className='login'>
        <Link to='/'>
        <img
            className='login__logo'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png'
            alt='logo'
        />
        </Link>

        <div className='login__container'>
            <h1>Sign-in</h1>
            <form>
                <h5>Email</h5>
                <input type='text' value={email} onChange={e => setEmail(e.target.value)}/>

                <h5>Password</h5>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>

                <button type='submit' onClick={signIn} className='login__signInButton'>Sign In</button>
            </form>

            <p>
            By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please
                    see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
            </p>

            <button onClick={register} className='login__registerButton'>Create your amazon account</button>
        </div>
    </div>
  )
}

export default Login