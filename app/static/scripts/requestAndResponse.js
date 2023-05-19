const CHAT_GPT_CONVERSATION_PREFIX = "Give me 3 movies based on this conversation, each separated by a comma";
const CSFD_URL_QUERY = "https://www.csfd.cz/hledat/?q=";
const STARTING_INPUTS = ["movie", "move", "muvie", "novie", "mobie", "movir", "novir", "moive", "film", "flim", "filn", "folm"]
const FLEXIBLE_NO = ["no", "nah", "nope", "not really"]

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

const isStartingQuestions = (userInput) => {
    userInput = userInput.toLowerCase();
    return STARTING_INPUTS.some(PROMPT => userInput.includes(PROMPT));
}

const isContainsNo = (userInput) => {
    userInput = userInput.toLowerCase();
    return FLEXIBLE_NO.some(NO => userInput.includes(NO))
}

const prepareConversation = (conversation) => {
    let text = '';
    conversation.map(obj => {
        text += `A: ${obj.question} \n`;
        text += `B: ${obj.answer} \n`;
    })

    text = `\`\`\` ${text} \`\`\``;

    return text;
}

async function getMovie(conversation) {

    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: CHAT_GPT_CONVERSATION_PREFIX + conversation,
            max_tokens: 20,
            n: 1,
            stop: ['\n']
        })
    })
    return response.json();
}

function sendMessage(number, body) {
    if (!number.startsWith('+') || number.length < 9 && number.length > 9) {
        number = '+420' + number;
    }
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

const splitMovies = (movies) => {
    if (movies.length === 0) return "Nothing here";

    return movies
        .split(",")
        .map(movie => {
            const url = `<a href=\"${CSFD_URL_QUERY}${movie}\" target=\"_blank\">` + movie + '</a>';
            return `${url} \n`
        });
}
