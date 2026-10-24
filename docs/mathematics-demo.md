# Mathematics morning: observer demo

## Run locally

Open `widgets/mathematikvormittag/index.html` directly in a browser, or serve
that directory with a local HTTP server. Everything except the optional Lato
font is inline; the fallback font works offline. No build, AI credentials,
Hazu connection or persistent storage is required.

## Visitor experience

A guest observes Lea (Gymnasium year 2) and Joel (year 3), separately or together,
through five prepared scenes: orientation, a mathematics checkpoint, accompanied
self-study, adapting plans, and reflection. Visitors can jump between scenes,
inspect preparation answers and hear reasons for the next step. They do not
make decisions for the learners. Replay/reset is available.

Both completed teacher-provided videos and questions before the scene. School
BSZ time is the default preparation opportunity; home preparation is optional.
No actual instructional video is included. Preparation is not treated as proof
of understanding. The mathematics teacher is available during this example.

Lea initially organises her work independently but needs to explain changing
percentage bases. Joel has completed preparation and needs help connecting a
correct table to a term. These are fictional, task-specific situations, not
permanent ability labels. Both retain choice over next steps.

## Mathematics and evidence

- Lea: percentage changes, 100 -> 120 -> 96, with different bases for the two
  20% changes. Her next transfer task remains open.
- Joel: K(x) = 30 + 8x, matching (1,38) and (2,46). The initial 30x + 8 is
  explicitly a fictional learner error, exposed by checking x=2. After coaching
  he forms K(x)=12+5x for a new example. Comparing offers is still a next step.
- Formative feedback records limited evidence, not grades or a diagnosis.
  Summative assessment follows later under the unchanged grading regulations.
- The percentage bars share a scale. The cost graph illustrates a linear
  relationship; actual order quantities are integers.

Curriculum references researched on 24 October 2026:
- Year 2, ratios/percentages (printed page 70):
  https://kssursee.lu.ch/-/media/KSSursee/Dokumente/Dokumente/Lehrplaene_UG_neu/UG_Lehrplan_Mathematik.pdf?rev=b00c1f1397224cdf8c24d6b6eabdd807
- Year 3, linear functions (section “Grobziele 3. Klasse”):
  https://kssursee.lu.ch/-/media/KSSursee/Dokumente/Dokumente/Lehrplaene_neu_LZG_und_KZG_2122/KSSUR_Lehrplan_Mathematik_GF_LZG_KZG_2021.pdf?rev=5bea964ca21b435ba4e793b12f5b612a

These inform a fictional school; this is not a representation of the source
school. Lesson sequence, precise attainment and support are scenario assumptions.

## Hazu integration

This is a single-file widget suitable for the Lernatelier. Following the widget
workflow, upload the HTML and create a station tagged `hz-world-sim` in the
Schulhaus/Lernatelier. Gabriel handles platform wiring. The local build does
not modify the live world, level generators, existing NPCs or Genius prompts.
No bridge is needed because visitor state is intentionally temporary.

## Test and scope

Browser verification: all 15 scene/perspective combinations, preparation and
reason dialogs, daily overview, reset, replay, disabled previous button at the
start, desktop and narrow mobile layout, and no JavaScript exceptions.

The station demonstrates prepared narratives. It does not simulate autonomous
learning, infer motivation, measure model effectiveness, implement booking or
save visitor progress. No learner or visitor data is collected.

For user testing, ask visitors to explain binding goals, freedoms, differences
in support, and remaining uncertainty before asking for their opinion.

## Verified UI deployment (24 October 2026)

The mathematics demo is uploaded and running as a Hazu widget:
https://hazu.app/HIx4jrkOAhhawUaTpPN4/TRAIMeIVPNXq5wfkfTG2/_m0-qRVAAUwmuxfswuPp/LTjw1DYvatdQehCf0OGG

Station ID: `LTjw1DYvatdQehCf0OGG`; attachment point: `vDd_JyfAf6oNiQIV0lSm`.
The station is private, tagged `hz-world-sim`, and defaults to Widget view.
Display: entire content area. Hazu bridge is off because this demo needs no
platform data access. Perspective switching and scene navigation were verified
inside Hazu. A particular 3D character/board entry point is not yet verified.

Verified upload procedure for an administrator/editor:
1. Create a separate child Hazu in the Schulhaus list, save and open it.
2. Create and save a point to hold the HTML attachment.
3. Edit that saved point, focus its description and choose the toolbar's File
   control. The attachment controls were disabled in an unsaved new point.
4. Select `widgets/mathematikvormittag/index.html`, wait for upload and save.
5. Copy the resulting managed-file link from the attachment.
6. Open view menu > Additional views > Widget > view settings. Paste the file
   URL, set an accessible display name and choose the desired content area.
7. For this standalone station, switch off Hazu bridge. Set Widget as default
   using the star in the view menu and open Widget view.
8. Apply `hz-world-sim` in the child Hazu's Tags. Check visibility explicitly:
   newly created content initially showed Public; this station was set Private
   to match the existing school stations.
9. Test the loaded widget. Do not copy generated `cap` query parameters into
   documentation or source; Hazu provides file access within its own view.

This supersedes the earlier note that upload/live wiring was pending for the
standalone widget. World-level NPC/board integration is a separate step.

## Expanded observer experience (24 October 2026)

The local widget now follows a six-scene morning: personal plans, mathematics
checkpoint, accompanied learning, obstacles in personal projects, coaching,
and closing reflection. This implements the owner-approved extension discussed
on 24 October; the particular dialogue and outcomes are authored scenario choices.

Lea develops a voting game. Visitors can add fictional votes and expose a tie
in the initial rules, then inspect her revised run-off rule. Joel compares two
fictional interview excerpts and replaces an unsupported generalisation with
an introduction that preserves uncertainty. Text excerpts are shown; no audio
recordings are included. Teacher-perspective dialogs explain the evidence,
limited support capacity and remaining uncertainty in each scene.

The visitor still observes the figures' decisions. The vote experiment is
temporary and does not branch or alter their story. No real learner data,
assessment backend, Moodle, OCR or autonomous simulation has been added.
Existing age assumptions and mathematics curriculum references still apply.
Personal-project assessment criteria are illustrative, not a new curriculum.

Local browser QA with installed Chrome/Playwright covered all 18 scene/view
combinations, work/preparation/reason/teacher dialogs, initial and revised tie
handling, vote clearing, replay/reset, daily overview, and a 390px viewport
without document overflow or JavaScript errors. Desktop and mobile screenshots
are in output/demo-review/. Wording and scene continuity were reviewed.

Deployment status: these changes are local. The earlier verified Hazu upload
contains the previous widget until an updated HTML attachment is uploaded.
The six-scene version has not been verified inside Hazu.

Suggested jury route: show the village briefly, open Lea's initial plan, show
the mathematics evidence, try a tied vote, then show coaching and the closing
reflection. Switch to Joel or the teacher perspective for follow-up questions.
Keep Moodle/local OCR as future work, and distinguish the existing Hazu engine
from the world, authored scenes and widgets built during the hackathon.

## Connector deployment update (24 October 2026)

The six-scene local HTML was uploaded to the existing managed document through
the authenticated Hazu connector after reading it from disk via the terminal.
Revision 2 is committed on doc_e8a88c0ac8c84787844eae172288ef05.
The station's existing stable URL remains unchanged. Read-back confirms the
project-scene source and SHA-256 identical to the local file:
b28c7b394e4cdd27ffae707eafddc550e2d359dbf9be3b8707e697391c0fc209.
This supersedes the local-only deployment note above. The uploaded revision
has not received a new in-Hazu browser interaction test.
