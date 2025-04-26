const form = document.querySelector("form")
const chatfield = document.getElementById("chatfield")
const chatresponse = document.getElementById("response")
const btn = document.getElementById("btn")
form.addEventListener("submit", (e) => askQuestion(e))

async function askQuestion(e) {
    e.preventDefault()
    btn.disabled = true;
    chatresponse.innerText = ""

    const options = {
        method: 'POST',
        mode:'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: chatfield.value })
    }

    const response = await fetch("http://localhost:3000/ask", options) 
    if(response.ok){
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            console.log(chunk)
            chatresponse.innerText += chunk;
        }
    } else {
        console.error(response.status)
    }

    btn.disabled = false;
    chatfield.value = ""
}