const STORAGE_KEY = "ng-role-readiness-v1";

const dimensions = [
  {
    id: "purpose",
    title: "Future purpose",
    kicker: "Start with the outcome",
    description: "Test whether the role is defined by the result the business will need—not a list inherited from the past.",
    why: "A clear future purpose prevents an old job description from becoming the strategy by default.",
    questions: [
      "We can state the single most important business outcome this role must own over the next 12–24 months.",
      "The role’s measures of success reflect where the business is going, not only how the work is done today.",
      "We can distinguish what this role must own from what it merely supports."
    ],
    actionTitle: "Rewrite the role in one sentence",
    action: "Complete this sentence without referring to the old job description: ‘Over the next 12–24 months, this role exists to…’ Then name no more than three outcomes that would prove it."
  },
  {
    id: "work",
    title: "Changing work",
    kicker: "Look inside the title",
    description: "Identify which tasks will grow, reduce or change as AI, automation and business requirements evolve.",
    why: "AI exposure is not the same as job displacement. The practical unit of change is the task—not the title.",
    questions: [
      "We know which recurring tasks are likely to be automated, accelerated or materially changed.",
      "We know which activities will become more important as lower-value work reduces.",
      "We have tested whether the underlying need is a people gap, a process problem, a technology opportunity—or a combination."
    ],
    actionTitle: "Build a task-shift map",
    action: "List the role’s ten most important tasks. Mark each Human-led, AI-supported, Automate, or Reduce. Pay particular attention to high-impact tasks whose treatment is still unclear."
  },
  {
    id: "judgment",
    title: "Human judgment",
    kicker: "Protect meaningful accountability",
    description: "Define where experience, relationships, challenge and final accountability must remain human.",
    why: "Human review has little value if the reviewer lacks the information, authority or time to change the decision.",
    questions: [
      "We have identified the decisions that must remain human-led because of risk, safety, quality, people or commercial consequence.",
      "A named person would retain clear accountability for decisions supported by AI or automation.",
      "The role has a practical route to question, override or escalate an automated recommendation."
    ],
    actionTitle: "Draw the human boundary",
    action: "For each consequential decision, name who recommends, who decides, who can challenge, and what evidence they need. Avoid describing human involvement as a final approval click."
  },
  {
    id: "capability",
    title: "Future capability",
    kicker: "Separate essential from trainable",
    description: "Define the capabilities required for future work and the evidence that would demonstrate them.",
    why: "A role is not skills-based merely because a degree line was removed. The work, evidence and assessment must also change.",
    questions: [
      "We can separate the capabilities required on day one from those that can be learned with the right support.",
      "The current selection criteria test the work this person will need to perform in the future—not only previous titles or tenure.",
      "We know what evidence, work sample or structured question would demonstrate the critical capabilities."
    ],
    actionTitle: "Split the capability list",
    action: "Create two columns: Essential on day one and Trainable after appointment. For every essential requirement, write down the evidence that would prove it. Remove criteria that cannot be connected to the work."
  },
  {
    id: "decision",
    title: "Decision readiness",
    kicker: "Choose the right intervention",
    description: "Decide whether the need is best solved through recruitment, development, work redesign or a blend.",
    why: "Recruitment is one possible response to changing work. It should follow role clarity rather than substitute for it.",
    questions: [
      "We have deliberately considered recruitment, internal development, work redesign and technology—not only replacement hiring.",
      "The current role brief has been reviewed since the work or operating context materially changed.",
      "We know what tools, learning and management support the person will need to succeed after the decision is made."
    ],
    actionTitle: "Make the intervention explicit",
    action: "Write down why Recruit, Develop, Redesign or Blend is the most responsible route. Include what evidence would cause you to change that decision before committing budget."
  }
];

const categoryMeta = {
  human: { title: "Human-led", description: "Judgment, accountability or relationship is central." },
  augment: { title: "AI-supported", description: "Technology assists; a person retains meaningful control." },
  automate: { title: "Automate", description: "Repeatable work with clear controls and exceptions." },
  remove: { title: "Reduce or remove", description: "Work that may no longer justify the same effort." }
};

const form = document.querySelector("#assessmentForm");
const questionSteps = document.querySelector("#questionSteps");
const resultsSection = document.querySelector("#results");
const progressLabel = document.querySelector("#progressLabel");
const progressCount = document.querySelector("#progressCount");
const progressBar = document.querySelector("#progressBar");

let currentStep = 0;
let tasks = [];

function renderQuestionSteps() {
  questionSteps.innerHTML = dimensions.map((dimension, dimensionIndex) => {
    const questionMarkup = dimension.questions.map((question, questionIndex) => {
      const name = `${dimension.id}-${questionIndex}`;
      return `
        <fieldset class="question-card" data-question="${name}">
          <legend><span>${questionIndex + 1}</span>${question}</legend>
          <div class="answer-scale">
            <label><input type="radio" name="${name}" value="0" /><span><strong>Not yet</strong><small>We have not defined this</small></span></label>
            <label><input type="radio" name="${name}" value="1" /><span><strong>Partly</strong><small>Some thinking exists</small></span></label>
            <label><input type="radio" name="${name}" value="2" /><span><strong>Clear</strong><small>We could explain it now</small></span></label>
          </div>
        </fieldset>`;
    }).join("");

    return `
      <section class="step" data-step="${dimensionIndex + 1}" aria-labelledby="${dimension.id}Title">
        <div class="step-heading">
          <span class="step-number">0${dimensionIndex + 2}</span>
          <div>
            <p class="kicker">${dimension.kicker}</p>
            <h2 id="${dimension.id}Title">${dimension.title}</h2>
            <p>${dimension.description}</p>
          </div>
        </div>
        <div class="insight-strip"><strong>Why this matters</strong><span>${dimension.why}</span></div>
        <div class="question-list">${questionMarkup}</div>
        <label class="field notes-field">
          <span>Working note <small>optional</small></span>
          <textarea name="${dimension.id}-note" rows="3" placeholder="Capture an example, concern or assumption to test."></textarea>
        </label>
        <p class="step-error" role="alert" hidden>Please answer all three statements before continuing.</p>
        <div class="step-actions">
          <button class="button button-secondary prev-step" type="button"><span aria-hidden="true">←</span> Back</button>
          <button class="button button-primary next-step" type="button">Continue <span aria-hidden="true">→</span></button>
        </div>
      </section>`;
  }).join("");
}

function allSteps() {
  return [...document.querySelectorAll(".step")];
}

function showStep(index, shouldFocus = true) {
  currentStep = Math.max(0, Math.min(index, 6));
  allSteps().forEach((step) => step.classList.toggle("is-active", Number(step.dataset.step) === currentStep));

  const labels = ["Role context", ...dimensions.map((item) => item.title), "Your direction"];
  progressLabel.textContent = labels[currentStep];
  progressCount.textContent = `Step ${currentStep + 1} of 7`;
  progressBar.style.width = `${((currentStep + 1) / 7) * 100}%`;
  saveState();

  if (shouldFocus) {
    document.querySelector(`.step[data-step="${currentStep}"] h2`)?.focus({ preventScroll: true });
    document.querySelector(".tool-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function validateStep(index) {
  const step = document.querySelector(`.step[data-step="${index}"]`);
  if (!step) return false;

  if (index === 0) {
    const role = document.querySelector("#roleTitle");
    const valid = role.value.trim().length > 1;
    role.setAttribute("aria-invalid", String(!valid));
    if (!valid) {
      role.focus();
      return false;
    }
    return true;
  }

  if (index >= 1 && index <= 5) {
    const dimension = dimensions[index - 1];
    const complete = dimension.questions.every((_, questionIndex) => form.elements[`${dimension.id}-${questionIndex}`].value !== "");
    const error = step.querySelector(".step-error");
    error.hidden = complete;
    if (!complete) {
      const incompleteCard = [...step.querySelectorAll(".question-card")].find((card) => !card.querySelector("input:checked"));
      incompleteCard?.querySelector("input")?.focus();
    }
    return complete;
  }

  return true;
}

function formSnapshot() {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep, values: formSnapshot(), tasks, completed: !resultsSection.hidden }));
  } catch (_) {
    // The assessment still works if browser storage is unavailable.
  }
}

function restoreState() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!state) return;
    Object.entries(state.values || {}).forEach(([name, value]) => {
      const control = form.elements[name];
      if (!control) return;
      if (control instanceof RadioNodeList) {
        [...control].forEach((item) => { item.checked = item.value === value; });
      } else {
        control.value = value;
      }
    });
    tasks = Array.isArray(state.tasks) ? state.tasks : [];
    renderTaskBoard();
    if (state.completed && document.querySelector("#roleTitle").value.trim()) {
      buildResults(false);
      if (location.hash === "#results") resultsSection.scrollIntoView();
    } else {
      showStep(Number(state.currentStep) || 0, false);
    }
  } catch (_) {
    // Ignore damaged or inaccessible local state.
  }
}

function getScores() {
  return dimensions.map((dimension) => {
    const score = dimension.questions.reduce((sum, _, questionIndex) => {
      return sum + Number(form.elements[`${dimension.id}-${questionIndex}`].value || 0);
    }, 0);
    return { ...dimension, score, max: 6, note: form.elements[`${dimension.id}-note`].value.trim() };
  });
}

function scoreBand(score) {
  if (score <= 2) return { label: "Needs definition", className: "low" };
  if (score <= 4) return { label: "Partly defined", className: "medium" };
  return { label: "Clear", className: "high" };
}

function readinessBand(total) {
  if (total <= 12) {
    return {
      title: "Redesign before recruitment",
      text: "Too much of the future role remains undefined. Reusing the existing brief could hard-code work, criteria or assumptions that are already changing."
    };
  }
  if (total <= 21) {
    return {
      title: "Refine before action",
      text: "The role has a credible core, but important questions remain. Resolve the lowest-scoring areas before committing to a recruitment or development route."
    };
  }
  return {
    title: "Ready to validate",
    text: "The future role is comparatively clear. Test your assumptions with the people closest to the work and with current market evidence before proceeding."
  };
}

function decisionCopy(decision) {
  const guidance = {
    "Recruit broadly as it stands": "Validate the brief against the actual future tasks and the external market before launch. Clarity should now be tested, not assumed.",
    "Update the brief before recruiting": "Rewrite the outcomes, task bundle and evidence of capability first. This reduces the risk of selecting against yesterday’s version of the role.",
    "Develop capability internally": "Identify who already holds adjacent capability, what can be learned, and what work or support must change around them.",
    "Redesign the work first": "Map the tasks before deciding the role. Separate human-led, AI-supported, automated and removable work, then reconsider ownership.",
    "Use a blended approach": "Treat the answer as an operating decision: combine targeted hiring with internal development, task redesign and appropriate technology."
  };
  return guidance[decision] || guidance["Use a blended approach"];
}

function buildResults(scroll = true) {
  for (let index = 0; index <= 5; index += 1) {
    if (!validateStep(index)) {
      showStep(index);
      return;
    }
  }

  const scores = getScores();
  const total = scores.reduce((sum, item) => sum + item.score, 0);
  const band = readinessBand(total);
  const role = document.querySelector("#roleTitle").value.trim();
  const company = document.querySelector("#companyName").value.trim();
  const roleFunction = document.querySelector("#roleFunction").value;
  const context = form.elements.decisionContext.value;
  const likelyDecision = form.elements.likelyDecision.value;
  const openQuestion = document.querySelector("#openQuestion").value.trim();

  document.querySelector("#resultRole").textContent = role;
  document.querySelector("#resultContext").textContent = [company, roleFunction, context].filter(Boolean).join(" · ") || "A practical decision aid—not a grade or psychometric assessment.";
  document.querySelector("#totalScore").textContent = total;
  document.querySelector("#scoreRing").style.setProperty("--score-angle", `${(total / 30) * 360}deg`);
  document.querySelector("#scoreRing").setAttribute("aria-label", `Role readiness score ${total} out of 30`);
  document.querySelector("#readinessTitle").textContent = band.title;
  document.querySelector("#readinessText").textContent = band.text;
  document.querySelector("#decisionResult").textContent = likelyDecision;
  document.querySelector("#decisionGuidance").textContent = decisionCopy(likelyDecision);

  document.querySelector("#dimensionResults").innerHTML = scores.map((item) => {
    const itemBand = scoreBand(item.score);
    return `
      <article class="dimension-card ${itemBand.className}">
        <div class="dimension-card-head">
          <span>${item.title}</span>
          <strong>${item.score}/6</strong>
        </div>
        <div class="mini-track"><span style="width:${(item.score / 6) * 100}%"></span></div>
        <p class="dimension-status">${itemBand.label}</p>
        <p>${item.description}</p>
        ${item.note ? `<div class="saved-note"><strong>Your note</strong><span>${escapeHtml(item.note)}</span></div>` : ""}
      </article>`;
  }).join("");

  const priorities = [...scores].sort((a, b) => a.score - b.score).slice(0, 3);
  document.querySelector("#priorityActions").innerHTML = priorities.map((item, index) => `
    <article>
      <span class="priority-number">0${index + 1}</span>
      <p class="result-label">${item.title}</p>
      <h4>${item.actionTitle}</h4>
      <p>${item.action}</p>
    </article>`).join("");

  const fallbackQuestion = `What must change before ${role} is the right answer to the work ahead?`;
  document.querySelector("#workingQuestion").textContent = openQuestion || fallbackQuestion;
  document.querySelector("#summaryHeading").textContent = openQuestion ? "The question you need to resolve next" : "The question to resolve next";

  document.querySelector("#formScore").value = `${total}/30 — ${band.title}`;
  document.querySelector("#formDirection").value = likelyDecision;
  document.querySelector("#formCompany").value = company;
  document.querySelector("#formRole").value = role;
  document.querySelector("#formPriority").value = openQuestion;

  resultsSection.hidden = false;
  document.querySelector(".assessment-shell").classList.add("assessment-complete");
  renderTaskBoard();
  saveState();
  if (scroll) resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderTaskBoard() {
  const board = document.querySelector("#taskBoard");
  if (!board) return;
  board.innerHTML = Object.entries(categoryMeta).map(([key, meta]) => {
    const categoryTasks = tasks.filter((task) => task.category === key);
    const content = categoryTasks.length
      ? categoryTasks.map((task) => `
          <li>
            <div><strong>${escapeHtml(task.name)}</strong><small>${task.impact} importance</small></div>
            <button type="button" data-remove-task="${task.id}" aria-label="Remove ${escapeHtml(task.name)}">×</button>
          </li>`).join("")
      : `<li class="empty-task">No tasks added yet</li>`;
    return `
      <section class="task-column task-${key}">
        <div class="task-column-head"><div><h4>${meta.title}</h4><p>${meta.description}</p></div><span>${categoryTasks.length}</span></div>
        <ul>${content}</ul>
      </section>`;
  }).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function copySummary() {
  const role = document.querySelector("#roleTitle").value.trim();
  const scores = getScores();
  const total = scores.reduce((sum, item) => sum + item.score, 0);
  const band = readinessBand(total);
  const decision = form.elements.likelyDecision.value;
  const priorities = [...scores].sort((a, b) => a.score - b.score).slice(0, 3);
  const taskLines = tasks.length
    ? `\n\nTask map\n${tasks.map((task) => `- ${task.name}: ${categoryMeta[task.category].title} (${task.impact})`).join("\n")}`
    : "";
  const summary = `${role} — Role Readiness Brief\n\nReadiness: ${total}/30 — ${band.title}\nCurrent direction: ${decision}\n\nPriority actions\n${priorities.map((item) => `- ${item.actionTitle}: ${item.action}`).join("\n")}${taskLines}\n\nGenerated with the Next Generation Role Readiness Check.`;

  navigator.clipboard.writeText(summary).then(() => {
    const button = document.querySelector("#copySummary");
    const oldText = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => { button.textContent = oldText; }, 1600);
  });
}

function resetAssessment() {
  const confirmed = window.confirm("Start a new role check? Your current answers and task map will be cleared from this device.");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  tasks = [];
  resultsSection.hidden = true;
  document.querySelector(".assessment-shell").classList.remove("assessment-complete");
  document.querySelector("#roleTitle").setAttribute("aria-invalid", "false");
  renderTaskBoard();
  showStep(0);
  history.replaceState(null, "", location.pathname);
}

renderQuestionSteps();
renderTaskBoard();

form.addEventListener("click", (event) => {
  const next = event.target.closest(".next-step");
  const previous = event.target.closest(".prev-step");
  if (next && validateStep(currentStep)) showStep(currentStep + 1);
  if (previous) showStep(currentStep - 1);
});

form.addEventListener("change", saveState);
form.addEventListener("input", saveState);

document.querySelector("#showResults").addEventListener("click", () => buildResults(true));
document.querySelector("#printBrief").addEventListener("click", () => window.print());
document.querySelector("#copySummary").addEventListener("click", copySummary);
document.querySelector("#resetTop").addEventListener("click", resetAssessment);
document.querySelector("#resetBottom").addEventListener("click", resetAssessment);

document.querySelector("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const taskName = document.querySelector("#taskName");
  const name = taskName.value.trim();
  if (!name) return;
  tasks.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    category: document.querySelector("#taskCategory").value,
    impact: document.querySelector("#taskImpact").value
  });
  taskName.value = "";
  renderTaskBoard();
  saveState();
  taskName.focus();
});

document.querySelector("#taskBoard").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-task]");
  if (!button) return;
  tasks = tasks.filter((task) => task.id !== button.dataset.removeTask);
  renderTaskBoard();
  saveState();
});

document.querySelector("#year").textContent = new Date().getFullYear();
restoreState();
