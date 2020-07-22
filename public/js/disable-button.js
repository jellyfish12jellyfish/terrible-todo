function empty() {
    if (document.getElementById('name').value === '' || document.getElementById('email').value === '' || document.getElementById('message').value === '') {
        document.getElementById('submit').disabled = true;
    } else {
        document.getElementById('submit').disabled = false;

    }

}