// Creating a global event listener for the question/answer toggle
document.addEventListener("click", (e) => {
  if (e.target.matches("p")) {
    let flashCard = e.target.parentNode;
    flashCard.firstChild.classList.toggle("hidden");
    flashCard.lastChild.classList.toggle("hidden");
  }
});

// Load in the data.
const loadData = async () => {
  let response = await fetch("./data.json");
  let data = await response.json();
  return data;
};

// Create an array of just one of each topic.
const filterTopic = async () => {
  let data = await loadData();
  const L = data.length;
  let topics = [];
  for (let i = 0; i < L; i++) {
    let currentTopic = data[i]["Topic"];
    if (topics.indexOf(currentTopic) === -1) topics.push(currentTopic);
  }
  return topics;
};

// A function to create a dropdown menu.
const createDropDown = (divId, topic, selectId, optionsArr, eventListener) => {
  const div = document.createElement("div");
  div.classList.add("form_control");
  div.id = divId;

  let label = document.createElement("label");
  label.innerText = `Choose the ${topic} most recently completed:`;
  label.htmlFor = selectId;
  label.classList.add("form_label");
  div.appendChild(label);

  let select = document.createElement("select");
  select.id = selectId;
  select.name = selectId;
  select.classList.add("form_select");
  select.addEventListener("input", eventListener);

  let L = optionsArr.length;
  for (let i = -1; i < L; i++) {
    let currentTopic = optionsArr[i];
    let option = document.createElement("option");
    if (i === -1) currentTopic = "...";
    option.value = currentTopic;
    option.innerText = currentTopic;
    option.classList.add("dropdown_item");
    select.appendChild(option);
  }
  div.appendChild(select);
  return div;
};

// Populate a form with a select element of topics.
const populateTopic = async () => {
  let topics = await filterTopic();
  const container = document.querySelector(".container");

  let form = document.createElement("form");
  form.classList.add("form");

  let topicDiv = createDropDown(
    "select_topic_div",
    "topic",
    "topicSelect",
    topics,
    populateSubTopic
  );
  form.appendChild(topicDiv);

  container.appendChild(form);
};

// A function to match sub topics to a topic.
const matchSub = async (topic) => {
  let data = await loadData();
  const L = data.length;
  let subTopic = [];
  for (let i = 0; i < L; i++) {
    if (data[i]["Topic"] === topic) {
      let currentSub = data[i]["Sub-topic"];
      if (subTopic.indexOf(currentSub) === -1) subTopic.push(currentSub);
    }
  }
  return subTopic;
};

// A function to populate a subTopics
const populateSubTopic = async (event) => {
  clearSub();
  const topicSelected = event.target.value;
  let subTopics = await matchSub(topicSelected);

  const form = document.querySelector(".form");

  let selectElem = createDropDown(
    "select_subtopic_div",
    "subtopic",
    "subTopicSelect",
    subTopics,
    selectNumber
  );
  form.appendChild(selectElem);
};

// A function to add a number input
const selectNumber = () => {
  clearNum();
  const form = document.querySelector(".form");

  const div = document.createElement("div");
  div.classList.add("form_control");
  div.id = "select_qs";

  const label = document.createElement("label");
  label.htmlFor = "numberOfQs";
  label.innerText = "How many questions? (4-10)";
  div.appendChild(label);

  const multiCol = document.createElement("div");
  multiCol.id = "two_col";
  div.appendChild(multiCol);

  const input = document.createElement("input");
  input.type = "number";
  input.id = "numberOfQs";
  input.classList.add("form_select");
  input.name = "numberOfQs";
  input.min = 4;
  input.max = 10;
  input.addEventListener("input", generateBtn);
  multiCol.appendChild(input);

  // add in the btn

  form.appendChild(div);
};

// A function to create the generate btn
const generateBtn = () => {
  clearBtns();

  const form = document.querySelector(".form");
  const multiCol = document.querySelector("#two_col");

  const btn = document.createElement("button");
  btn.classList.add("btn", "form_btn", "form_select");
  btn.innerText = "Generate!";
  btn.id = "generate_btn_div";
  multiCol.appendChild(btn);

  // Preventing the default behavior of the form and handling the submit.
  form.onsubmit = function (e) {
    e.preventDefault();
    let target = e.target;
    handleSubmit(target);
  };
};

// What happens when the generate btn is pressed.
const handleSubmit = async (target) => {
  // getting the selected subtopic and n.o. Qs
  let subTopic = target.querySelector("#subTopicSelect").value;
  let numberOfQuestions = target.querySelector("#numberOfQs").value;
  // getting how may of each question to show
  let numberOfCurrentQs = (numberOfQuestions - (numberOfQuestions % 2)) / 2;
  let numberOfOldQs = numberOfQuestions - numberOfCurrentQs;
  // getting an object containing matching questions
  let questionsObject = await getQuestions(subTopic);
  let priorTopicQuestions = questionsObject["priorTopicQuestions"];
  let currentTopicQuestions = questionsObject["currentTopicQuestions"];
  // in case current topic is first topic
  if (priorTopicQuestions.length === 0) {
    numberOfCurrentQs = numberOfQuestions;
    numberOfOldQs = 0;
  }
  // generating an array of random locations for Qs
  let currentQsLocation = randomLocs(
    currentTopicQuestions.length,
    numberOfCurrentQs
  );
  let priorQsLocation = randomLocs(priorTopicQuestions.length, numberOfOldQs);

  // Creating an array of the question/answer objects for each
  let currentQuestionsToAsk = [];
  for (let i = 0; i < currentQsLocation.length; i++) {
    let index = currentQsLocation[i];
    currentQuestionsToAsk.push(currentTopicQuestions[index]);
  }

  let priorQuestionsToAsk = [];
  for (let i = 0; i < priorQsLocation.length; i++) {
    let index = priorQsLocation[i];
    priorQuestionsToAsk.push(priorTopicQuestions[index]);
  }

  createQuestions(currentQuestionsToAsk, priorQuestionsToAsk);
};

// A function to make the questions card
const createQuestions = (currentArr, priorArr) => {
  clearQuestions();
  const container = document.querySelector(".container");

  const wrapper = document.createElement("div");
  wrapper.classList.add("content_wrap");
  container.appendChild(wrapper);

  const currentWrap = document.createElement("div");
  currentWrap.classList.add("question_wrap");
  wrapper.appendChild(currentWrap);

  let currentTitle = document.createElement("h2");
  currentTitle.classList.add("subtitle");
  currentTitle.innerText = "Most Recent:";
  currentWrap.appendChild(currentTitle);

  createQuestionCard(currentArr, currentWrap);

  if (priorArr.length !== 0) {
    const priorWrap = document.createElement("div");
    priorWrap.classList.add("question_wrap");
    wrapper.appendChild(priorWrap);

    let priorTitle = document.createElement("h2");
    priorTitle.classList.add("subtitle");
    priorTitle.innerText = "Random:";
    priorWrap.appendChild(priorTitle);

    createQuestionCard(priorArr, priorWrap);
  }
};

const createQuestionCard = (arr, wrapper) => {
  for (let i = 0; i < arr.length; i++) {
    let questionObject = arr[i];
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question_container");

    let question = document.createElement("p");
    question.innerText = questionObject["question"];
    questionDiv.appendChild(question);

    let answer = document.createElement("p");
    answer.innerText = questionObject["answer"];
    answer.classList.add("hidden");
    questionDiv.appendChild(answer);

    wrapper.appendChild(questionDiv);
  }
};

// Generating a random int (max not included)
const randomLocs = (max, num) => {
  let i = 0;
  let locs = [];
  while (i < num) {
    let randomNum = Math.floor(Math.random() * max);
    if (locs.indexOf(randomNum) === -1) {
      locs.push(randomNum);
      i++;
    }
  }
  return locs;
};

// Get question numbers.
const getQuestions = async (subtopic) => {
  // loading data
  let data = await loadData();
  const L = data.length;
  let currentTopicQuestions = [];
  let otherTopicQuestions = [];
  let currentTopicQuestionsLoc = [];
  // creating one array of current and one of all others
  for (let i = 0; i < L; i++) {
    let question = data[i]["Question"];
    let answer = data[i]["Answer"];
    let SUBtopic = data[i]["Sub-topic"];
    if (data[i]["Sub-topic"] === subtopic) {
      currentTopicQuestions.push({ question, answer, SUBtopic });
      currentTopicQuestionsLoc.push(data[i]["No."]);
    } else {
      otherTopicQuestions.push({ question, answer, SUBtopic });
    }
  }
  // finding the index of the first current topic
  let cutOff = currentTopicQuestionsLoc[0] - 1;
  // only returning prior topic Qs not all
  let priorTopicQuestions = otherTopicQuestions.slice(0, cutOff);
  return { priorTopicQuestions, currentTopicQuestions };
};

// Clear questions
const clearQuestions = () => {
  let questionWrapper = document.querySelectorAll(".content_wrap");
  for (let i = 0; i < questionWrapper.length; i++) {
    currentWrapper = questionWrapper[i];
    currentWrapper.remove();
  }
};

// Clear buttons
const clearBtns = () => {
  clearQuestions();
  let generateBtns = document.querySelectorAll("#generate_btn_div");
  for (let i = 0; i < generateBtns.length; i++) {
    currentBtn = generateBtns[i];
    currentBtn.remove();
  }
};

// Clear number option
const clearNum = () => {
  clearBtns();
  let numberInputs = document.querySelectorAll("#select_qs");
  for (let i = 0; i < numberInputs.length; i++) {
    currentNumInput = numberInputs[i];
    currentNumInput.remove();
  }
};

// Clear subtopic option
const clearSub = () => {
  clearNum();
  let subtopicInputs = document.querySelectorAll("#select_subtopic_div");
  for (let i = 0; i < subtopicInputs.length; i++) {
    currentSubTopic = subtopicInputs[i];
    currentSubTopic.remove();
  }
};

// Start of with the choose topic
populateTopic();
