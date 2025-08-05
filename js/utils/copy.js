const copy = (text) => {
    let textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        result = document.execCommand('copy');
    } catch (err) {}

    document.body.removeChild(textArea);
}

export default copy;