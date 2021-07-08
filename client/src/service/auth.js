import { auth, db } from '../firebase';
import firebase from 'firebase'

const socialMediaAuth = async (provider) => {
    if (provider.provierId === 'facebook.com') {
        provider.addScope('user_friends')
    }

    return auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            return auth.signInWithPopup(provider).then(user => {
                db.collection('users').doc(user.user.uid).get()
                    .then((docSnapshot) => {
                        if (!docSnapshot.exists) {
                            db.collection('users').doc(user.user.uid).set({
                                name: user.user.displayName,
                                email: user.user.email,
                                photo: user.user.photoURL
                            });
                        }
                    });
            });
        }).catch(err => {
            console.log(47, err.message);
            return err
        })
}

export default socialMediaAuth;