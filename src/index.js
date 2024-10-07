function displayPunSequentially(response) {
  console.log("Starting displayPunSequentially");
  console.log("Full response:", response.data.answer);

  const container = document.querySelector("#pun-container");
  container.classList.remove("hidden");

  const parts = response.data.answer.split("\n").filter((line) => line.trim());
  console.log("Parsed parts:", parts);

  const sections = {
    Word: "word",
    Pun: "japanese-pun",
    Kana: "kana",
    Romaji: "romaji",
    Translation: "translation",
    Explanation: "explanation",
  };

  function displaySection(index) {
    console.log(`Starting displaySection for index: ${index}`);
    if (index >= parts.length) {
      console.log("Finished all sections");
      return;
    }

    try {
      const part = parts[index];
      console.log(`Processing part: ${part}`);

      const [label, ...contentParts] = part.split(":");
      const content = contentParts.join(":").trim();
      const sectionKey = label.trim();

      console.log(`Label: ${sectionKey}, Content: ${content}`);

      if (sections[sectionKey]) {
        console.log(`Found matching section: ${sections[sectionKey]}`);
        const elementId = sections[sectionKey];
        const element = document.querySelector(`#${elementId}`);

        if (!element) {
          console.error(`Element not found: #${elementId}`);
          displaySection(index + 1);
          return;
        }

        console.log(`Starting typewriter for ${elementId}`);

        element.innerHTML = `${sectionKey}: ${content}`;

        setTimeout(() => {
          console.log(`Moving to next section after ${elementId}`);
          displaySection(index + 1);
        }, 300);
      } else {
        console.log(`No matching section found for: ${sectionKey}`);
        displaySection(index + 1);
      }
    } catch (error) {
      console.error("Error in displaySection:", error);
      displaySection(index + 1);
    }
  }

  console.log("Starting first section");
  displaySection(0);
}

function clearAllSections() {
  const sections = [
    "word",
    "japanese-pun",
    "kana",
    "romaji",
    "translation",
    "explanation",
  ];
  sections.forEach((id) => {
    const element = document.querySelector(`#${id}`);
    if (element) {
      element.innerHTML = "";
    }
  });
}

function generatePun(event) {
  console.log("Generate pun started");
  event.preventDefault();

  // Clear all sections before generating new pun
  clearAllSections();

  let apiKey = "7ff831f1t415752c05168fobafe5a2a9"; // Replace with your actual API key
  let userInput = document.querySelector("#user-instructions").value;
  console.log("User input:", userInput);

  let context = `Your are a  AI Assistant that tells witty puns in japanese. A pun typically involves a clever or amusing use of words that sound alike or have multiple meanings, creating a play on words.focus on that. Generate a creative and humorous dajare that incorporates Japanese wordplay, utilizing homophones, kanji nuances, and cultural references based on the English word provided. Start by choosing a specific theme or scenario (e.g., food, animals, seasons, daily life),  Identify a key word related to the chosen theme that has homophones or can be associated with other meanings in Japanese then  Create a punchline or a surprising twist that highlights the cleverness of the wordplay.Include the original word in Japanese, the pun, its kana, romaji,translation in english and a brief explanation of the pun in English. Format your response as follows:\nWord: [Japanese word] ([kana], [romaji])\nPun: [Japanese pun]\nKana: [kana of the pun]\nRomaji: [romaji of the pun]\nTranslation: [translation of the pun in english]\nExplanation: [Brief explanation of the pun in English]`;

  let prompt = `Generate a Japanese pun about ${userInput}`;
  let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${context}&key=${apiKey}`;

  const container = document.querySelector("#pun-container");
  container.classList.remove("hidden");

  // Show loading state in word section
  document.querySelector("#word").innerHTML =
    'Generating a pun for you... please wait <span class="loading-spinner">⏳</span>';

  console.log("Calling the AI API");
  axios
    .get(apiUrl)
    .then((response) => {
      console.log("Received API response");
      displayPunSequentially(response);
    })
    .catch((error) => {
      console.error("API Error:", error);
      document.querySelector("#word").innerHTML =
        "Error generating pun. Please try again.";
    });
}

let punForm = document.querySelector("#pun-generator-form");
punForm.addEventListener("submit", generatePun);
console.log("Event listener attached");
