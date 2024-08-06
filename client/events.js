document.getElementById('enter').addEventListener("click", (e) => {
    e.preventDefault();
    const nameElement = document.getElementById('name');
    sendLoginRequest(nameElement.value);
})
