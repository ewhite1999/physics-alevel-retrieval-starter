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
  label.innerText = `Choose a ${topic}:`;
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

  const input = document.createElement("input");
  input.type = "number";
  input.id = "numberOfQs";
  input.name = "numberOfQs";
  input.min = 4;
  input.max = 10;
  input.addEventListener("input", generateBtn);

  div.appendChild(label);
  div.appendChild(input);
  form.appendChild(div);
};

const generateBtn = () => {
  clearBtns();
  const form = document.querySelector(".form");

  const div = document.createElement("div");
  div.classList.add("form_control");
  div.id = "generate_btn_div";

  const btn = document.createElement("button");
  btn.classList.add("btn", "form_btn");
  btn.innerText = "Generate!";
  div.appendChild(btn);
  form.appendChild(div);
  form.onsubmit = function (e) {
    e.preventDefault();
    // TODO: Add a function to generate Qs
  };
};

// Clear buttons
const clearBtns = () => {
  let generateBtns = document.querySelectorAll("#generate_btn_div");
  for (let i = 0; i < generateBtns.length; i++) {
    currentBtn = generateBtns[i];
    currentBtn.innerHTML = "";
  }
};

// Clear number option
const clearNum = () => {
  clearBtns();
  let numberInputs = document.querySelectorAll("#select_qs");
  for (let i = 0; i < numberInputs.length; i++) {
    currentNumInput = numberInputs[i];
    currentNumInput.innerHTML = "";
  }
};

// Clear subtopic option
const clearSub = () => {
  clearNum();
  let subtopicInputs = document.querySelectorAll("#select_subtopic_div");
  for (let i = 0; i < subtopicInputs.length; i++) {
    currentSubTopic = subtopicInputs[i];
    currentSubTopic.innerHTML = "";
  }
};

populateTopic();
