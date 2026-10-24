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
