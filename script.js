import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, GithubAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

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
// Находим кнопку на странице
const githubButton = document.getElementById("github-login-btn");

// Оборачиваем вызов в обработчик клика
githubButton.addEventListener("click", () => {
  const auth = getAuth();
  const provider = new GithubAuthProvider();

  // Опционально: запрос дополнительных прав (scopes)
  // provider.addScope('repo');

  signInWithPopup(auth, provider)
    .then((result) => {
      // Access Token для GitHub API
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Информация о пользователе
      const user = result.user;
      console.log("Пользователь вошел:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GithubAuthProvider.credentialFromError(error);
      console.error("Ошибка входа:", errorCode, errorMessage);
    });
});
