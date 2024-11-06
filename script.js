class ADFGVXCipher {
  constructor() {
      // Таблица замены 
      this.substitutionTable = {
          'A': 'AD', 'B': 'AG', 'C': 'AV', 'D': 'AX',
          'E': 'FD', 'F': 'FG', 'G': 'FV', 'H': 'FX',
          'I': 'GD', 'J': 'GG', 'K': 'GV', 'L': 'GX',
          'M': 'VD', 'N': 'VG', 'O': 'VV', 'P': 'VX',
          'Q': 'XD', 'R': 'XG', 'S': 'XV', 'T': 'XX',
          'U': 'DA', 'V': 'DG', 'W': 'DV', 'X': 'DX',
          'Y': 'FA', 'Z': 'FG'
      };
  }

  // Шифрование
  encrypt(text, key) {
      // Преобразование текста в верхний регистр и удаление пробелов
      text = text.toUpperCase().replace(/\s+/g, '');
      let encodedText = '';

      // Замена символов
      for (let char of text) {
          if (this.substitutionTable[char]) {
              encodedText += this.substitutionTable[char];
          }
      }

      // Сортировка ключа
      const sortedKey = key.split('').sort().join('');
      const columns = Math.ceil(encodedText.length / key.length);
      const grid = Array.from({ length: key.length }, () => []);

      // Заполнение сетки
      for (let i = 0; i < encodedText.length; i++) {
          const col = i % key.length;
          grid[col].push(encodedText[i]);
      }

      // Создание зашифрованного текста
      let encryptedText = '';
      for (let char of sortedKey) {
          const index = key.indexOf(char);
          encryptedText += grid[index].join('');
          grid[index] = []; // Удаляем использованные символы
      }

      return encryptedText;
  }

  // Дешифрование
  decrypt(text, key) {
      const sortedKey = key.split('').sort().join('');
      const columns = Math.ceil(text.length / key.length);
      const grid = Array.from({ length: key.length }, () => []);
      
      let index = 0;

      // Заполнение сетки по отсортированному ключу
      for (let char of sortedKey) {
          const col = key.indexOf(char);
          for (let i = 0; i < columns; i++) {
              if (index < text.length) {
                  grid[col].push(text[index++]);
              }
          }
      }

      // Чтение по строкам
      let decryptedText = '';
      for (let i = 0; i < columns; i++) {
          for (let j = 0; j < key.length; j++) {
              if (grid[j][i]) {
                  decryptedText += grid[j][i];
              }
          }
      }

      // Обратная замена
      let originalText = '';
      for (let i = 0; i < decryptedText.length; i += 2) {
          const pair = decryptedText.substring(i, i + 2);
          const char = Object.keys(this.substitutionTable).find(key => this.substitutionTable[key] === pair);
          if (char) {
              originalText += char;
          }
      }

      return originalText;
  }

  // Функция для учета регистра при выводе
  preserveCase(originalText, transformedText) {
      let result = '';
      for (let i = 0; i < originalText.length; i++) {
          // Проверяем, существует ли символ в transformedText
          if (i < transformedText.length) {
              if (originalText[i] === originalText[i].toUpperCase()) {
                  result += transformedText[i].toUpperCase();
              } else {result += transformedText[i].toLowerCase();
              }
          } else {
              // Если символа нет, добавляем пробел или другой символ
              result += originalText[i];
          }
      }
      return result;
  }
}

// Инициализация шифра
const cipher = new ADFGVXCipher();

// Обработка событий кнопок
document.getElementById('encryptBtn').addEventListener('click', () => {
  const key = document.getElementById('key').value;
  const inputText = document.getElementById('inputText').value;
  const outputText = cipher.encrypt(inputText, key);
  document.getElementById('outputText').value = cipher.preserveCase(inputText, outputText);
});

document.getElementById('decryptBtn').addEventListener('click', () => {
  const key = document.getElementById('key').value;
  const inputText = document.getElementById('inputText').value;
  const outputText = cipher.decrypt(inputText, key);
  document.getElementById('outputText').value = cipher.preserveCase(inputText, outputText);
});