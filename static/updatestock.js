const scanner = new Html5QrcodeScanner('reader', {
    qrbox: { width: 300, height: 300 },
    fps: 60,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    rememberLastUsedCamera: true,
    aspectRatio: 1.7777778,
    showTorchButtonIfSupported: true
})
// var resultdata = ""
scanner.render(success, console.error());
function success(result) {
    localStorage.setItem('result',result)
    // console.log(result);
    document.getElementById('result').style.display = 'flex'
    document.getElementById('result').innerText = result
    // resultdata=result
    document.getElementById('note').style.display = 'flex'
    document.getElementById('resultlabel').style.display = 'flex'
    document.getElementById('notelabel').style.display = 'flex'
    document.getElementById('quantitylabel').style.display = 'flex'
    document.getElementById('quantitycont').style.display = 'block'
    document.getElementById('update').style.display = 'flex'
    document.getElementById('resultlabel').style.position = 'relative'
    document.getElementById('notelabel').style.position = 'relative'
    
    
    scanner.clear()
}
// export {resultdata};