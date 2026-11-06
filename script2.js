import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

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
const db = getDatabase(app);

// ================= ВХОД =================

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

// ================= ВХОД ПО EMAIL-ССЫЛКЕ (PASSWORDLESS) =================

const sendLinkBtn = document.getElementById("send-link-btn");
const emailLinkInput = document.getElementById("email-link-input");
const emailLinkMsg = document.getElementById("email-link-msg");

// 1. Отправка ссылки для входа
if (sendLinkBtn) {
  sendLinkBtn.addEventListener("click", async () => {
    const email = emailLinkInput.value.trim();

    if (!email) {
      emailLinkMsg.textContent = "Введите email";
      return;
    }

    // URL, куда вернётся пользователь после клика по ссылке.
    // ВАЖНО: этот домен должен быть в Authorized domains в Firebase.
    const actionCodeSettings = {
      url: "https://muuur133.github.io/",
      handleCodeInApp: true
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Сохраняем email, чтобы не спрашивать его снова при возврате
      window.localStorage.setItem("emailForSignIn", email);
      emailLinkMsg.textContent = "Ссылка для входа отправлена! Проверьте почту.";
      console.log("Ссылка отправлена на:", email);
    } catch (error) {
      console.error("Ошибка отправки ссылки:", error);
      emailLinkMsg.textContent = "Ошибка: " + error.message;
    }
  });
}

// 2. Завершение входа, если пользователь вернулся по ссылке
if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem("emailForSignIn");

  if (!email) {
    // Пользователь открыл ссылку на другом устройстве — просим подтвердить email
    email = window.prompt("Подтвердите ваш Email для входа");
  }

  if (email) {
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        window.localStorage.removeItem("emailForSignIn");
        console.log("Вход по ссылке выполнен:", result.user);
        if (emailLinkMsg) emailLinkMsg.textContent = "Вы успешно вошли!";
        // onAuthStateChanged сработает автоматически и покажет интерфейс
      })
      .catch((error) => {
        console.error("Ошибка входа по ссылке:", error);
        if (emailLinkMsg) emailLinkMsg.textContent = "Ошибка входа: " + error.message;
      });
  }
}

// ================= ВЫХОД =================

const logoutButton = document.getElementById("logout-btn");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => console.log("Пользователь вышел"))
      .catch((error) => console.error("Ошибка выхода:", error));
  });
}

// ================= БАЗА ДАННЫХ =================

const itemsList = document.getElementById("items-list");
const addForm = document.getElementById("add-form");

// Слушаем изменение состояния авторизации
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.body.classList.add("logged-in");
    console.log("Авторизован:", user.uid);
    loadItems();
  } else {
    document.body.classList.remove("logged-in");
    if (itemsList) itemsList.innerHTML = "";
  }
});

// Функция загрузки данных в реальном времени
function loadItems() {
  const itemsRef = ref(db, "items");

  onValue(itemsRef, (snapshot) => {
    if (!itemsList) return;
    itemsList.innerHTML = "";
    const data = snapshot.val();

    if (data) {
      Object.entries(data).forEach(([key, item]) => {
        const li = document.createElement("li");
        li.textContent = `${item.name}: ${item.desc}`;
        itemsList.appendChild(li);
      });
    } else {
      itemsList.innerHTML = "<li>Пока нет записей</li>";
    }
  });
}
