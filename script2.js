import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
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

// Выход из аккаунта
const logoutButton = document.getElementById("logout-btn");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => console.log("Пользователь вышел"))
      .catch((error) => console.error("Ошибка выхода:", error));
  });
}

// ================= БАЗА ДАННЫХ =================

const itemsList = document.getElementById('items-list');
const addForm = document.getElementById('add-form');

// Слушаем изменение состояния авторизации
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Пользователь вошёл — добавляем класс на body (CSS сам покажет форму
    // и плавно перевезёт кнопки входа наверх)
    document.body.classList.add('logged-in');
    console.log('Авторизован:', user.uid);

    loadItems();
  } else {
    // Пользователь вышел — убираем класс и очищаем список
    document.body.classList.remove('logged-in');
    if (itemsList) itemsList.innerHTML = '';
  }
});

// Функция загрузки данных в реальном времени
function loadItems() {
  const itemsRef = ref(db, 'items');

  onValue(itemsRef, (snapshot) => {
    if (!itemsList) return;
    itemsList.innerHTML = '';
    const data = snapshot.val();

    if (data) {
      Object.entries(data).forEach(([key, item]) => {
        const li = document.createElement('li');
        li.textContent = `${item.name}: ${item.desc}`;
        itemsList.appendChild(li);
      });
    } else {
      itemsList.innerHTML = '<li>Пока нет записей</li>';
    }
  });
}

// Обработка отправки формы
if (addForm) {
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const desc = document.getElementById('item-desc').value;

    const itemsRef = ref(db, 'items');
    push(itemsRef, {
      name: name,
      desc: desc,
      author: auth.currentUser.uid,
      createdAt: serverTimestamp()
    }).then(() => {
      console.log('Запись добавлена');
      addForm.reset();
    }).catch((error) => {
      console.error('Ошибка добавления:', error);
    });
  });
}
