import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";

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
