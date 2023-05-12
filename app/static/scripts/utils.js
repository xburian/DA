let answeredQuestions = [];
let questions = getQuestions();
let isRecommendationActivated = false;
let isFirstActivation = true;
let sendingToMobilePhoneActivated = false;
let chatResponse = null;

const getTime = () => {
    const today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return hours + ":" + minutes;
}

// Gets the first messages

const runChatBot = () => {
    const firstMessage = "How can I help you?"
    document.getElementById("botStarterMessage").innerHTML = '<p class="botText"><span>' + firstMessage + '</span></p>';

    const time = getTime();

    $("#chat-timestamp").append(time);
    document.getElementById("userInput").scrollIntoView(false);
}

// Retrieves the response
function getHardResponse(userText) {
    let botResponse = getBotResponse(userText);
    let botHtml = '<p class="botText"><span>' + botResponse + '</span></p>';
    $("#chatbox").append(botHtml);

    document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

const renderResponse = (text) => {
    let botHtml = '<p class="botText"><span>' + text + '</span></p>';
    $("#chatbox").append(botHtml);

    document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

// Retrieves the response
function getHardResponse2(userText) {
    let botResponse = getBotResponse(userText);
    let botHtml = '<p class="botText"><span>' + botResponse + '</span></p>';
    $("#chatbox").append(botHtml);

    document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

//Gets the text from the input box and processes it
function getResponse() {
    const textInput = $("#textInput");
    let userText = textInput.val();

    const isStartingQuestion = isStartingQuestions(userText);
    if (isStartingQuestion) {
        isRecommendationActivated = true;
        console.log('isRecommendationActivated', isRecommendationActivated)
    }

    let userHtml = '<p class="userText"><span>' + userText + '</span></p>';

    textInput.val("");
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);

    setTimeout(async () => {

        if (isRecommendationActivated) {
            if (questions !== undefined && questions.length > 0) {
                const question = questions.shift();
                renderResponse(question);

                if (isFirstActivation) {

                    isFirstActivation = false;
                    answeredQuestions.push({question})

                } else {
                    const lastItem = answeredQuestions.pop();
                    lastItem.answer = userText;

                    answeredQuestions.push(lastItem)
                    answeredQuestions.push({question})
                }

            } else {
                const lastItem = answeredQuestions.pop();
                lastItem.answer = userText;
                answeredQuestions.push(lastItem)

                // call chat GPT

                renderResponse("Ok, thx for your answers")
                const conversation = prepareConversation(answeredQuestions);
                console.log(conversation)

                const response = await getMovie(conversation).then(d => d.choices[0].text);
                const fixedResponse = response.replace("```", "");
                renderResponse("Recommendation for you is: " + fixedResponse)
                isRecommendationActivated = false;

                renderResponse("Want to send it to your mobile phone? if yes, write to which number or write no.")
                sendingToMobilePhoneActivated = true
                chatResponse = fixedResponse;

            }

        } else if (sendingToMobilePhoneActivated) {

            const containsNo = isContainsNo(userText);
            console.log('containsNo', containsNo);
            if (!containsNo && chatResponse) {
                sendMessage(userText, "Recommendation for you is: " + chatResponse)
                renderResponse("The recommendation has been sent to your phone... :)")
            } else {
                renderResponse("Ok, thx for everything")
            }

            resetChatBot()

        } else {

            getHardResponse(userText);
        }

    }, 1000)

}

const resetChatBot = () => {
    answeredQuestions = [];
    questions = getQuestions();
    isRecommendationActivated = false;
    isFirstActivation = true;
    sendingToMobilePhoneActivated = false;
    chatResponse = null;
}

// Handles sending text via button clicks
function buttonSendText(sampleText) {
    let userHtml = '<p class="userText"><span>' + sampleText + '</span></p>';

    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);

    //Uncomment this if you want the bot to respond to this buttonSendText event
    // setTimeout(() => {
    //     getHardResponse(sampleText);
    // }, 1000)
}