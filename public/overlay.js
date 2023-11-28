document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("overlay");
    const passwordPrompt = document.getElementById("password-prompt");
    const passwordInput = document.getElementById("password");
    const content = document.getElementById("content");
    const keypad = document.getElementById("keypad");
    let enteredPassword = "";

    let timer; 

    let MAX_TIME=90000

    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keydown", resetTimer);

    // Function to show the overlay
    function showOverlay() {
        overlay.style.display = "flex";
        passwordInput.value = ""; // Clear the password input field
        enteredPassword = "";
        updatePasswordInput();
    }

    function resetTimer() {
        clearTimeout(timer); // Clear the existing timer
        timer = setTimeout(showOverlay, MAX_TIME); // Set a new timer
    }

    // Function to hide the overlay
    function hideOverlay() {
        overlay.style.display = "none";
        timer = setTimeout(showOverlay, MAX_TIME);
    }

    // Function to check the password
    function checkPassword() {

        const password = "80d367bcded513df8d47e53ca8a9d83111c66b64e0440cb3027e06cfaba27050"; 
        const enteredPasswordHash = CryptoJS.SHA256( enteredPassword ).toString(CryptoJS.enc.Hex);

        if ( enteredPasswordHash === password) {
            hideOverlay();
        }
    }

    // Function to update the password input field
    function updatePasswordInput() {
        passwordInput.value = "*".repeat(enteredPassword.length);
    }

    // Add click events to keypad buttons
    keypad.addEventListener("click", function(event) {
        const target = event.target;
        if (target.classList.contains("key")) 
        {
            const value = target.getAttribute("data-value");

            if (value === "submit") {
                checkPassword();
            } else if (value === "clear") {
                enteredPassword = "";
            } else if (value === "delete") {
                enteredPassword = enteredPassword.slice(0, -1);
            } else {
                enteredPassword += value;
            }

            updatePasswordInput();
        }
    });

    // Show the overlay initially
    showOverlay();
});
