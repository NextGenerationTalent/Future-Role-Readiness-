const STORAGE_KEY = "ng-role-readiness-v2";

const functionProfiles = {
  Operations: {
    opportunities: [
      "Turn recurring operational data into clearer daily and weekly reports.",
      "Compare schedules, capacity and resource options faster.",
      "Spot exceptions earlier so managers can focus on the decisions that matter."
    ],
    human: [
      "Make trade-offs when service, cost, safety and people pull in different directions.",
      "Lead teams through disruption, pressure and change.",
      "Take responsibility for exceptions that do not fit the standard process."
    ],
    capabilities: ["Using data to make decisions", "Managing exceptions", "Leading change"]
  },
  Quality: {
    opportunities: [
      "Prepare first drafts of routine quality documents and summaries.",
      "Find patterns across deviations, complaints or quality data.",
      "Bring the relevant evidence together before a review or investigation."
    ],
    human: [
      "Make final quality and compliance decisions.",
      "Challenge weak evidence and investigate unusual cases.",
      "Accept accountability where patient, product or regulatory risk is involved."
    ],
    capabilities: ["Evidence-based judgment", "Data interpretation", "AI and data controls"]
  },
  Engineering: {
    opportunities: [
      "Search technical information and prepare routine documentation faster.",
      "Support fault finding by comparing current and historical data.",
      "Identify maintenance or performance patterns that deserve attention."
    ],
    human: [
      "Approve safety-critical changes and engineering decisions.",
      "Apply practical experience when the evidence is incomplete.",
      "Balance reliability, cost, quality and operational impact."
    ],
    capabilities: ["Systems thinking", "Data-led problem-solving", "Technical change control"]
  },
  "Supply Chain": {
    opportunities: [
      "Build and compare demand, supply and inventory scenarios faster.",
      "Highlight shortages, delays and planning exceptions earlier.",
      "Reduce time spent compiling routine planning and supplier reports."
    ],
    human: [
      "Choose between imperfect options when supply is constrained.",
      "Manage supplier relationships and difficult conversations.",
      "Take responsibility for risk, service and inventory trade-offs."
    ],
    capabilities: ["Scenario planning", "Commercial judgment", "Exception management"]
  },
  Procurement: {
    opportunities: [
      "Analyse spend, supplier and contract information more quickly.",
      "Prepare supplier research and first-pass comparisons.",
      "Flag contract terms, risks or renewal points for human review."
    ],
    human: [
      "Negotiate and build trusted supplier relationships.",
      "Make commercial and ethical trade-offs.",
      "Challenge recommendations that overlook operational context."
    ],
    capabilities: ["Negotiation", "Risk judgment", "Interpreting AI-supported analysis"]
  },
  Finance: {
    opportunities: [
      "Prepare recurring reports, commentary and first-pass variance analysis.",
      "Compare forecast assumptions and possible outcomes faster.",
      "Identify unusual transactions or movements for review."
    ],
    human: [
      "Interpret what the numbers mean for the business.",
      "Own controls, challenge assumptions and explain uncertainty.",
      "Make commercial decisions where the answer is not contained in the data."
    ],
    capabilities: ["Commercial interpretation", "Data assurance", "Influencing decisions"]
  },
  Commercial: {
    opportunities: [
      "Prepare account research, meeting briefs and first drafts faster.",
      "Reduce time spent updating systems and summarising activity.",
      "Find patterns across customers, opportunities and market information."
    ],
    human: [
      "Build trust and understand what a customer is not saying.",
      "Negotiate, persuade and position an offer.",
      "Make judgment calls about relationships, timing and value."
    ],
    capabilities: ["Consultative questioning", "Commercial judgment", "Using insight well"]
  },
  "People / HR": {
    opportunities: [
      "Prepare first drafts, summaries and routine employee information.",
      "Bring workforce data together to support planning.",
      "Reduce administrative work around recurring people processes."
    ],
    human: [
      "Handle sensitive decisions and difficult conversations.",
      "Challenge incomplete evidence in decisions affecting people.",
      "Maintain trust, fairness and clear accountability."
    ],
    capabilities: ["Human judgment", "Workforce insight", "Responsible use of AI"]
  },
  "Technology / Data": {
    opportunities: [
      "Accelerate routine coding, testing, documentation and analysis.",
      "Identify patterns in system performance and support incidents.",
      "Help teams find and use technical knowledge more quickly."
    ],
    human: [
      "Own architecture, security and material technical decisions.",
      "Challenge outputs when the data or assumptions are weak.",
      "Translate business needs into responsible technical choices."
    ],
    capabilities: ["Architecture and systems judgment", "AI assurance", "Business translation"]
  },
  Other: {
    opportunities: [
      "Reduce time spent preparing routine reports, summaries and documents.",
      "Find useful patterns across information that is difficult to review manually.",
      "Bring options and relevant evidence together before a person makes a decision."
    ],
    human: [
      "Make decisions where context, consequence or uncertainty matters.",
      "Build trust with colleagues, customers and partners.",
      "Question the evidence and take responsibility for the outcome."
    ],
    capabilities: ["Sound judgment", "Using data and AI critically", "Leading change"]
  }
};

const timeAreaInsights = {
  Reporting: "Prepare recurring reports and first drafts faster, leaving more time to interpret what the information means.",
  Administration: "Reduce repetitive data entry, document preparation and routine follow-up.",
  Analysis: "Compare information, find patterns and highlight exceptions for human review.",
  "Planning and scheduling": "Build and compare plans, schedules and scenarios more quickly.",
  "Compliance and documentation": "Organise evidence and prepare routine documentation while keeping final approval human-led.",
  "Coordinating work": "Summarise progress, actions and dependencies so people can focus on resolving delays.",
  "Problem-solving": "Bring possible causes, evidence and options together before an experienced person decides.",
  "Managing people": "Prepare information and reduce administration, while keeping coaching and people decisions human.",
  "Customers or suppliers": "Support research and preparation, while protecting the relationship, negotiation and final judgment."
};

const taskSuggestionsByFunction = {
  Operations: ["Daily performance reporting", "Production scheduling", "Exception management"],
  Quality: ["Quality document preparation", "Trend review", "Deviation investigation"],
  Engineering: ["Technical documentation", "Fault finding", "Maintenance planning"],
  "Supply Chain": ["Demand planning", "Inventory review", "Supplier exception management"],
  Procurement: ["Spend analysis", "Supplier research", "Contract review"],
  Finance: ["Monthly reporting", "Variance analysis", "Forecast preparation"],
  Commercial: ["Account research", "CRM administration", "Proposal preparation"],
  "People / HR": ["People reporting", "Policy drafting", "Employee administration"],
  "Technology / Data": ["Routine coding", "System monitoring", "Technical documentation"],
  Other: ["Recurring reporting", "Document preparation", "Information analysis"]
};

const categoryMeta = {
  human: { title: "Keep human-led", description: "Judgment, trust or accountability is central." },
  augment: { title: "Support with AI", description: "Technology helps; a person remains in control." },
  automate: { title: "Automate", description: "Repeatable work with clear rules and controls." },
  remove: { title: "Reduce or stop", description: "Work that may no longer justify the same effort." }
};

const form = document.querySelector("#assessmentForm");
const resultsSection = document.querySelector("#results");
const progressLabel = document.querySelector("#progressLabel");
const progressCount = document.querySelector("#progressCount");
const progressBar = document.querySelector("#progressBar");

let currentStep = 0;
let tasks = [];

function allSteps() {
  return [...document.querySelectorAll(".step")];
}

function showStep(index, shouldFocus = true) {
  currentStep = Math.max(0, Math.min(index, 3));
  allSteps().forEach((step) => step.classList.toggle("is-active", Number(step.dataset.step) === currentStep));
  const labels = ["The role", "What has changed", "How the work gets done", "Your decision"];
  progressLabel.textContent = labels[currentStep];
  progressCount.textContent = `Step ${currentStep + 1} of 4`;
  progressBar.style.width = `${((currentStep + 1) / 4) * 100}%`;
  saveState();

  if (shouldFocus) {
    document.querySelector(`.step[data-step="${currentStep}"] h2`)?.focus({ preventScroll: true });
    document.querySelector(".tool-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function selectedValues(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function groupHasValue(name) {
  return Boolean(form.querySelector(`input[name="${name}"]:checked`));
}

function validateStep(index) {
  const step = document.querySelector(`.step[data-step="${index}"]`);
  const error = step?.querySelector(".step-error");
  let valid = true;

  if (index === 0) {
    const role = document.querySelector("#roleTitle");
    const roleFunction = document.querySelector("#roleFunction");
    valid = role.value.trim().length > 1 && roleFunction.value !== "" && groupHasValue("decisionContext");
    role.setAttribute("aria-invalid", String(role.value.trim().length <= 1));
    roleFunction.setAttribute("aria-invalid", String(roleFunction.value === ""));
    if (!valid && role.value.trim().length <= 1) role.focus();
    else if (!valid && roleFunction.value === "") roleFunction.focus();
  }

  if (index === 1) {
    valid = selectedValues("changes").length > 0 && selectedValues("timeAreas").length > 0;
  }

  if (index === 2) {
    valid = groupHasValue("repeatLevel") && groupHasValue("judgmentLevel");
  }

  if (index === 3) {
    valid = groupHasValue("sameProfile") && groupHasValue("likelyDecision");
  }

  if (error) error.hidden = valid;
  return valid;
}

function formSnapshot() {
  const values = {};
  [...form.elements].forEach((control) => {
    if (!control.name) return;
    if (control.type === "checkbox") {
      if (!Array.isArray(values[control.name])) values[control.name] = [];
      if (control.checked) values[control.name].push(control.value);
    } else if (control.type === "radio") {
      if (control.checked) values[control.name] = control.value;
    } else {
      values[control.name] = control.value;
    }
  });
  return values;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep, values: formSnapshot(), tasks, completed: !resultsSection.hidden }));
  } catch (_) {
    // The check still works when browser storage is unavailable.
  }
}

function restoreState() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!state) return;
    Object.entries(state.values || {}).forEach(([name, value]) => {
      const controls = [...form.querySelectorAll(`[name="${name}"]`)];
      controls.forEach((control) => {
        if (control.type === "checkbox") control.checked = Array.isArray(value) && value.includes(control.value);
        else if (control.type === "radio") control.checked = control.value === value;
        else control.value = value;
      });
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

function getPosition() {
  const changes = selectedValues("changes").filter((value) => value !== "Nothing significant");
  const repeatLevel = form.elements.repeatLevel.value;
  const sameProfile = form.elements.sameProfile.value;
  const likelyDecision = form.elements.likelyDecision.value;

  if (
    sameProfile === "No" ||
    likelyDecision === "Redesign the role" ||
    (changes.length >= 3 && repeatLevel !== "Very little")
  ) {
    return {
      key: "rethink",
      label: "RETHINK",
      title: "Rethink the role before taking action",
      text: "The work appears to have changed enough that replacing the role like for like could solve yesterday’s problem. Start with the work, then decide what should be hired, developed or redesigned."
    };
  }

  if (
    sameProfile === "Not sure" ||
    changes.length > 0 ||
    likelyDecision === "Update the role first" ||
    likelyDecision === "Develop someone internally" ||
    likelyDecision === "We are not sure yet"
  ) {
    return {
      key: "update",
      label: "UPDATE",
      title: "Update the role before you decide",
      text: "The core role may still be right, but parts of the work, skills or measures of success need to be refreshed before you recruit or make a development decision."
    };
  }

  return {
    key: "keep",
    label: "CHECK",
    title: "The role may still be right—check it",
    text: "You have not identified a major reason to redesign the role. Validate the current brief with the people closest to the work and make sure it reflects how the role will operate next."
  };
}

function getProfile() {
  return functionProfiles[document.querySelector("#roleFunction").value] || functionProfiles.Other;
}

function technologyIdeas(profile) {
  const selected = selectedValues("timeAreas");
  const ideas = selected.map((area) => timeAreaInsights[area]).filter(Boolean);
  profile.opportunities.forEach((idea) => {
    if (ideas.length < 3 && !ideas.includes(idea)) ideas.push(idea);
  });
  return ideas.slice(0, 3);
}

function nextActions(position, role) {
  if (position.key === "rethink") {
    return [
      { title: "Do not reuse the old brief yet", text: `Write down the work ${role} must deliver now before discussing the person or previous job description.` },
      { title: "Map the ten biggest tasks", text: "Mark each task Keep human-led, Support with AI, Automate, or Reduce. Focus first on high-impact work." },
      { title: "Choose the right mix", text: "Decide what should be recruited, developed internally, supported by technology or moved elsewhere." }
    ];
  }
  if (position.key === "update") {
    return [
      { title: "Rewrite the purpose", text: `Complete one sentence: “Over the next 12–24 months, ${role} exists to…”` },
      { title: "Update the task list", text: "Remove work that has reduced, add work that is growing, and show clearly where technology will support the person." },
      { title: "Split the skills", text: "Separate what someone must bring on day one from what a capable person could learn after joining." }
    ];
  }
  return [
    { title: "Check the purpose", text: `Confirm the three outcomes ${role} must deliver over the next 12–24 months.` },
    { title: "Test the brief", text: "Ask the current team where the written role no longer matches the work they actually do." },
    { title: "Check the evidence", text: "Make sure every hiring requirement connects directly to an important part of the role." }
  ];
}

function signalList() {
  const changes = selectedValues("changes").filter((value) => value !== "Nothing significant");
  const areas = selectedValues("timeAreas");
  const repeat = form.elements.repeatLevel.value;
  const judgment = form.elements.judgmentLevel.value;
  const same = form.elements.sameProfile.value;
  return [
    changes.length ? `${changes.length} change${changes.length === 1 ? "" : "s"} affecting the role` : "No major external change selected",
    `${areas.length} area${areas.length === 1 ? "" : "s"} taking most of the role’s time`,
    `${repeat} of the work is repeated or follows clear rules`,
    `${judgment} of the work depends on judgment, trust or accountability`,
    same === "Yes" ? "You would broadly hire the same profile again" : same === "No" ? "You would not hire the same profile again" : "You are unsure whether the same profile is still right"
  ];
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function buildResults(scroll = true) {
  for (let index = 0; index <= 3; index += 1) {
    if (!validateStep(index)) {
      showStep(index);
      return;
    }
  }

  const position = getPosition();
  const profile = getProfile();
  const role = document.querySelector("#roleTitle").value.trim();
  const company = document.querySelector("#companyName").value.trim();
  const roleFunction = document.querySelector("#roleFunction").value || "Other";
  const context = form.elements.decisionContext.value;
  const direction = form.elements.likelyDecision.value;
  const actions = nextActions(position, role);

  document.querySelector("#resultRole").textContent = role;
  document.querySelector("#resultContext").textContent = [company, roleFunction, context].filter(Boolean).join(" · ");
  document.querySelector("#signalWord").textContent = position.label;
  document.querySelector("#signalRing").className = `score-ring signal-ring signal-${position.key}`;
  document.querySelector("#signalRing").setAttribute("aria-label", position.title);
  document.querySelector("#readinessTitle").textContent = position.title;
  document.querySelector("#readinessText").textContent = position.text;
  document.querySelector("#decisionResult").textContent = direction;
  document.querySelector("#decisionSignals").innerHTML = renderList(signalList());

  const insightGroups = [
    { number: "01", label: "Where technology could help", title: "Examine these areas", items: technologyIdeas(profile) },
    { number: "02", label: "What to keep human", title: "Protect this work", items: profile.human },
    { number: "03", label: "What may matter more", title: "Build or find these capabilities", items: profile.capabilities }
  ];

  document.querySelector("#roleInsights").innerHTML = insightGroups.map((group) => `
    <article class="role-insight-card">
      <span class="insight-number">${group.number}</span>
      <p class="result-label">${group.label}</p>
      <h4>${group.title}</h4>
      ${renderList(group.items)}
    </article>`).join("");

  document.querySelector("#priorityActions").innerHTML = actions.map((action, index) => `
    <article>
      <span class="priority-number">0${index + 1}</span>
      <p class="result-label">Next action</p>
      <h4>${escapeHtml(action.title)}</h4>
      <p>${escapeHtml(action.text)}</p>
    </article>`).join("");

  const questions = {
    rethink: "What work needs to be done—and what is the best mix of people, skills and technology to do it?",
    update: "Which parts of this role should change before you use the current job description again?",
    keep: "What would make this role more effective without changing its core purpose?"
  };
  document.querySelector("#workingQuestion").textContent = questions[position.key];
  document.querySelector("#formPosition").value = position.title;
  document.querySelector("#formDirection").value = direction;
  document.querySelector("#formCompany").value = company;
  document.querySelector("#formRole").value = role;
  document.querySelector("#formPriority").value = questions[position.key];

  renderTaskSuggestions(roleFunction);
  resultsSection.hidden = false;
  document.querySelector(".assessment-shell").classList.add("assessment-complete");
  saveState();
  if (scroll) resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderTaskSuggestions(roleFunction) {
  const suggestions = taskSuggestionsByFunction[roleFunction] || taskSuggestionsByFunction.Other;
  document.querySelector("#taskSuggestions").innerHTML = suggestions.map((suggestion) => `
    <button type="button" data-task-suggestion="${escapeHtml(suggestion)}">${escapeHtml(suggestion)}</button>`).join("");
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
      : `<li class="empty-task">No tasks added</li>`;
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
  const position = getPosition();
  const profile = getProfile();
  const direction = form.elements.likelyDecision.value;
  const actions = nextActions(position, role);
  const taskLines = tasks.length
    ? `\n\nTask map\n${tasks.map((task) => `- ${task.name}: ${categoryMeta[task.category].title} (${task.impact})`).join("\n")}`
    : "";
  const summary = `${role} — Role Readiness Brief\n\nLikely position: ${position.title}\nCurrent direction: ${direction}\n\nWhere technology could help\n${technologyIdeas(profile).map((item) => `- ${item}`).join("\n")}\n\nKeep human-led\n${profile.human.map((item) => `- ${item}`).join("\n")}\n\nNext actions\n${actions.map((item) => `- ${item.title}: ${item.text}`).join("\n")}${taskLines}\n\nGenerated with the Next Generation Role Readiness Check.`;

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
  renderTaskBoard();
  showStep(0);
  history.replaceState(null, "", location.pathname);
}

const reviewForm = document.querySelector("#reviewForm");
const reviewStatus = document.querySelector("#reviewFormStatus");
const reviewSuccessMarkup = reviewStatus.innerHTML;

function showReviewConfirmation() {
  reviewStatus.classList.remove("is-error");
  reviewStatus.innerHTML = reviewSuccessMarkup;
  reviewForm.hidden = true;
  reviewStatus.hidden = false;
  reviewStatus.focus();
}

async function submitReview(event) {
  event.preventDefault();
  if (!reviewForm.reportValidity()) return;

  const submitButton = reviewForm.querySelector('button[type="submit"]');
  const originalLabel = submitButton.innerHTML;
  reviewStatus.hidden = true;
  reviewStatus.classList.remove("is-error");
  submitButton.disabled = true;
  submitButton.textContent = "Sending…";

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(reviewForm)).toString()
    });
    if (!response.ok) throw new Error("Form submission failed");

    const url = new URL(window.location.href);
    url.searchParams.set("submitted", "true");
    url.hash = "roleReview";
    history.replaceState(null, "", url);
    showReviewConfirmation();
  } catch (error) {
    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
    reviewStatus.hidden = false;
    reviewStatus.classList.add("is-error");
    reviewStatus.innerHTML = "<p class=\"eyebrow\">Could not send</p><h4>Your result is safe.</h4><p>Please try the form again. Nothing from your assessment has been lost.</p>";
    reviewStatus.focus();
  }
}

form.addEventListener("click", (event) => {
  const next = event.target.closest(".next-step");
  const previous = event.target.closest(".prev-step");
  if (next && validateStep(currentStep)) showStep(currentStep + 1);
  if (previous) showStep(currentStep - 1);
});

form.addEventListener("change", (event) => {
  if (event.target.name === "changes") {
    const none = form.querySelector('input[name="changes"][value="Nothing significant"]');
    if (event.target === none && none.checked) {
      form.querySelectorAll('input[name="changes"]:not([value="Nothing significant"])').forEach((input) => { input.checked = false; });
    } else if (event.target.checked) {
      none.checked = false;
    }
  }

  if (event.target.name === "timeAreas" && selectedValues("timeAreas").length > 3) {
    event.target.checked = false;
    const limitMessage = document.querySelector("#timeLimitMessage");
    limitMessage.hidden = false;
    setTimeout(() => { limitMessage.hidden = true; }, 2200);
  }
  saveState();
});

form.addEventListener("input", saveState);
document.querySelector("#showResults").addEventListener("click", () => buildResults(true));
document.querySelector("#printBrief").addEventListener("click", () => window.print());
document.querySelector("#copySummary").addEventListener("click", copySummary);
document.querySelector("#resetTop").addEventListener("click", resetAssessment);
document.querySelector("#resetBottom").addEventListener("click", resetAssessment);
reviewForm.addEventListener("submit", submitReview);

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

document.querySelector("#taskSuggestions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-task-suggestion]");
  if (!button) return;
  document.querySelector("#taskName").value = button.dataset.taskSuggestion;
  document.querySelector("#taskName").focus();
});

document.querySelector("#taskBoard").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-task]");
  if (!button) return;
  tasks = tasks.filter((task) => task.id !== button.dataset.removeTask);
  renderTaskBoard();
  saveState();
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderTaskBoard();
restoreState();

if (new URLSearchParams(window.location.search).get("submitted") === "true") {
  showReviewConfirmation();
}
