export function copyToClipboard(str) {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', str);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  document.body.removeChild(input);
}
