const apiKey =
  "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";

function getAnswer(question) {
  if (!navigator.onLine) {
    Swal.fire({
      title: "No Internet!",
      text: "You are offline. Reconnect and try again.",
      icon: "error",
      confirmButtonText: "Retry",
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    });
  } else {
    const fetchData = fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //   model: "deepseek/deepseek-r1-zero:free",
        // model: "deepseek/deepseek-r1-distill-llama-70b:free",
        model: "deepseek/deepseek-r1-distill-llama-70b:free",
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    fetchData
      .then((response) => response.json())
      .then((response) => {
        const resultData = response.choices[0].message.content;
        isAnswerLoading = false;
        addAnswerDiv(resultData);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          confirmButtonText: "Retry",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
        console.log(err);
      })
      .finally(() => {
        sendBtn.classList.remove("disabled");
        scrollToBottom();
      });
  }
}

let isAnswerLoading = false;
let answerSectionId = 0;

// selecting elements
const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const content = document.getElementById("content");
const chatContainer = document.querySelector(".chat-form");

function handleMessage() {
  const question = chatInput.value.trim();
  if (question === "" || isAnswerLoading) return;
  sendBtn.classList.add("disabled");
  addQuestionDiv(question);
  chatInput.value = "";
}

document.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleMessage();
  }
});
chatInput.addEventListener("input", () => {
  const availableHeight = window.innerHeight - chatContainer.clientHeight - 20;
  content.style.height = availableHeight + "px";
  scrollToBottom();
});

sendBtn.addEventListener("click", handleMessage);

function addQuestionDiv(message) {
  isAnswerLoading = true;
  const newDiv = document.createElement("div");
  newDiv.className = "question-section";
  newDiv.textContent = message;
  content.appendChild(newDiv);

  addAnswerDiv(message);
  scrollToBottom();
}
function addAnswerDiv(message) {
  if (isAnswerLoading) {
    answerSectionId++; // Increment answer ID for tracking
    const answerDiv = document.createElement("div");
    answerDiv.classList = "answer-section";
    answerDiv.innerHTML = getLoadingAnimnation(); // Show loading animation
    answerDiv.id = answerSectionId; // Assign ID
    content.appendChild(answerDiv);
    getAnswer(message); // Fetch AI response
  } else {
    const answerDivElement = document.getElementById(answerSectionId);
    if (answerDivElement) {
      answerDivElement.innerHTML = marked.parse(message); // Convert Markdown to HTML

      // Apply syntax highlighting
      answerDivElement.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }
}

function getLoadingAnimnation() {
  return '<svg style="height: 28px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#7981A1" stroke="#7981A1" stroke-width="15" r="15" cx="35" cy="100"><animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin="0"></animate></circle><circle fill="#7981A1" stroke="#7981A1" stroke-width="15" opacity=".8" r="15" cx="35" cy="100"><animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin="0.05"></animate></circle><circle fill="#7981A1" stroke="#7981A1" stroke-width="15" opacity=".6" r="15" cx="35" cy="100"><animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".1"></animate></circle><circle fill="#7981A1" stroke="#7981A1" stroke-width="15" opacity=".4" r="15" cx="35" cy="100"><animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".15"></animate></circle><circle fill="#7981A1" stroke="#7981A1" stroke-width="15" opacity=".2" r="15" cx="35" cy="100"><animate attributeName="cx" calcMode="spline" dur="2" values="35;165;165;35;35" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".2"></animate></circle></svg>';
  //   return '<span class="loader"></span>';
}

function scrollToBottom() {
  content.scrollTo({
    top: content.scrollHeight,
    behavior: "smooth",
  });
}
