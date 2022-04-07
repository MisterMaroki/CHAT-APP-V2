import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBSsDM58sOTUHOc6Jcshpo6ipy1FV56G-4',
	authDomain: 'whatsapp-2-2bff4.firebaseapp.com',
	projectId: 'whatsapp-2-2bff4',
	storageBucket: 'whatsapp-2-2bff4.appspot.com',
	messagingSenderId: '202800331423',
	appId: '1:202800331423:web:c1fd91bce2e300caff00aa',
};

const app = !firebase.apps?.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
