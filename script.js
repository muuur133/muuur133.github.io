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
  