import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Универсальная функция входа через любой провайдер
function loginWithProvider(provider, providerName) {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = provider.constructor.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      console.log(`Пользователь вошел через ${providerName}:`, user);
      console.log("Токен:", token);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Ошибка входа через ${providerName}:`, errorCode, errorMessage);
    });
}

// GitHub
const githubButton = document.getElementById("github-login-btn");
if (githubButton) {
  githubButton.addEventListener("click", () => {
    loginWithProvider(new GithubAuthProvider(), "GitHub");
  });
}

// Google
const googleButton = document.getElementById("google-login-btn");
if (googleButton) {
  googleButton.addEventListener("click", () => {
    loginWithProvider(new GoogleAuthProvider(), "Google");
  });
}
