
console.log(localStorage.getItem('result'))
var dat = localStorage.getItem("result").replace(/\t/g, '_').replace(/ /g, '_')
document.getElementById('prod').innerText = localStorage.getItem("result")
document.getElementById('form').innerHTML = `<input type="hidden" name="prod" value=${dat} /><button id="confirm" class="but">Confirm☑️</button>`