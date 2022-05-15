import '../styles/globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import firebase from 'firebase/compat/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		if (user) {
			db.collection('users').doc(user.uid).set(
				{
					email: user.email,
					lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
					photoUrl: user.photoURL,
				},
				{ merge: true }
			);
		}
	}, [user]);

	return loading ? (
		<Loading />
	) : !user ? (
		<Login />
	) : (
		<Component {...pageProps} />
	);
}

export default MyApp;
