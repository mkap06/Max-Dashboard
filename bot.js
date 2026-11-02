const transcript = document.getElementById("transcript");
const composer = document.getElementById("composer");
const input = document.getElementById("message");
const clock = document.getElementById("clock");

const NOTE_KEY = "max-kaplan-bot-notes";

const MAX = {
  name: "Max Kaplan",
  role: "Student and builder",
  github: "mkap06",
  githubUrl: "https://github.com/mkap06",
  practice:
    "He likes working directly in code — making something, debugging it, then iterating. No long theory pile first.",
  project:
    "Right now he is building this page: Max Kaplan Bot, a public frame people can walk up to when he is not in the room.",
};

function aboutMax() {
  return [
    `${MAX.name} is a ${MAX.role.toLowerCase()}.`,
    MAX.practice,
    MAX.project,
    `Public code lives at ${MAX.githubUrl}.`,
    "I am the stand-in, not him. If you need the person, leave a clear note.",
  ].join(" ");
}

function nowStamp() {
  return new Date().toLocaleTimeString([], { hour12: false });
}

function addBubble(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `bubble ${role}`;
  const who = document.createElement("span");
  who.className = "who";
  who.textContent = role === "bot" ? "Max Kaplan Bot" : "You";
  wrap.appendChild(who);
  wrap.appendChild(document.createTextNode(text));
  transcript.appendChild(wrap);
  transcript.scrollTop = transcript.scrollHeight;
}

function saveNote(note) {
  const notes = JSON.parse(localStorage.getItem(NOTE_KEY) || "[]");
  notes.push({ at: new Date().toISOString(), note });
  localStorage.setItem(NOTE_KEY, JSON.stringify(notes));
}

function replyTo(raw) {
  const text = raw.trim();
  const q = text.toLowerCase();

  if (!q) {
    return "Say something. I am a frame, not a mind reader.";
  }

  if (
    /who is max|who'?s max|about max|tell me about|max kaplan|background|bio|student/.test(
      q
    )
  ) {
    return aboutMax();
  }

  if (/github|code|repo/.test(q)) {
    return `Max publishes as ${MAX.github} on GitHub: ${MAX.githubUrl}. ${MAX.practice}`;
  }

  if (/work|project|building|coding|website|dashboard|how does he/.test(q)) {
    return `${MAX.practice} ${MAX.project} You are in the prototype: chat, presence, a place people can walk up to.`;
  }

  if (/real max|reach|contact|email|message him|get in touch/.test(q)) {
    return "If you need the real Max, leave a clear note here and I will hold it in this browser until a backend is wired up. You can also find him on GitHub as mkap06. Be specific about who you are and what you need.";
  }

  if (/leave a note|stopped by|leave him|message for max/.test(q)) {
    saveNote(text);
    return "Noted. I parked that in this browser as a message for Max. If you want it to actually reach him later, this page still needs a real inbox behind it.";
  }

  if (/who are you|what are you\??$|what is this|virtual double/.test(q)) {
    return "I am Max Kaplan Bot — a virtual double of Max Kaplan. People use this frame to talk with a stand-in for Max when he is not here. I am not Max. I am the version of him that lives in this page.";
  }

  if (/hello|hi |hey|how are you/.test(q)) {
    return "Hey. You found the Max Kaplan frame. Ask who Max is, what he is working on, or leave him a note.";
  }

  if (/help|what can you/.test(q)) {
    return "Ask who Max Kaplan is, how he works, where his GitHub is, how to reach him, or drop a note. Keep it short. I answer like a stand-in, not a search engine.";
  }

  saveNote(text);
  return `Got it: “${text}”. I will treat that as something to hold for Max. If you want a direct answer, ask who Max is, how he works, or how to reach him.`;
}

function send(text) {
  addBubble("user", text);
  window.setTimeout(() => {
    addBubble("bot", replyTo(text));
  }, 280);
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  send(text);
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-prompt]");
  if (!button) return;
  send(button.dataset.prompt);
});

addBubble(
  "bot",
  "This is the Max Kaplan frame. I am his virtual double. Ask who Max is, what he is building, or leave a note."
);

function tick() {
  clock.textContent = nowStamp();
}

tick();
window.setInterval(tick, 1000);
