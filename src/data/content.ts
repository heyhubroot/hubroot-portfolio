/** Process + FAQ + problem copy. Edit text here, the pages render from it. */

export const processSteps = [
  {
    id: "discover",
    title: "Understand the current process",
    short: "Discovery",
    body: "Before anything gets built, I want to see how the work happens today. Who does what, where things come in, which tools are already in use, and what people are tired of doing.",
    output: "A plain description of how the work runs now",
  },
  {
    id: "map",
    title: "Map the manual workflow and friction",
    short: "Workflow mapping",
    body: "I map it step by step, including the bits nobody writes down, like the WhatsApp message someone forwards or the sheet somebody checks every morning. That’s usually where the friction is.",
    output: "A workflow map with the bottlenecks marked",
  },
  {
    id: "design",
    title: "Define the target system and boundaries",
    short: "System design",
    body: "Then I decide what the system should do, and just as important, what it should not do. Where does a person need to approve? What happens when data is missing? What counts as done?",
    output: "Target flow, exception paths and handoff points",
  },
  {
    id: "build",
    title: "Build integrations and AI logic",
    short: "Build / integration",
    body: "I build the workflow, connect the tools, and add AI only where it actually helps, like understanding a message or drafting something. Not everything needs a model.",
    output: "Working system in a test environment",
  },
  {
    id: "test",
    title: "Test normal and failure scenarios",
    short: "Testing",
    body: "Testing the happy path is the easy part. I test the annoying cases too: missing data, API errors, unclear messages, no availability, duplicates. Those are the ones that show up on a Monday morning.",
    output: "Scenario tests, including failure cases",
  },
  {
    id: "connect",
    title: "Connect it to the team’s existing tools",
    short: "Go live",
    body: "The system goes live inside the tools the team already uses, so people don’t have to learn a whole new way of working just to benefit from it.",
    output: "Live system in your real tools",
  },
  {
    id: "handover",
    title: "Document, hand over and monitor",
    short: "Handover / monitoring",
    body: "I document how it works, what each failure path does, and who gets notified when something needs attention. Then I watch it run for real.",
    output: "Docs, alerts and a team that understands the system",
  },
] as const;

export const problems = [
  { title: "Somebody is copy-pasting all day", body: "Data moves from email to sheet to CRM to chat by hand, and one wrong paste breaks everything downstream." },
  { title: "Replies depend on who is free", body: "Customers wait because the person who handles bookings or enquiries is busy with something else." },
  { title: "Follow-ups that never happen", body: "Everyone agrees the follow-up matters. It still gets skipped every busy week." },
  { title: "Information in five places", body: "The order is in one place, the status in a chat, the customer details in a sheet, and nobody has the full picture." },
  { title: "Nobody knows when it breaks", body: "Some automation already exists, but when it fails, it fails quietly, and you find out from an angry customer." },
  { title: "The process lives in one head", body: "One person knows how it all works. When they’re away, everything slows down." },
];

export const reliabilityPillars = [
  { kind: "exception" as const, title: "Exceptions are designed, not discovered", body: "Missing data, unclear messages, API failures, no availability. I map these before building, and each one gets a defined path." },
  { kind: "human" as const, title: "People step in at the right moments", body: "Approvals, judgement calls and anything sensitive go to a person, with the context already attached so they don’t start from zero." },
  { kind: "monitoring" as const, title: "Failures are loud", body: "If something breaks, someone gets told. A workflow that fails quietly is worse than no workflow, because you think it ran." },
  { kind: "database" as const, title: "One source of truth", body: "Every system writes back to a record the team can actually see, so the automation is never a black box." },
];

export const faqs = [
  {
    q: "Do I have to change the tools I already use?",
    a: "Usually no. I build around what you already have where possible: your sheets, CRM, WhatsApp, email, calendar. If one of your tools genuinely can’t be connected, I’ll tell you that early instead of finding out halfway.",
  },
  {
    q: "What if my tool doesn’t have an integration?",
    a: "Most tools have an API or webhook of some kind, even if there’s no ready-made connector. If there really is no way in, we look at alternatives together, but I won’t pretend something connects when it doesn’t.",
  },
  {
    q: "What happens when the automation breaks?",
    a: "Things will fail sometimes. APIs go down, people send weird data. The difference is whether the system was designed for it. I build failure paths, alerts and human handoffs into the system so problems are visible and handled, not silent.",
  },
  {
    q: "Will the AI make things up or say something wrong to my customers?",
    a: "I only use AI where it helps, and I keep it on a short leash: grounded in your information, with clear fallbacks and handoff to a person when it isn’t sure. For anything sensitive, a human approves before it goes out.",
  },
  {
    q: "Do you offer support after the build?",
    a: "Yes. I hand over with documentation and stay around to monitor and fix things as the system runs in real conditions. We can agree on ongoing support depending on what your setup needs.",
  },
  {
    q: "Is my process a good fit for automation?",
    a: "If it’s repetitive, rule-based (mostly), and happens often enough to be annoying, probably yes. If it’s a one-off, or every case needs deep judgement, maybe not, and I’ll say so. Tell me about it and we’ll figure it out.",
  },
  {
    q: "How long does a build take, and what does it cost?",
    a: "It depends on the workflow, the number of tools involved and how many exception paths there are. After I understand the process, I’ll give you a clear scope before anything starts.",
  },
];
