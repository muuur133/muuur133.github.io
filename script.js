import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqnrIPnoMm8ZQKP8iPgW1jpQdzWtYBLb8",
    authDomain: "muuur1242.firebaseapp.com",
    databaseURL: "https://muuur1242-default-rtdb.firebaseio.com",
    projectId: "muuur1242",
    storageBucket: "muuur1242.firebasestorage.app",
    messagingSenderId: "594721313944",
    appId: "1:594721313944:web:e4792dc4198f6583d1aced",
    measurementId: "G-DHLKG8FFLM"
  };

// ⚠️ Ключевой шаг: инициализация Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const githubButton = document.getElementById("github-login-btn");

githubButton.addEventListener("click", () => {
  // Передаём app в getAuth
  const auth = getAuth(app);
  const provider = new GithubAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log("Пользователь вошел:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Ошибка входа:", errorCode, errorMessage);
    });
});
