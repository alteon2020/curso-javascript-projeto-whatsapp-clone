import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/storage';

export class Firebase {
    constructor(){
        this._firebaseConfig = {
            apiKey: "AIzaSyCQ24aHmLe8kHV2wwmnKti_ceWALiSPMZk",
            authDomain: "whatsapp-clone-5dc01.firebaseapp.com",
            projectId: "whatsapp-clone-5dc01",
            storageBucket: "gs://whatsapp-clone-5dc01.appspot.com",
            messagingSenderId: "799106499219",
            appId: "1:799106499219:web:4f5f6eeb69efb11f0a0366",
            measurementId: "G-F9LHC1Q0KN"
        };

        this.init();
    }

    init(){

        if(!window._initializedFirebase){
            
            firebase.initializeApp(this._firebaseConfig);
            firebase.analytics();

            firebase.firestore().settings({
                timestampsInSnapshots: true
            });
            window._initializedFirebase = true;
        }
        
    }

    initAuth(){
        return new Promise((s, f)=>{
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
            .then(result=>{
                let token = result.credential.accessToken;
                let user = result.user;
                s({user, token});
            })
            .catch(err=>{
                f(err);
            });
        });
    }

    static db(){

        return firebase.firestore();
    }

    static hd(){

        return firebase.storage();
    }
}
