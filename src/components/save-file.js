
let __x
const _ext2ct = {
    "csv": "application/octet-stream",
    "json": "application/json",
    [__x]: "text/plain",
} 

function download(filename, content, contentType, container = 'div#__pickup-ui') {
    let ct = contentType || _ext2ct[filename.split(".")[1]]

    let element = document.createElement('a');
    element.setAttribute('href', `data:${ct};charset=utf-8,` + encodeURIComponent(content));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    let ctr = document.querySelector(container) || document.body
    ctr.appendChild(element);
  
    element.click();
  
    ctr.removeChild(element);
}

export default download