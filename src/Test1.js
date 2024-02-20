import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app } from "./FirebaseConfig/firebase";
const Test1 = () => {
  const [info, setInfo] = useState({ email: "", password: "" });
  const auth = getAuth(app);

  console.log(info.password);
  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, info.email, info.password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        alert("Dang ky tai khoan that bai!" + error.message);
        // ..
      });
  };

  return (
    <form onSubmit={(e) => handleSignUp(e)}>
      Email{" "}
      <input
        onChange={(e) => setInfo({ ...info, email: e.target.value })}
        type="email"
      />
      password{" "}
      <input
        onChange={(e) => setInfo({ ...info, password: e.target.value })}
        type="password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Test1;
