const getBotResponse = (input) => {
    //rock paper scissors
    if (input === "rock") {
        return "paper";
    } else if (input === "paper") {
        return "scissors";
    } else if (input === "scissors") {
        return "rock";
    }

    // Simple responses
    if (input === "hello") {
        return "Hello there!";
    } else if (input === "goodbye") {
        return "Talk to you later!";
    } else {
        return "Try asking something else!";
    }
}

const getQuestions = () => {
    return [
        "Ok, tell me something about yourself How old are you?",
        "What gender do you identify as?",
        "Do you have any hobbies?",
        "Do you have any pets or favourite animals?",
        "Do you like adrenaline?"
    ]
}

const MOVIE = "movie"
const FILM = "film"
const NO = "no"

const isStartingQuestions = (userInput) => {
    userInput = userInput.toLowerCase();
    return userInput.includes(MOVIE) || userInput.includes(FILM);
}

const isContainsNo = (userInput) => {
    userInput = userInput.toLowerCase();
    return userInput.includes(NO);
}

const prepareConversation = (conversation) => {
    let text = '';
    conversation.map(obj => {
        text += `A: ${obj.question} \n`;
        text += `B: ${obj.answer} \n`;
    })

    text = `\`\`\` ${text} \`\`\``;

    console.log(text)
    return text;
}

async function getMovie(conversation) {
    const conversation_prefix = "Give me a movie based on this conversation";
    let result;

    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: conversation_prefix + conversation,
            max_tokens: 10,
            n: 1,
            stop: ['\n']
        })
    })
    return response.json();
}

function sendMessage(number, body) {
    fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_API_KEY}`)
        },
        body: new URLSearchParams({
            'To': number,
            'From': '+14753488263',
            'Body': body
        })
    });
}
