import type { Project } from "./types";

/**
 * PROJECT DATA: every case study page, card and diagram renders from this file.
 *
 * Rules (from the brief):
 * - No invented metrics, clients, testimonials or outcomes.
 * - `status.label` is the honest proof label. Keep it exact.
 * - `flow` is the business process. Node `kind` must come from the node grammar in types.ts.
 * - `media` is optional supporting evidence. Every item needs `proves`.
 *
 * NOTE FOR HUBROOT: the first-person copy (before / decisions / evidence) is drafted from the
 * flows in the brief. Read through and correct anything that isn't exactly how it happened.
 */
export const projects: Project[] = [
  {
    slug: "whatsapp-appointment-booking",
    title: "WhatsApp Appointment Booking Automation",
    summary:
      "Customers book, reschedule and cancel appointments by chatting on WhatsApp, and the calendar stays correct without anyone babysitting it.",
    status: { label: "Production client system", tier: "live" },
    services: ["booking"],
    featured: true,
    order: 1,
    opening:
      "Bookings were coming in on WhatsApp, which is where the customers already are. The problem was that every booking was a conversation somebody had to hold manually, from “are you free Thursday?” all the way to the confirmation.",
    before: [
      "Customer sends a message on WhatsApp asking to book",
      "Someone reads it whenever they get a chance",
      "They open the calendar and check what is free",
      "Back and forth with the customer until a time works",
      "Booking is entered by hand, confirmation typed by hand",
      "Reschedules and cancellations start the whole thing again",
    ],
    whyItMattered: [
      "Replies depended on whoever was holding the phone, so response time was all over the place.",
      "Calendar and chat could disagree, which is how you get double bookings.",
      "Reschedules and cancellations were easy to miss in a busy chat.",
    ],
    concept:
      "I wanted the customer to just chat like normal, and the system to work out what they want, check real availability, book it and confirm it. Changes should update the same booking, not create a mess.",
    flow: [
      { id: "msg", kind: "input", label: "WhatsApp message", detail: "Customer messages the business number like they normally would.", tools: ["whatsapp"], tech: "WhatsApp Cloud API webhook into n8n" },
      { id: "intent", kind: "ai", label: "Understand intent", detail: "Work out if they want to book, reschedule, cancel, or something else entirely." },
      { id: "avail", kind: "integration", label: "Check availability", detail: "Look up real open slots instead of guessing.", tools: ["calcom"], tech: "Cal.com availability lookup" },
      { id: "book", kind: "decision", label: "Book the slot", detail: "Customer picks a slot and the booking is created." , tools: ["calcom"] },
      { id: "confirm", kind: "notification", label: "Send confirmation", detail: "Customer gets the confirmation back in the same WhatsApp chat.", tools: ["whatsapp"] },
      { id: "change", kind: "decision", label: "Reschedule / cancel", detail: "Later changes find the existing booking and update it." },
      { id: "update", kind: "database", label: "Calendar + records updated", detail: "Calendar and database reflect the latest state of every booking.", tools: ["calcom", "n8n"] },
    ],
    exceptions: [
      { id: "unclear", at: "intent", trigger: "Message is unclear or not about booking", response: "The bot asks a clarifying question instead of guessing, and if it still can’t tell, the chat is flagged for a staff member.", owner: "human", ownerLabel: "staff" },
      { id: "noslot", at: "avail", trigger: "No availability for the requested time", response: "Customer gets the nearest open options instead of a dead end.", owner: "system" },
      { id: "apifail", at: "book", trigger: "Calendar API fails while booking", response: "Booking is not confirmed to the customer until the calendar actually accepts it. The failure is logged for follow-up.", owner: "human", ownerLabel: "me / staff" },
      { id: "nobooking", at: "change", trigger: "Reschedule request but no matching booking", response: "System asks for details to find the booking, then hands over if it still can’t match.", owner: "human", ownerLabel: "staff" },
    ],
    decisions: [
      { title: "WhatsApp first, not a booking page", body: "The customers were already on WhatsApp. Sending them to a separate booking link is one more step where people drop off, so I kept the whole thing inside the chat." },
      { title: "Calendar is the source of truth", body: "I made Cal.com the thing that decides what is free. The bot never promises a slot the calendar hasn’t confirmed, because a wrong confirmation is worse than a slow one." },
      { title: "Reschedule and cancel are first-class", body: "Booking is the easy part. Most of the mess in a manual process comes from changes, so I treated reschedule and cancel as proper paths, not afterthoughts." },
    ],
    evidence: [
      "Running in production for a client.",
      "Handles booking, confirmation, reschedule and cancellation in the same conversation.",
    ],
    demonstrates:
      "Taking a conversation that used to need a person on every step and turning it into a system that holds up in real use, with the unclear cases still going to a human.",
    stack: [
      { tool: "n8n", role: "Orchestrates the conversation logic and integrations" },
      { tool: "whatsapp", role: "Customer channel, inbound and outbound messages" },
      { tool: "calcom", role: "Availability, bookings, reschedules and cancellations" },
    ],
  },
  {
    slug: "ecommerce-order-to-delivery",
    title: "E-commerce Order-to-Delivery Automation",
    summary:
      "Every order gets one record that follows it from fulfilment to rider to doorstep, and the customer hears what is happening without having to ask.",
    status: { label: "Workflow build / implementation", tier: "build" },
    services: ["ecommerce"],
    featured: true,
    order: 2,
    opening:
      "For a small e-commerce operation, the order is easy. It is everything after the order that gets messy: who is packing it, which rider has it, did it arrive, and what happens when it didn’t.",
    before: [
      "Order comes in and is copied into a sheet or chat",
      "Fulfilment is coordinated over messages",
      "Rider is assigned by whoever remembers",
      "Delivery status lives in the rider’s chat",
      "Customer asks “where is my order?” and someone has to go and find out",
      "Failed deliveries are handled whenever somebody notices",
    ],
    whyItMattered: [
      "Information was split between sheets, chats and people’s memory.",
      "Customers had to chase updates, which is bad experience and extra work.",
      "Failed deliveries had no clear owner.",
    ],
    concept:
      "One record per order, and every step updates that record. The customer gets notified at the moments that matter, and failed delivery is its own path with a person on it.",
    flow: [
      { id: "order", kind: "input", label: "New order", detail: "Order arrives from the store or sales channel." },
      { id: "record", kind: "database", label: "Order record created", detail: "One record holds the order and its status from here on.", tools: ["airtable", "googlesheets"] },
      { id: "fulfil", kind: "actor", label: "Fulfilment", detail: "Team packs the order and marks it ready." },
      { id: "rider", kind: "decision", label: "Rider assigned", detail: "A rider is attached to the order so there is a clear owner for delivery." },
      { id: "status", kind: "integration", label: "Delivery update", detail: "Delivery status is updated on the record as it changes.", tools: ["workflow"] },
      { id: "notify", kind: "notification", label: "Customer notified", detail: "Customer gets an update at key points without having to ask.", tools: ["email"] },
    ],
    exceptions: [
      { id: "failed", at: "status", trigger: "Delivery fails (customer unavailable, wrong address)", response: "Order moves into a failed-delivery state and someone is assigned to sort it out with the customer.", owner: "human", ownerLabel: "ops team" },
      { id: "missing", at: "record", trigger: "Order is missing key details (address, phone)", response: "Record is flagged before fulfilment so it doesn’t get packed and stuck.", owner: "human", ownerLabel: "ops team" },
      { id: "norider", at: "rider", trigger: "No rider assigned in time", response: "Order is surfaced as unassigned instead of quietly waiting.", owner: "human", ownerLabel: "dispatcher" },
    ],
    decisions: [
      { title: "Build around the sheet they already use", body: "The team was already living in a spreadsheet, so I used Airtable / Google Sheets as the record instead of introducing a whole new system they’d have to learn." },
      { title: "Failed delivery is not an edge case", body: "In delivery, failed attempts happen all the time. I gave it its own state and owner so it doesn’t just sit there looking like an active order." },
    ],
    evidence: ["Workflow built and implemented around an Airtable / Google Sheets order record."],
    demonstrates:
      "Designing an operational workflow where the record is the backbone, status changes are visible, and the failure path is planned from the start.",
    stack: [
      { tool: "airtable", role: "Order record and status tracking" },
      { tool: "googlesheets", role: "Alternative record for sheet-based teams" },
      { tool: "email", role: "Customer notifications" },
      { tool: "workflow", role: "Automation connecting each step" },
    ],
  },
  {
    slug: "ecommerce-return-requests",
    title: "E-commerce Return Request Automation",
    summary:
      "Return requests are checked against the policy, recorded, and walked through to refund or replacement, with invalid ones going to manual review.",
    status: { label: "Workflow build / tested scenarios", tier: "build" },
    services: ["ecommerce"],
    featured: true,
    order: 3,
    opening:
      "Returns are one of those things that look small until you’re the one handling them. Every request needs checking against the policy, instructions, tracking, and then a refund or replacement at the end.",
    before: [
      "Customer sends a return request by message or email",
      "Someone checks the order and the return policy by hand",
      "Instructions are typed out each time",
      "Return shipment is tracked loosely, if at all",
      "Refund or replacement waits on someone remembering",
    ],
    whyItMattered: [
      "Policy was applied differently depending on who handled the request.",
      "Requests could get lost between the first message and the refund.",
      "Customers had no idea where their return was.",
    ],
    concept:
      "Check eligibility first, record everything, send clear instructions, track it, then finish with a refund or replacement. Anything that doesn’t fit the rules goes to a person.",
    flow: [
      { id: "req", kind: "input", label: "Return request", detail: "Customer submits a return request." },
      { id: "elig", kind: "decision", label: "Eligibility check", detail: "Request is checked against the return policy (window, item, condition)." },
      { id: "rec", kind: "database", label: "Return recorded", detail: "A return record is created and linked to the order.", tools: ["datastore"] },
      { id: "instr", kind: "notification", label: "Instructions sent", detail: "Customer gets clear return instructions.", tools: ["notify"] },
      { id: "track", kind: "integration", label: "Return tracked", detail: "Return progress is tracked on the record.", tools: ["n8n"] },
      { id: "resolve", kind: "decision", label: "Refund / replacement", detail: "Once the return is received, it ends in a refund or a replacement." },
    ],
    exceptions: [
      { id: "invalid", at: "elig", trigger: "Request doesn’t meet the policy", response: "Instead of auto-rejecting, it goes to manual review so a person makes the call.", owner: "human", ownerLabel: "support team" },
      { id: "noorder", at: "req", trigger: "Order can’t be matched", response: "Customer is asked for the right order details; unresolved cases go to review.", owner: "human", ownerLabel: "support team" },
      { id: "stuck", at: "track", trigger: "Return not received after a while", response: "Return is flagged so someone follows up instead of it sitting open forever.", owner: "human", ownerLabel: "support team" },
    ],
    decisions: [
      { title: "Invalid doesn’t mean auto-reject", body: "I didn’t want the system rejecting customers on its own. If a request fails the rules, a person reviews it. The automation handles the clear cases, people handle the judgement calls." },
      { title: "Test the scenarios, not just the happy path", body: "I ran it through different scenarios (eligible, outside the window, unmatched orders) because a returns flow that only works for perfect requests isn’t really working." },
    ],
    evidence: [
      "Built in n8n and tested against different return scenarios, including valid, invalid and manual-review cases.",
    ],
    demonstrates:
      "Turning a policy into consistent logic while keeping humans in charge of the exceptions.",
    stack: [
      { tool: "n8n", role: "Workflow logic, eligibility and routing" },
      { tool: "datastore", role: "Return records" },
      { tool: "notify", role: "Customer instructions and updates" },
    ],
  },
  {
    slug: "dental-patient-reactivation",
    title: "Dental Patient Reactivation System",
    summary:
      "Patients who are overdue for a visit get a personal follow-up with a booking link, and the clinic can see who booked from one Airtable view.",
    status: { label: "Client workflow / pilot", tier: "live" },
    services: ["booking", "outreach"],
    featured: true,
    order: 4,
    opening:
      "Clinics have a list of patients who haven’t been back in a while. Everyone knows they should follow up. It almost never happens consistently, because it’s manual and there’s always something more urgent.",
    before: [
      "Someone exports or scrolls the patient list",
      "They try to work out who is overdue",
      "Follow-ups are sent one by one, when there is time",
      "No clear view of who replied or booked",
    ],
    whyItMattered: [
      "Follow-ups were easy to skip on a busy week.",
      "Without tracking, there was no way to see if follow-up was even working.",
    ],
    concept:
      "Find overdue patients automatically, send a follow-up that sounds personal, give them a booking link, and track bookings back into Airtable so the clinic can see what happened.",
    flow: [
      { id: "find", kind: "database", label: "Identify overdue patients", detail: "Patients past their recall date are pulled from the clinic’s records.", tools: ["airtable"] },
      { id: "msg", kind: "ai", label: "Personalised follow-up", detail: "Each patient gets a follow-up written for them, not a mass blast.", tools: ["gmail"] },
      { id: "link", kind: "integration", label: "Booking link", detail: "Follow-up includes a direct booking link.", tools: ["calcom"] },
      { id: "track", kind: "monitoring", label: "Booking tracked", detail: "When a patient books, it is matched back to them.", tools: ["n8n"] },
      { id: "view", kind: "actor", label: "Clinic sees results", detail: "Clinic staff see who was contacted and who booked in Airtable.", tools: ["airtable"] },
    ],
    exceptions: [
      { id: "nocontact", at: "find", trigger: "Patient has no valid email", response: "Patient is skipped and flagged so staff can reach them another way.", owner: "human", ownerLabel: "clinic staff" },
      { id: "bounce", at: "msg", trigger: "Email fails to send or bounces", response: "Failure is recorded on the patient row instead of silently dropped.", owner: "system" },
      { id: "nomatch", at: "track", trigger: "Booking can’t be matched to a patient", response: "Booking is left for staff to match manually.", owner: "human", ownerLabel: "clinic staff" },
    ],
    decisions: [
      { title: "Airtable as the clinic’s window", body: "I wanted the clinic to see what the system was doing without logging into n8n. Airtable became the place they check who was contacted and who booked." },
      { title: "Pilot before scaling", body: "Running it as a pilot first means we can see how patients actually respond before turning it up." },
    ],
    evidence: ["Running as a client pilot."],
    demonstrates:
      "Making a follow-up process consistent and visible, so the clinic isn’t relying on memory or free time.",
    stack: [
      { tool: "airtable", role: "Patient list, contact status and booking visibility" },
      { tool: "gmail", role: "Personalised follow-up emails" },
      { tool: "calcom", role: "Booking link and bookings" },
      { tool: "n8n", role: "Orchestration and tracking" },
    ],
  },
  {
    slug: "ai-cold-outreach-draft-helper",
    title: "AI Cold-Outreach Draft Helper",
    summary:
      "Each prospect row in a sheet gets qualified and a personalised draft written back next to it, ready for a human to review and send.",
    status: { label: "Completed workflow", tier: "build" },
    services: ["outreach"],
    featured: true,
    order: 5,
    opening:
      "Writing cold emails that don’t sound like cold emails takes time. The research and first draft are the slow part, and that’s exactly what can be helped.",
    before: [
      "Prospect list sits in Google Sheets",
      "Each prospect is researched manually",
      "Each email is written from scratch or from a stiff template",
      "Nothing records which rows are done",
    ],
    whyItMattered: [
      "Personalised outreach didn’t scale past a few per day.",
      "Template emails were fast but obviously templates.",
    ],
    concept:
      "Go through the sheet row by row, qualify the prospect, write a personalised draft, put it back in the sheet, and tell me if anything breaks.",
    flow: [
      { id: "row", kind: "input", label: "Prospect row", detail: "A new or unprocessed prospect row in the sheet.", tools: ["googlesheets"] },
      { id: "qual", kind: "ai", label: "Qualification", detail: "Prospect is checked against the criteria before any writing happens.", tools: ["openai"] },
      { id: "draft", kind: "ai", label: "Personalised draft", detail: "A draft written for that specific prospect.", tools: ["openai"] },
      { id: "write", kind: "database", label: "Written back to sheet", detail: "Draft goes back on the same row, so the sheet stays the single place to work.", tools: ["googlesheets"] },
      { id: "review", kind: "human", label: "Human reviews & sends", detail: "A person reads the draft and decides to send it.", tools: ["gmail"] },
    ],
    exceptions: [
      { id: "unqual", at: "qual", trigger: "Prospect doesn’t meet criteria", response: "Row is marked as not qualified and no draft is written.", owner: "system" },
      { id: "missing", at: "row", trigger: "Row is missing data needed to personalise", response: "Row is marked for attention instead of producing a generic draft.", owner: "human", ownerLabel: "me" },
      { id: "apierr", at: "draft", trigger: "AI or API call fails", response: "An error notification goes out so the run doesn’t fail quietly.", owner: "human", ownerLabel: "me" },
    ],
    decisions: [
      { title: "Drafts, not auto-send", body: "I deliberately stopped at the draft. Outreach goes out under someone’s name, so a person should read it first." },
      { title: "Qualify before writing", body: "No point writing a lovely email to the wrong person. Qualification runs first so drafts only get written for rows worth it." },
      { title: "Errors should be loud", body: "A workflow that fails silently is worse than no workflow, because you think it ran. I added error notifications for that reason." },
    ],
    evidence: ["Completed workflow, running from a Google Sheet with error notifications."],
    demonstrates:
      "Using AI for the slow part of a task while keeping the human decision exactly where it matters.",
    stack: [
      { tool: "googlesheets", role: "Prospect list and draft output" },
      { tool: "openai", role: "Qualification and draft writing" },
      { tool: "gmail", role: "Sending (after review) and error notifications" },
      { tool: "n8n", role: "Orchestration" },
    ],
  },
  {
    slug: "recruittech-ats",
    title: "RecruitTech ATS",
    summary:
      "A deployed applicant tracking app where every application becomes a candidate record moving through screening and interview stages.",
    status: { label: "Deployed application", tier: "live" },
    services: ["recruitment", "internal-tools"],
    featured: true,
    order: 6,
    opening:
      "Hiring falls apart in the tracking. Applications, CVs, statuses and interview notes spread across email and spreadsheets until nobody is sure where a candidate stands.",
    before: [
      "Applications arrive through different channels",
      "Candidate details are copied into a spreadsheet",
      "Status updates depend on someone remembering to change a cell",
      "Recruiters dig through email to see what’s next",
    ],
    whyItMattered: [
      "Candidates slipped through the cracks between stages.",
      "Recruiters spent their time on admin instead of people.",
    ],
    concept:
      "A proper app where each application creates a candidate record, the stage is always clear, and the recruiter can see what needs their action.",
    flow: [
      { id: "apply", kind: "input", label: "Application", detail: "Candidate applies through the app.", tools: ["nextjs"] },
      { id: "cand", kind: "database", label: "Candidate record", detail: "Application becomes a structured candidate record.", tools: ["supabase"] },
      { id: "screen", kind: "decision", label: "Screening / status", detail: "Candidate is screened and given a clear status." },
      { id: "interview", kind: "actor", label: "Interview stage", detail: "Shortlisted candidates move into interviews." },
      { id: "action", kind: "human", label: "Recruiter action", detail: "Recruiter decides the next move: advance, hold or reject." },
      { id: "pipe", kind: "monitoring", label: "Hiring pipeline", detail: "Everyone can see the pipeline at a glance." },
    ],
    exceptions: [
      { id: "dup", at: "cand", trigger: "Same candidate applies twice", response: "Duplicate is caught so the recruiter isn’t working two records for one person.", owner: "system" },
      { id: "incomplete", at: "apply", trigger: "Application is incomplete", response: "Validation stops it at submission instead of creating a half-record.", owner: "system" },
      { id: "stale", at: "action", trigger: "Candidate sitting in a stage with no action", response: "Shows up in the pipeline as waiting on the recruiter.", owner: "human", ownerLabel: "recruiter" },
    ],
    decisions: [
      { title: "A real app, not another sheet", body: "Sheets were the problem, so I built it as a Next.js app on Supabase, with Airtable / Google Sheets still available where the team wanted them." },
      { title: "Recruiter stays the decision maker", body: "The app moves information around. Who gets hired is a human call, so recruiter action is a clear step in the pipeline." },
    ],
    evidence: ["Deployed on Netlify."],
    demonstrates:
      "Building a full application (not just a workflow) when the problem needs a proper interface and data model.",
    stack: [
      { tool: "nextjs", role: "Application front end" },
      { tool: "supabase", role: "Database and auth" },
      { tool: "airtable", role: "Optional team-facing views" },
      { tool: "netlify", role: "Deployment" },
    ],
  },
  {
    slug: "bright-smile-dental-voice-agent",
    title: "Bright Smile Dental AI Voice Agent",
    summary:
      "A voice agent that answers inbound calls for a dental practice, answers treatment questions, handles appointment requests and escalates with a call summary.",
    status: { label: "AI voice system / demo", tier: "prototype" },
    services: ["booking", "support"],
    order: 7,
    opening:
      "Clinics miss calls. During busy hours the phone rings while the front desk is with a patient, and every missed call could be a booking.",
    before: [
      "Calls come in while front desk is busy",
      "Missed calls go to voicemail or nowhere",
      "Callbacks happen later, if at all",
      "Details from calls are scribbled or forgotten",
    ],
    whyItMattered: [
      "Missed calls are missed patients.",
      "Front desk gets pulled between the phone and the person in front of them.",
    ],
    concept:
      "A voice agent that picks up, understands what the caller wants, answers basic questions, handles the appointment part, and hands over anything it shouldn’t handle, with a summary so nobody starts from zero.",
    flow: [
      { id: "call", kind: "input", label: "Inbound call", detail: "Patient calls the practice.", tools: ["elevenlabs"] },
      { id: "intent", kind: "ai", label: "Understand intent", detail: "Agent works out why they’re calling.", tools: ["elevenlabs"] },
      { id: "info", kind: "database", label: "Patient / treatment info", detail: "Agent pulls relevant patient or treatment information.", tools: ["supabase", "mcp"] },
      { id: "appt", kind: "decision", label: "Appointment response", detail: "Agent responds to the appointment request." },
      { id: "book", kind: "human", label: "Book or transfer", detail: "Either books or transfers the call to a person." },
      { id: "summary", kind: "notification", label: "Call summary", detail: "A summary of the call is recorded for the team." },
    ],
    exceptions: [
      { id: "unsure", at: "intent", trigger: "Agent can’t tell what the caller needs", response: "Transfers / escalates instead of bluffing through it.", owner: "human", ownerLabel: "front desk" },
      { id: "clinical", at: "info", trigger: "Caller asks something clinical or urgent", response: "Agent doesn’t give clinical advice; it escalates.", owner: "human", ownerLabel: "clinic" },
      { id: "nodata", at: "info", trigger: "Patient or treatment data not found", response: "Agent says so and escalates rather than making something up.", owner: "human", ownerLabel: "front desk" },
    ],
    decisions: [
      { title: "Knowing when to hand over", body: "For a clinic, the agent being wrong is worse than the agent transferring. I designed the escalation and summary as part of the core flow." },
      { title: "Grounded in real data", body: "Answers come from patient and treatment data via Supabase / MCP, not from whatever the model feels like saying." },
    ],
    evidence: ["Demo build of the voice agent."],
    demonstrates:
      "Designing a voice AI system with clear limits, data grounding and a human escalation path.",
    stack: [
      { tool: "elevenlabs", role: "Voice agent" },
      { tool: "supabase", role: "Patient and treatment data" },
      { tool: "mcp", role: "Tool access for the agent" },
    ],
  },
  {
    slug: "founder-lead-intelligence",
    title: "Founder Lead Intelligence & Outreach Automation",
    summary:
      "Finds businesses, extracts and validates contacts, qualifies them and drafts personalised outreach into a CRM, with a human review before anything goes out.",
    status: { label: "Workflow build", tier: "build" },
    services: ["outreach"],
    order: 8,
    opening:
      "Founders doing their own outbound spend hours finding businesses, hunting for emails that might bounce, and then writing outreach on top of that.",
    before: [
      "Search for businesses manually",
      "Copy details into a sheet",
      "Guess or hunt for email addresses",
      "Write outreach one by one",
    ],
    whyItMattered: [
      "Bad emails mean bounces and hurt sender reputation.",
      "Manual research eats the time that should go into selling.",
    ],
    concept:
      "Pull businesses from a source, extract the details, validate the emails, qualify, store in the CRM, draft outreach, then a human checks it.",
    flow: [
      { id: "src", kind: "input", label: "Business source", detail: "Businesses pulled from a source like Google Maps.", tools: ["googlemaps"] },
      { id: "extract", kind: "integration", label: "Extraction", detail: "Business details and contacts are extracted." },
      { id: "valid", kind: "decision", label: "Email validation", detail: "Emails are validated before they’re used.", tools: ["validation"] },
      { id: "qual", kind: "ai", label: "Qualification", detail: "Leads are checked against the founder’s criteria.", tools: ["llm"] },
      { id: "crm", kind: "database", label: "CRM / database", detail: "Qualified leads stored in one place.", tools: ["crm"] },
      { id: "out", kind: "ai", label: "Personalised outreach", detail: "Outreach is drafted for each lead.", tools: ["llm"] },
      { id: "review", kind: "human", label: "Human review", detail: "Founder reviews before anything is sent." },
    ],
    exceptions: [
      { id: "invalid", at: "valid", trigger: "Email fails validation", response: "Lead is held back instead of risking a bounce.", owner: "system" },
      { id: "noextract", at: "extract", trigger: "Extraction finds no usable contact", response: "Lead is marked incomplete and not pushed further.", owner: "system" },
      { id: "reject", at: "review", trigger: "Draft isn’t good enough", response: "Founder edits or rejects it. Nothing sends without approval.", owner: "human", ownerLabel: "founder" },
    ],
    decisions: [
      { title: "Validate before you qualify", body: "There’s no point spending AI calls qualifying a lead you can’t even email, so validation comes first." },
      { title: "Human review at the end", body: "It drafts, it doesn’t decide. The founder reviews every message." },
    ],
    evidence: ["Workflow build covering sourcing through to reviewed outreach."],
    demonstrates:
      "Chaining data extraction, validation and AI into a pipeline that protects quality at each step.",
    stack: [
      { tool: "googlemaps", role: "Business source data" },
      { tool: "validation", role: "Email validation" },
      { tool: "crm", role: "Lead storage" },
      { tool: "llm", role: "Qualification and outreach drafts" },
    ],
  },
  {
    slug: "rag-knowledge-assistant",
    title: "RAG Knowledge Assistant",
    summary:
      "Answers questions from a specific knowledge base, shows where the answer came from, and falls back or escalates when it isn’t confident.",
    status: { label: "Proof of concept", tier: "prototype" },
    services: ["support", "internal-tools"],
    order: 9,
    opening:
      "Teams have the answers written down somewhere. Finding them is the problem, and a chatbot that confidently makes things up is worse than no chatbot.",
    before: [
      "Someone has a question",
      "They search docs, or ask whoever usually knows",
      "That person gets interrupted again and again",
    ],
    whyItMattered: [
      "Knowledge stuck in a few people’s heads.",
      "Generic AI answers can’t be trusted without sources.",
    ],
    concept:
      "Retrieve the relevant knowledge first, answer only from that, show the source, and if confidence is low, say so and escalate.",
    flow: [
      { id: "q", kind: "input", label: "Question", detail: "User asks a question." },
      { id: "ret", kind: "integration", label: "Retrieval", detail: "Relevant chunks are retrieved from the knowledge base.", tools: ["knowledgebase"] },
      { id: "kn", kind: "database", label: "Relevant knowledge", detail: "Only the retrieved knowledge is passed forward." },
      { id: "ans", kind: "ai", label: "Grounded answer + source", detail: "Answer is generated from that knowledge, with source context shown.", tools: ["llm"] },
      { id: "conf", kind: "decision", label: "Confidence check", detail: "If retrieval is weak, the assistant falls back instead of guessing." },
      { id: "esc", kind: "human", label: "Escalation", detail: "Unanswerable questions go to a person." },
    ],
    exceptions: [
      { id: "nothing", at: "ret", trigger: "Nothing relevant retrieved", response: "Assistant says it doesn’t know rather than inventing an answer.", owner: "system" },
      { id: "lowconf", at: "conf", trigger: "Low confidence", response: "Falls back and escalates to a person.", owner: "human", ownerLabel: "team member" },
    ],
    decisions: [
      { title: "Sources are part of the answer", body: "Showing source context lets people check the answer instead of just trusting it." },
      { title: "“I don’t know” is a valid output", body: "I built the fallback in on purpose. The assistant being honest about its limits is the whole point." },
    ],
    evidence: ["Proof of concept."],
    demonstrates: "Building AI that is grounded, checkable and knows when to step aside.",
    stack: [
      { tool: "llm", role: "Answer generation" },
      { tool: "knowledgebase", role: "Retrieval source" },
    ],
  },
  {
    slug: "ai-accounts-payable",
    title: "AI Accounts Payable Workflow",
    summary:
      "Invoices are read, matched against vendor and PO, routed for approval and prepared for payment. Mismatches stop and go to a person.",
    status: { label: "AI automation build", tier: "build" },
    services: ["backoffice"],
    order: 10,
    opening:
      "Accounts payable is reading invoices, typing them in, matching them to POs and chasing approvals. It’s careful work, and it’s exactly the kind of work that goes wrong when people are tired.",
    before: [
      "Invoice arrives by email or upload",
      "Details are typed in by hand",
      "Matched to vendor and PO by eye",
      "Approval chased over email",
      "Payment prepared manually",
    ],
    whyItMattered: [
      "Manual entry means typos in money.",
      "Approvals get stuck in inboxes.",
    ],
    concept:
      "Extract the invoice data, match it to the vendor and PO, route it to the right approver, prepare payment, and stop on anything that doesn’t match.",
    flow: [
      { id: "inv", kind: "input", label: "Invoice", detail: "Invoice comes in.", tools: ["docs"] },
      { id: "ext", kind: "ai", label: "Extraction", detail: "Key fields are pulled from the invoice.", tools: ["docs", "llm"] },
      { id: "match", kind: "decision", label: "Vendor / PO match", detail: "Invoice is matched against the vendor and purchase order." },
      { id: "appr", kind: "human", label: "Approval routing", detail: "Routed to the right approver." },
      { id: "pay", kind: "integration", label: "Payment preparation", detail: "Approved invoices are prepared for payment.", tools: ["workflow"] },
    ],
    exceptions: [
      { id: "mismatch", at: "match", trigger: "Amount or PO doesn’t match", response: "Invoice is stopped and sent for manual review. Nothing gets paid on a guess.", owner: "human", ownerLabel: "finance" },
      { id: "unreadable", at: "ext", trigger: "Invoice can’t be read reliably", response: "Flagged for manual entry instead of using shaky extracted data.", owner: "human", ownerLabel: "finance" },
      { id: "noapprover", at: "appr", trigger: "Approval not given", response: "Stays pending and visible; payment is never prepared without it.", owner: "human", ownerLabel: "approver" },
    ],
    decisions: [
      { title: "Stop on mismatch", body: "With money, a wrong automatic action is expensive. The system stops and hands over whenever something doesn’t line up." },
    ],
    evidence: ["AI automation build."],
    demonstrates: "Applying AI to document-heavy back-office work with strict guardrails.",
    stack: [
      { tool: "docs", role: "Document processing" },
      { tool: "llm", role: "Field extraction" },
      { tool: "workflow", role: "Routing and payment prep" },
    ],
  },
  {
    slug: "ai-customer-support-assistant",
    title: "AI Customer Support Assistant",
    summary:
      "Classifies incoming customer messages, answers from the knowledge base, escalates when needed and keeps the ticket updated.",
    status: { label: "Proof of concept", tier: "prototype" },
    services: ["support"],
    order: 11,
    opening:
      "Support teams answer the same questions every day while the hard tickets wait. The repetitive part can be handled, as long as the system knows its limits.",
    before: [
      "Every message lands in one queue",
      "Agents read and sort them manually",
      "Same answers typed repeatedly",
      "Ticket status updated by hand",
    ],
    whyItMattered: [
      "Urgent issues get buried under simple questions.",
      "Agents burn time on copy-paste.",
    ],
    concept:
      "Detect intent, retrieve the right knowledge, respond when it can, escalate when it can’t, update the ticket either way, and keep an eye on how it’s doing.",
    flow: [
      { id: "msg", kind: "input", label: "Customer message", detail: "Customer sends a message." },
      { id: "intent", kind: "ai", label: "Intent", detail: "Message is classified.", tools: ["llm"] },
      { id: "ret", kind: "integration", label: "Retrieval", detail: "Relevant knowledge is retrieved.", tools: ["knowledgebase"] },
      { id: "resp", kind: "ai", label: "Response", detail: "A grounded response is drafted.", tools: ["llm"] },
      { id: "res", kind: "decision", label: "Resolve or escalate", detail: "Resolved, or escalated to an agent." },
      { id: "ticket", kind: "database", label: "Ticket updated", detail: "Ticket reflects what happened.", tools: ["workflow"] },
      { id: "mon", kind: "monitoring", label: "Monitoring", detail: "Escalation and resolution patterns are tracked." },
    ],
    exceptions: [
      { id: "angry", at: "intent", trigger: "Complaint, urgent or sensitive message", response: "Goes straight to a human agent.", owner: "human", ownerLabel: "support agent" },
      { id: "noanswer", at: "ret", trigger: "No matching knowledge", response: "Escalates instead of improvising.", owner: "human", ownerLabel: "support agent" },
    ],
    decisions: [
      { title: "Monitoring is part of the build", body: "If you can’t see what it’s escalating and why, you can’t improve it. Monitoring is in the flow, not bolted on later." },
    ],
    evidence: ["Proof of concept."],
    demonstrates: "Designing support automation around escalation and visibility, not just answering.",
    stack: [
      { tool: "llm", role: "Intent and response" },
      { tool: "knowledgebase", role: "Answers source" },
      { tool: "workflow", role: "Ticket updates and routing" },
    ],
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
export const featuredProjects = sortedProjects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
