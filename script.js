document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mainBtn');
    const message = document.getElementById('message');
  
    btn.addEventListener('click', () => {
      // 1. Плавно делаем кнопку прозрачной
      btn.style.opacity = '0';
  
      // 2. Через 300мс (время transition) полностью убираем её из потока, чтобы не занимала место
      setTimeout(() => {
        btn.style.display = 'none';
      }, 300);
  
      // 3. Меняем фон страницы (переход уже прописан в CSS)
      document.body.style.backgroundColor = '#ffffff';
  
      // 4. Через 3 секунды показываем надпись
      setTimeout(() => {
        message.classList.add('visible');
      }, 3000);
    });
  });
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth();
const provider = new GithubAuthProvider();

// Опционально: запрос дополнительных прав (scopes)
// provider.addScope('repo'); 

signInWithPopup(auth, provider)
  .then((result) => {
    // Это дает вам Access Token для GitHub API
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
  
