document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please enter both email and password.');
            event.preventDefault(); // Prevent the form from being submitted
        }
    });
});


// console.log("hello")