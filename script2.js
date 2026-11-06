import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

// ================= ВХОД ЧЕРЕЗ ПРОВАЙДЕРОВ =================

function loginWithProvider(provider, providerName) {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = provider.constructor.credentialFromResult(result);
      console.log(`Пользователь вошел через ${providerName}:`, result.user);
      console.log("Токен:", credential?.accessToken);
    })
    .catch((error) => {
      console.error(`Ошибка входа через ${providerName}:`, error.code, error.message);
    });
}

document.getElementById("github-login-btn")?.addEventListener("click", () => {
  loginWithProvider(new GithubAuthProvider(), "GitHub");
});

document.getElementById("google-login-btn")?.addEventListener("click", () => {
  loginWithProvider(new GoogleAuthProvider(), "Google");
});

// ================= ПАНЕЛЬ EMAIL =================

const emailToggleBtn = document.getElementById("email-toggle-btn");
const emailPanel = document.getElementById("email-panel");

if (emailToggleBtn && emailPanel) {
  emailToggleBtn.addEventListener("click", () => {
    emailPanel.classList.toggle("open");
  });
}

const emailInput = document.getElementById("email-link-input");
const passwordInput = document.getElementById("password-input");
const emailMsg = document.getElementById("email-panel-msg");

// Кнопка «Назад» — закрывает панель email и сбрасывает сообщение
const emailBackBtn = document.getElementById("email-back-btn");
if (emailBackBtn && emailPanel) {
  emailBackBtn.addEventListener("click", () => {
    emailPanel.classList.remove("open");
    if (emailMsg) emailMsg.textContent = "";
  });
}

// Регистрация по email + пароль
document.getElementById("email-register-btn")?.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    emailMsg.textContent = "Введите email и пароль";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    emailMsg.textContent = "Аккаунт создан! Теперь можно войти.";
    console.log("Зарегистрирован:", userCredential.user);
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    emailMsg.textContent = "Ошибка: " + error.message;
  }
});

// Вход по email + пароль
document.getElementById("email-password-login-btn")?.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    emailMsg.textContent = "Введите email и пароль";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Вход по паролю выполнен:", userCredential.user);
    // onAuthStateChanged автоматически покажет интерфейс
  } catch (error) {
    console.error("Ошибка входа:", error);
    emailMsg.textContent = "Ошибка: " + error.message;
  }
});

// ================= ВХОД БЕЗ ПАРОЛЯ (EMAIL LINK) =================

// 1. Отправка ссылки
document.getElementById("passwordless-btn")?.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    emailMsg.textContent = "Введите email";
    return;
  }

  const actionCodeSettings = {
    url: "https://muuur133.github.io/", // замените, если домен другой
    handleCodeInApp: true
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    emailMsg.textContent = "Ссылка для входа отправлена! Проверьте почту.";
    console.log("Ссылка отправлена на:", email);
  } catch (error) {
    console.error("Ошибка отправки ссылки:", error);
    emailMsg.textContent = "Ошибка: " + error.message;
  }
});

// 2. Завершение входа по ссылке
if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem("emailForSignIn");

  if (!email) {
    email = window.prompt("Подтвердите ваш Email для входа");
  }

  if (email) {
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        window.localStorage.removeItem("emailForSignIn");
        console.log("Вход по ссылке выполнен:", result.user);
      })
      .catch((error) => {
        console.error("Ошибка входа по ссылке:", error);
      });
  }
}

// ================= ВЫХОД =================

document.getElementById("logout-btn")?.addEventListener("click", () => {
  signOut(auth)
    .then(() => console.log("Пользователь вышел"))
    .catch((error) => console.error("Ошибка выхода:", error));
});

// ================= БАЗА ДАННЫХ =================

const itemsList = document.getElementById("items-list");
const addForm = document.getElementById("add-form");

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.body.classList.add("logged-in");
    console.log("Авторизован:", user.uid);
    loadItems();
  } else {
    document.body.classList.remove("logged-in");
    if (itemsList) itemsList.innerHTML = "";
    // Скрываем панель email после выхода
    if (emailPanel) emailPanel.classList.remove("open");
  }
});

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

if (addForm) {
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("item-name").value;
    const desc = document.getElementById("item-desc").value;

    const itemsRef = ref(db, "items");
    push(itemsRef, {
      name: name,
      desc: desc,
      author: auth.currentUser.uid,
      createdAt: serverTimestamp()
    })
      .then(() => {
        console.log("Запись добавлена");
        addForm.reset();
      })
      .catch((error) => {
        console.error("Ошибка добавления:", error);
      });
  });
}
