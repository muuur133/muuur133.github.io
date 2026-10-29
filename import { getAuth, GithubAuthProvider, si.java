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