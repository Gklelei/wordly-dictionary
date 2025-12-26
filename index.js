const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const container = document.getElementById("display-data-container");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const word = input.value.trim();
  if (word) fetchWord(word);
});

async function fetchWord(word) {
  container.innerHTML = "Searching...";

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await response.json();

    if (!response.ok) {
      container.innerHTML = `<div class="error"><strong>${data.title}</strong><p>${data.message}</p></div>`;
      return;
    }

    renderWord(data[0]);
  } catch (err) {
    container.innerHTML = "Connection error. Try again.";
  }
}

function renderWord(data) {
  let html = `
    <header class="word-result">
      <h2>${data.word}</h2>
      <span class="phonetic">${data.phonetic || ""}</span>
    </header>
  `;

  data.meanings.forEach((m) => {
    html += `
      <div class="meaning">
        <div class="pos">${m.partOfSpeech}</div>
        <ul class="defs">
          ${m.definitions
            .map(
              (d) => `
            <li>
              ${d.definition}
              ${d.example ? `<div class="eg">"${d.example}"</div>` : ""}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  });

  container.innerHTML = html;
}
