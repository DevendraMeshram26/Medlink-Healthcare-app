// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

const {initializeApp}= require("firebase/app")
const {getAuth} = require("firebase/auth")
const {getFirestore, collection,addDoc} = require("firebase/firestore")


const firebaseConfig = {
  apiKey: "AIzaSyBKT2WRE6Itp6_cR4b6VO4qTI_yufE6Iu0",
  authDomain: "caresense360.firebaseapp.com",
  projectId: "caresense360",
  storageBucket: "caresense360.appspot.com",
  messagingSenderId: "587169789344",
  appId: "1:587169789344:web:2acb9c39b634ea47a1a0c5",
  measurementId: "G-35HDG4EZGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth= getAuth(app)


const db= getFirestore(app)

const RegisterNewUser= async(name,email,password)=>{
    try {
        const docRef = await addDoc(collection(db,"Users"),{
            name:name,
            email:email,
            password:password
        })
        console.log("Successfully added",docRef);
        
    } catch (error) {
        console.log("error while adding data",error);
    }

}

// const getuserdata=async (email)=>{
//     const docRef= await db.collection("Users").doc(email).get()
//     if(docRef===email){
//         console.log("User found");

//     }else{
//         console.log("UserNot found");
//     }
// }

const getuserdata = async (email) => {
    const docRef = await db?.collection("Users").doc(email).get();
    if (docRef.exists) {
      const data = docRef.data();
      if (data.email === email) {
        console.log("User found");
        return data; // Return user data if found
      } else {
        console.log("Email doesn't match document");
        return null; // Indicate no user found with that email
      }
    } else {
      console.log("User not found");
      return null; // Indicate no user found
    }
  };
  
module.exports= { app,auth,RegisterNewUser, getuserdata}