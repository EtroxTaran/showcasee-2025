# KOMPASS CRM & Tour Planning – Product Vision

## Overview and Goals

KOMPASS is a **CRM, project management, and tour planning application** designed for B2B sales and
project teams. The product seamlessly combines **customer management** , **sales pipeline tracking** , **project
oversight** , and **multi-day route planning** into a **single unified Next.js 14 application**. The goal is to empower
field employees (e.g. sales representatives, project managers) to **efficiently plan customer visits, manage
projects, and track business metrics** – all within one integrated system. Key objectives include: a **mobile-
first** user experience for planning customer tours on an interactive map, a unified view of all customer data
and project status, and clear overviews of schedules, distances, and costs for planned routes. At the end
of a planning session, the user should have a comprehensive route itinerary with timings, distances, and
expenses, and be able to export appointments directly to their calendar. By providing robust core
features in an MVP-focused approach, KOMPASS aims to deliver immediate value while laying a foundation
for future expansion.

## User Roles and Personas

The application supports **role-based access control (RBAC)** with five key user roles , each addressing
different needs in a mid-sized enterprise:

```
Geschäftsführer (GF) – Managing Director/CEO : Needs high-level insight into sales pipeline, project
progress, and financial metrics. The GF uses KOMPASS for dashboards and reports to make strategic
decisions.
Planer (PLAN) – Planner/Scheduler : Focuses on customer visit planning and scheduling. This user
plans multi-stop tours, assigns sales reps to visits, and ensures efficient routing.
Administrator (ADM) – System Admin/CRM Admin : Manages master data (customers, users, etc.),
configures the system, and oversees data quality. Ensures the application runs smoothly and data is
up-to-date.
Kalkulator (KALK) – Estimator/Sales Engineer : Prepares offers and cost calculations. This role
manages opportunities (quotes) in the sales pipeline and updates project budgets and probabilities.
Buchhalter (BUCH) – Accountant : Tracks financial records such as travel expenses and ensures
compliance. This user audits expense entries and exports data for accounting (GoBD compliance).
```
Each role sees a tailored interface and set of features relevant to their function. For example, **planners**
focus on the Tour Planning module, **KALK** users manage opportunities and quotes, while **accountants**
access expense reports. All content is presented in **German** to support the target user base , and
features are permission-gated so that each role only accesses appropriate modules.


#### 3 • • • • • 4


## Features and Modules

### Customer & Contact Management (CRM)

The **Kundenverwaltung** module provides a 360° view of each customer. Users can import or input
customer records with details such as name, address, contact person, and geolocation (latitude/longitude)

. Each customer entry can include extended information like phone, email, website, and an assigned
category (e.g. A, B, C, or prospect) to indicate priority tier. The system tracks the last contact date and
next planned visit for each customer to support proactive outreach. Users can record interaction logs
( **protocol entries** ) for visits, calls, emails, or notes – capturing summaries and outcomes of each
interaction. Follow-up actions can be attached to a customer (e.g. _send quote_ , _schedule demo_ , _follow-up call_ )
along with due dates, so that pending tasks are clearly visible. The CRM module thus ensures that
sales teams maintain a history of customer communications and never miss the next follow-up.

To aid customer prioritization, KOMPASS computes an **urgency level** per customer (e.g. _overdue_ , _due_soon_ )
based on the next visit due date. New leads or prospects can be flagged, and responsibility for each
customer can be assigned to a specific user (sales rep). This provides clarity on who is handling which
account. The customer data is the foundation for other modules: it feeds into **map views, tour planning,
and opportunity management**.

### Sales Pipeline & Opportunity Management

KOMPASS includes features to manage the **sales pipeline** from initial lead to signed contract. Opportunities
are tracked as part of the project funnel with defined **commercial stages** : for example, _opportunity_ (new
lead), _offered_ (quotation sent), _signed_ (deal won), or _in_progress_. Each prospective project
(opportunity) is associated with a customer and captures key data: an expected revenue value, the
probability of winning the deal, the date an offer was sent, and the date a contract was signed if closed.
By modeling opportunities in this way, the system can calculate pipeline metrics such as total pipeline value,
weighted value, number of deals in each stage, etc., for use in management dashboards.

When an opportunity is won (stage moves to _signed_ ), it seamlessly transitions into an active project in the
**Project Management** module (no data re-entry needed). This integration ensures continuity from sales to
execution. The **KALK** role primarily uses this module – creating new opportunity entries, generating
quotations (outside the system or via attached documents), and updating the pipeline. KOMPASS follows
best practices by using a **single source of truth** for opportunity data, avoiding duplicate records. Sales
stage transitions can trigger notifications or required actions (e.g. informing finance or initiating a project
kickoff).

### Project Management & Execution

The **Projektübersicht** module helps teams plan and monitor project execution once a deal is signed. Each
**Project** in the system has attributes such as project name, description, associated customer, start and end
dates, and current status (e.g. _planning_ , _in_progress_ , _on_hold_ , _completed_ , _cancelled_ ). Projects can be
assigned a priority level (low to critical) and an owner (responsible team member). The module tracks
live progress as a percentage and allows tagging for categorization (to group projects by type, region, etc.)

. Budget tracking is built-in: each project can record an approved budget and compare it to the expected
contract value to compute margins, which helps KALK and GF roles oversee financial performance.


To break down work, projects support **milestones** – key deliverables or phases with due dates and
completion status. Team members can update milestone completion, which in turn can roll up into the
overall project progress. Although detailed task management is outside the initial MVP scope, milestones
provide lightweight project scheduling. The project data model is also designed to feed into analytics; for
example, the system can generate reports on revenue by customer (aggregating the expected or actual
values of projects per client).

Integration with the CRM ensures users can navigate from a customer record to all projects for that client
(the Customer profile lists linked projects ). Likewise, from a project one can view the customer’s info and
any related sales opportunity details. This provides context for project managers and sales teams to
collaborate. The **ADM** and **GF** roles use the project overview for tracking overall portfolio health, while
project managers update statuses and milestones. All project and opportunity updates are timestamped for
audit trail purposes (the system stores creation and last update times for records).

### Tour Planning & Field Visit Scheduling

One of the standout features of KOMPASS is its **Tour Planning** module ( **Tourenplanung** ), which allows
planners and sales reps to schedule field visits in an interactive map interface. Upon launching this module,
the user sees a **map with all customer locations plotted as markers** , along with their own current
location. To avoid clutter, the UI employs marker clustering – densely overlapping customer pins
automatically group into clusters with a count, which split apart as the user zooms in. This
geovisualization ensures that a salesperson can easily grasp which clients are nearby or in a certain region
without being overwhelmed.

Clicking on a customer’s pin opens a rich **info popup** showing the key details from our CRM (name, address,
contact person, etc.) and, leveraging the Google Places API, additional public information about that
location if available (such as photos, website, phone number, ratings, opening hours). This context helps
the salesperson prepare for the visit with a quick glance. Within the info popup, two primary actions are
offered: **“Start Navigation”** (opens Google Maps or a navigation app for turn-by-turn directions from the
user’s current location to the customer) and **“Add to Tour”**. The navigation shortcut uses deep links
(Google Maps URL schemes or intents on mobile) so the user can immediately start traveling to the selected
client if needed.

When the user chooses “Add to Tour”, the system enters a **tour planning mode**. The selected customer
becomes the first stop on a new route, starting from the user’s current location (or a chosen start point). A
sidebar (or bottom panel on mobile) appears showing the developing list of tour stops with the start and
first destination already added. The user can then continue adding stops: they return to the map, click
another customer, and select “Add as next stop”. Each new stop is appended to the route in the order added

. The system supports both manual ordering and **automatic tour optimization**. A **“Tour optimieren”** button
allows the user to reorder stops to minimize total driving distance and time using a simple nearest-neighbor algorithm.
This logic respects **day boundaries** (preserving manually inserted hotel stays) and simply optimizes the visit sequence
within each day. It provides a quick way to ensure an efficient route without complex AI constraints.
Drag-and-drop reordering is also supported for manual fine-tuning.

For each stop added, the user can set an expected **meeting duration** (e.g. 30 minutes, 1 hour) from preset
options. This allows the system to build a **timeline** of the tour. As stops are added, KOMPASS
automatically queries the Google Directions and Distance Matrix APIs to calculate travel time and distance


from the previous stop to the new one. It then updates the tour timeline: for example, if the user
plans to start at 8:00 AM, the app will show “8:30 Arrival at Customer A (30 km), meeting until 9:30; 10:
Arrival at Customer B (20 km), ...” and so on. This live itinerary gives the user instant feedback if the
schedule is too tight or if there’s slack time between meetings. The total drive distance and time for the day
are also summed up as more stops are added (the TourDay object tracks total driving seconds and distance)
.

**Multi-day tours** are supported for cases when a single day is not sufficient to visit all desired stops. The
planner can insert an **overnight stop (Hotel)** at any point, which effectively ends the current day’s route
and starts a new one for the next day. When the user chooses to add an overnight stay, the app will use
the Google Places Nearby Search to suggest hotels near the last stop of the day (within a defined radius and
below a price threshold). The planner can pick a hotel from these suggestions, which gets added as a
special stop of type "hotel". Internally, the system then splits the tour into multiple **TourDay** entries: e.g.
all stops up to the hotel are in Day 1, and subsequent stops automatically continue in Day 2. The UI will
indicate this by labeling the segments (Day 1, Day 2, etc.) in the stop list. If multiple overnights are added,
Day 3, Day 4, etc. are created accordingly. This approach keeps multi-day itineraries well-organized for
the user. Each TourDay carries its own distance, drive time, and schedule, while the overall Tour ties
together the sequence of days.

Throughout the planning process, the user can switch between the map view and the route sidebar,
ensuring they have both geographic and chronological perspectives. Key tour metrics are updated in real-
time, including per-day distance/time and aggregate figures. The app also tracks the **status** of a tour (draft
vs finalized vs completed). A _draft_ tour is one being planned (not yet saved to the backend), a _planned_
tour is saved/finalized, _in_progress_ could indicate an ongoing tour, and _completed_ once all visits are done

. This status helps differentiate between templates/drafts and actual executed tours.

After building a tour, the user can **save** it (persisting it to the database via Supabase) and then take further
actions: for instance, mark a tour as “completed” after execution, or view a history of past tours. The system
can maintain a log of completed tours for reference (e.g. to see which customers were visited when – useful
for sales management). There is also an option to **export the tour itinerary to the calendar** : KOMPASS
generates an industry-standard **iCalendar (.ics)** file containing each stop as a calendar event (with time,
address, and meeting info) and perhaps all-day events to block the travel days. The user can download
and open this file on their device, and it will integrate with any calendar app (Outlook, Google Calendar, etc.)
to populate the schedule. This approach, leveraging the open iCalendar format, is a best practice to give
users flexibility in managing their schedule without building a proprietary calendar sync.

Another powerful feature is the **“cold acquisition” search** for new prospects. Beyond the existing
customers loaded in the CRM, the planner can search the map for potential new customer locations (for
example, searching for businesses of a certain type in the area). Using Google Places, the app can display
nearby points of interest that are not yet in the customer database. This allows sales reps to identify
new leads (e.g. if a sales rep is visiting a city, they can find additional stores or clients of the target category
nearby to drop in on). New finds can be added as “prospect” stops on the tour and optionally imported into
the customer database if needed. This feature extends the tour planning module into a lead generation
tool, increasing the value of each trip.

Finally, the Tour Planning module integrates with **expense tracking**. Users (or the accountant role later) can
log expenses incurred during a tour, such as fuel costs, parking fees, meals, or lodging. The tour data model



includes an **Expense** entity with categories like Fuel ( _Benzin_ ), Parking, Meals ( _Essen & Trinken_ ), Hotel, and
Other. For each tour expense, the amount, date, category, and description are recorded, and even a
photo of the receipt can be attached (stored as a blob image). These expenses are linked to the specific
tour and user, enabling easy reimbursement and accounting. Because KOMPASS is designed for **GoBD
compliance** (German financial record-keeping standards), it preserves all expense records and associated
receipt images in a tamper-evident way. Accountants can later review an expense report per tour or per
period, ensuring that all travel costs are accounted for and archived properly.

### Reporting & Dashboards

To support data-driven management, KOMPASS provides a **dashboards module** with analytics for different
roles. For the **GF (executive)** , the dashboard offers a high-level overview of the business: sales pipeline
summaries (total and weighted pipeline value, number of opportunities in each stage, revenue from signed
deals) , as well as project delivery metrics (e.g. how many projects are on track vs delayed, overall
completion percentages, etc.). A **funnel chart** can visualize the conversion from opportunities to offers to
signed projects, using the aggregated funnel stage data computed from the system. For the **sales team
(Planer/KALK)** , the dashboard might highlight upcoming customer visits (scheduled tours), recent
customer additions, and activities completed vs pending (e.g. number of follow-up actions open). The
**accounting (BUCH)** dashboard would focus on financial metrics – for instance, total expenses by category
in a time period, or top cost-driving tours, as well as ensuring all required records are present (for
compliance).

Each role-specific dashboard is designed to present the **key performance indicators (KPIs)** relevant to that
function in a clear, visual manner. Graphs and data grids are used to summarize information. For example, a
_Revenue by Customer_ report can list top customers by total signed project value , helping identify the
most valuable clients. The dashboards are interactive where possible – e.g., clicking on a metric can drill
down to the underlying data (clicking “5 opportunities in Offered stage” could navigate to the list of those
opportunity records). The inclusion of role-based dashboards means each user has a customized homepage
in the app, aligning with their priorities and helping them make informed decisions quickly.

## UI/UX Design and Consistency

The product’s user interface follows a **consistent design system** to ensure a clean, professional, and
accessible experience. We leverage the **Kompass UI Musterbibliothek** (UI pattern library) as the single
source of truth for all components and styles. All UI components (forms, buttons, dialogs, tables, etc.)
are implemented using the standardized libraries **shadcn/UI** and **Radix UI** , which provide accessible and
themeable components out-of-the-box. This ensures that common elements like buttons, inputs,
modals, etc. behave uniformly across the app and adhere to best practices in usability.

The design system is built with **accessibility and responsiveness** in mind. We strictly observe **WCAG 2.1 AA**
guidelines for contrast and interaction, ensuring the app can be used by people with disabilities without
barriers. The layout is **mobile-first** and fully responsive, as the field sales use case demands excellent
functionality on smartphones and tablets. In fact, the application is designed as a **Progressive Web App**
that can be installed on mobile devices and even used offline. Following an offline-first approach, critical
data (like loaded customer info or a draft tour) is cached on the device so that users in the field with low
connectivity can still view and interact with their plans. Any data input while offline (e.g. notes from
a customer visit) will sync to the cloud once connectivity is restored. This PWA capability, combined with



careful performance optimizations, gives a near-native app experience with fast load times and fluid
interaction.

The UI is in **German** language for all labels, prompts, and messages , matching the end-users’ needs. All
formats (dates, numbers, currencies) default to locale-specific formats (e.g. European date formats, Euro
currency). We also abide by **GoBD guidelines** in the UI by not allowing destructive edits of financial data
without trace (e.g. expenses cannot be deleted without proper record; instead, they might be marked as
corrected). Small usability touches are included: for example, on first use, contextual tooltips or hints guide
the user (e.g. “Tippe auf einen Pin, um Details und Aktionen zu sehen” – “Tap on a pin to see details and
actions”) , helping users discover features intuitively. The interface uses a mix of iconography (via lucide-
react icons) and text to make actions clear – for instance, an “Add Stop” button uses a + icon for quick
recognition.

By adhering to the **canonical UI reference** in the design library, we ensure that any developer working on
the project can easily follow the established patterns. The UI documentation in the repository breaks down
components by category (foundations, core components, form screens, etc.), so we maintain consistency as
new screens are added. This approach prevents ad-hoc design decisions and keeps the user
experience cohesive across modules. It’s a best practice that significantly reduces UI bugs and improves
maintainability. In summary, KOMPASS’s UX is **intuitive, consistent, and enterprise-ready** , reflecting the
professionalism of the tool and making adoption easier for users who can trust that every part of the app
will behave in a familiar way.

## Technical Architecture and Best Practices

Under the hood, KOMPASS is built as a **unified Next.js 14 application** using the **App Router** architecture.
Instead of separate micro-frontends, the codebase is structured with **modular feature folders** (e.g., `app/crm`,
`app/planning`, `app/projects`) that serve as distinct domains within the monolithic application. This ensures
clear module boundaries while enabling a **shared layout, global authentication state (via Supabase), and
common UI system** (using shadcn/ui and Tailwind CSS).

The application is hosted on **Vercel**, leveraging its edge network for fast global access and simplified
deployment. The architecture supports **PWA capabilities** for offline use, essential for field sales.
Shared logic and types are co-located or placed in a shared `lib` folder to ensure consistency across modules.

The front-end is built with **TypeScript and React 18** , using Vite for bundling for fast development and
performance. **Tailwind CSS** is used for styling, and our custom design tokens (colors, spacing, etc.) are
configured in a shared Tailwind config to enforce consistency. We adopted the **shadcn/UI** component
system (which is based on Radix UI and Tailwind) to accelerate UI development with pre-built accessible
components. State management relies on a combination of React Context and React Query for data
fetching and caching. For example, when a module needs to load customers or tours from the backend,
React Query caches the results so that the UI can work seamlessly offline and avoid redundant requests.

**Supabase** is used as the backend-as-a-service, providing a Postgres database, authentication, and cloud
functions. This choice allows the team to avoid building a custom backend from scratch and instead
leverage Supabase’s realtime APIs and robust storage for files (e.g. storing receipt images in Supabase
storage buckets). All data operations (CRUD) are done through the Supabase client libraries or via secure


RPC calls. For instance, when a tour is saved or updated, the app calls a Supabase function which writes to
the database. Supabase also manages user auth and row-level security for enforcing the RBAC – ensuring,
for example, that a Planner cannot access admin-only data. Using a cloud BaaS like Supabase means
quicker development and scaling without devOps overhead, which is ideal for an MVP product.

Integration with external services is a core strength of KOMPASS. We harness the **Google Maps Platform**
extensively: the **Maps JavaScript API** renders the interactive map and markers; the **Places API** is used for
finding hotels and enriching customer info with place details; the **Directions API** provides route polyline
and travel time between stops; and the **Distance Matrix API** can batch compute distances between
multiple points for efficiency. By relying on Google's infrastructure for mapping, we ensure high
accuracy and familiarity (users can trust the travel times and use Street View or other Google map features
if needed). Additionally, as described, we use the **iCalendar (.ics)** standard for calendar export , rather
than attempting to sync with specific calendar APIs directly – this open-standard approach maximizes
compatibility and demonstrates technical **best practice in interoperability**.

The application is optimized for deployment on **Vercel**, which handles building and serving the Next.js
application functionality. This serverless/edge-first approach simplifies operations compared to traditional
container-based setups. While Docker can still be used for local development or custom hosting if needed,
the primary deployment target is Vercel to take advantage of its integrated CI/CD and performance features.

Throughout development, we enforce **best practices** in code quality and project management. The
monorepo structure, combined with consistent coding standards (aided by the shared linting and the
pattern library), ensures a uniform codebase even as multiple developers collaborate. The documentation
(like this product vision and accompanying architecture docs) is kept alongside the code in the docs/
directory , so it stays versioned and up-to-date. Each feature is developed as an **Epic** with clear user
stories (e.g. “Planner creates a multi-day tour with hotels”), and we track progress using the checklists and
issues in our repository. We also write unit tests for critical utilities (like date and currency formatters, or
distance calculation logic) and conduct integration tests for key workflows (such as creating a tour and
exporting it). Accessibility testing is part of our definition of done for UI components (e.g. using tools to
verify WCAG compliance).

Finally, data security and compliance are taken seriously: all sensitive data is stored in the database with
proper access controls, and we ensure that **financial data is audit-proof** (aligning with GoBD) by never
truly deleting records that impact finances – instead, records are marked or archived to maintain an audit
trail. Users are authenticated and sessions are managed via secure HTTP-only cookies (Supabase Auth),
shared across modules so that a user logs in once and can navigate the different parts of the system
seamlessly. The cross-app navigation is enabled by a shared session cookie and a common
navigation header across all modules, which includes links to switch tools, the current user’s name, and a
logout option.

In summary, the architecture of KOMPASS is **modular, robust, and modern** – ensuring that the product is
not only feature-rich but also maintainable and scalable. By using proven frameworks and services, we


reduce risk and concentrate on delivering business value. The combination of a well-defined domain model,
a consistent UI system, and a scalable tech foundation sets the stage for a successful implementation.

## Conclusion

With this comprehensive vision, KOMPASS is positioned to be a **complete solution for customer
relationship management, project oversight, and route planning** in one platform. We have defined
clear epics and features – from managing customer data and sales pipelines to planning multi-day tours
with integrated maps and expense tracking – all guided by best practices in UX, architecture, and
compliance. The domain model has been optimized to cover all core entities (Customers, Projects, Tours,
etc.) and their relationships, ensuring a single source of truth for the business. All critical decisions
regarding technology (use of Supabase, Google APIs, design libraries, PWA) have been made deliberately to
maximize user satisfaction and minimize implementation time.

This product vision will guide the team through implementation, with well-defined modules and workflows
that align with our goals. By following this plan, the development team can iterate confidently, knowing that
each component fits into the larger picture. **KOMPASS** will enable our organization to streamline operations

- sales reps spend less time on logistics and more time with clients, project managers stay on top of
deliverables, and executives gain insights at their fingertips. In the end, KOMPASS isn’t just an app, but a
digital companion for our team’s journey towards efficiency and growth, built on a solid foundation from
the very start.

README.md
https://github.com/EtroxTaran/kompass-antigravity/blob/849e889469d0faa3e9ec7bd3a01b35aeb0fd2382/ui-ux/README.md