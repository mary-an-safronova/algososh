export const reverseLetters = (str, first, last) => {
    let arr = str.split('');
    const temp = arr[first - 1];
    arr[first - 1] = arr[last - 1];
    arr[last - 1] = temp;
    return arr.join('');
}

export const getRandomText = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}