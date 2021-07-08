import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase.js';
import firebase from 'firebase'
const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentuser] = useState();
    const [dataRoom, setDataRoom] = useState();
    const [dataUser, setDatatuser] = useState();
    const [loading, setLoading] = useState(true);

    function signup(email, password, image, name) {
        return auth.createUserWithEmailAndPassword(email, password).then(user => {
            user.user.updateProfile({
                displayName: name,
                photoURL: image
            })
            db.collection('users').doc(user.user.uid).set({
                name: name,
                email: user.user.email,
                photo: image
            });

        })
    }

    async function login(email, password) {
        let login = await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                return auth.signInWithEmailAndPassword(email, password);
            }).catch(err => {
                return err
            })
        return login
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    function changeRoomData(data) {
        setDataRoom(data)
    }

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentuser(user)
            if (user) {
                db.collection('users').doc(user.uid).get().then(snapshot => {
                    setDatatuser(snapshot.data())
                });
            }
            setLoading(false)
        })
        return unsubscribe

    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        changeRoomData,
        dataRoom,
        dataUser
    }

    return (
        <AuthContext.Provider value={value} >
            {!loading && children}
        </AuthContext.Provider>
    )
}
