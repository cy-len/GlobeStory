export function downloadJSON(content: any, fileName: string, contentType: string = "text/json") {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    setTimeout(() => a.remove(), 5000);
}