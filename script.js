class ADFGVX {
    constructor() {
        this.substitutionTable = {
            'A': 'AA', 'B': 'AD', 'C': 'AF', 'D': 'AG',
            'E': 'AV', 'F': 'AX', 'G': 'DA', 'H': 'DD',
            'I': 'DF', 'J': 'DG', 'K': 'DV', 'L': 'DX',
            'M': 'FA', 'N': 'FD', 'O': 'FF', 'P': 'FG',
            'Q': 'FV', 'R': 'FX', 'S': 'GA', 'T': 'GD',
            'U': 'GF', 'V': 'GG', 'W': 'GV', 'X': 'GX',
            'Y': 'VA', 'Z': 'VD', ' ': 'VF' 
        };
        this.reverseSubstitutionTable = Object.fromEntries(
            Object.entries(this.substitutionTable).map(([key, value]) => [value, key])
        );
    }
    getInputValues() {
        const text = document.getElementById('inputText').value.toUpperCase();
        const key = document.getElementById('key').value.toUpperCase();
        return { text, key };
    }
    encrypt() {
        const { text, key } = this.getInputValues();
        let encodedText = '';
        // Замена символов на пары
        for (let char of text) {
            encodedText += this.substitutionTable[char] || ''; // Игнорируем символы, не входящие в таблицу
        }
        // Дополнение текста до кратности длине ключа
        const columns = Math.ceil(encodedText.length / key.length);
        const paddedText = encodedText.padEnd(columns * key.length, 'X');
        const grid = Array.from({ length: key.length }, () => []);
        // Заполнение таблицы транспозиции
        for (let i = 0; i < paddedText.length; i++) {
            const col = i % key.length;
            grid[col].push(paddedText[i]);
        }
        // Сортировка ключа и формирование итогового сообщения
        const sortedKeyIndices = key.split('').map((char, index) => ({ char, index }))
            .sort((a, b) => a.char.localeCompare(b.char))
            .map(({ index }) => index);
        
        let encryptedText = '';
        for (let index of sortedKeyIndices) {
            encryptedText += grid[index].join('');
        }
        document.getElementById('outputText').value = encryptedText;
    }
    decrypt() {
        const { text, key } = this.getInputValues();
        const columns = Math.ceil(text.length / key.length);
        const grid = Array.from({ length: key.length }, () => Array(columns).fill(''));
        // Восстановление индексов столбцов
        const sortedKeyIndices = key.split('').map((char, index) => ({ char, index }))
            .sort((a, b) => a.char.localeCompare(b.char));
        let index = 0;
        for (let { index: sortedIndex } of sortedKeyIndices) {
            for (let j = 0; j < columns; j++) {
                if (index < text.length) {
                    grid[sortedIndex][j] = text[index++];
                }
            }
        }
        // Чтение по строкам
        let decryptedText = '';
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < key.length; j++) {
                decryptedText += grid[j][i];
            }
        }
        // Обратная замена
        let originalText = '';
        for (let i = 0; i < decryptedText.length; i += 2) {
            const pair = decryptedText.substring(i, i + 2);
            originalText += this.reverseSubstitutionTable[pair] || ''; // Игнорируем неизвестные пары
        }
        document.getElementById('outputText').value = originalText.toLowerCase();
    }
}
// Создаем экземпляр класса ADFGVX
const adfgvx = new ADFGVX();
// Обработка событий кнопок
document.getElementById('encryptBtn').addEventListener('click', () => adfgvx.encrypt());
document.getElementById('decryptBtn').addEventListener('click', () => adfgvx.decrypt());

