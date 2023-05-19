// Collapsible

const COLL = document.getElementsByClassName("collapsible");

for (let i = 0; i < COLL.length; i++) {
    COLL[i].addEventListener("click", function () {
        this.classList.toggle("active");

        var content = this.nextElementSibling;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }

    });
}

const sendButton = () => {
    const textInput = $("#textInput");
    let userText = textInput.val();

    if (userText) {
        getResponse()
    }
}
const heartButton = () => buttonSendText("Heart clicked!")

runChatBot();

// Press enter to send a message
$("#textInput").keypress(function (e) {
    if (e.which === 13 && $('#textInput').val()) {
        getResponse();
    }
});