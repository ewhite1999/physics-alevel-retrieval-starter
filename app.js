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

// Populate a form with a select element of topics.
const populateTopic = async () => {
  let topics = await filterTopic();
  const container = document.querySelector(".container");
  console.log(topics);

  let form = document.createElement("form");
  form.classList.add("form");

  let label = document.createElement("label");
  label.innerText = "Choose a topic:";
  label.htmlFor = "topicSelect";
  form.appendChild(label);

  let select = document.createElement("select");
  select.id = "topicSelect";
  select.name = "topicSelect";
  form.appendChild(select);

  let L = topics.length;
  for (let i = 0; i < L; i++) {
    let currentTopic = topics[i];
    let option = document.createElement("option");
    option.value = currentTopic;
    option.innerText = currentTopic;
    select.appendChild(option);
  }

  container.appendChild(form);
};

populateTopic();
//  <label for="cars">Choose a car:</label>
// <select id="cars" name="cars">
//   <option value="volvo">Volvo</option>
//   <option value="saab">Saab</option>
//   <option value="fiat">Fiat</option>
//   <option value="audi">Audi</option>
// </select>
