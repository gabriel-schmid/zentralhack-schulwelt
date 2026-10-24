# Progress

Tick off each milestone and add the time. This is also our evidence for the
jury.

## Friday, 23 October

- [x] Team found, idea agreed
- [x] Repo and Hazu structure set up (23:20)
- [x] First walkable version of the village (auto-generated, 23:30)
- [x] Designed Bergdorf level live: square with forum, workshop hall, five houses with doors, 8 NPCs incl. Genius coach (23:50, checked in the app)
- [x] Personas for all places (Luca's personas, 02:25; see Saturday)

- [x] Checked dialogue and doors: level works; in the app, use fullscreen and X/Enter; Werkstatt door opens (00:15)

- [x] Werkstatt interior live: workshop hall, coop under construction, timber store, Herr Bühler with two safety questions, Lea and Jonas; exit «↩ Zum Dorfplatz» returns in the same tab, checked in the app (00:40)

- [x] Sägestation widget built and tested locally (gear, hazards, safe order, result saved as an item); wired into the Werkstatt as a station (01:00)
- [x] Engine «indoor mode» assessed: local demo feasible, live delivery not before the end (docs/engine-indoor-mode.md) (01:00)

- [x] Schulhaus live: the class meets indoors; Aula, Lernatelier, Coaching-Raum, Workshop-Raum and Pausenzone as dollhouse rooms (landmark documents in the level), checked locally (01:30)
- [x] Village rebuilt around the Schulhaus; forum and outdoor workshop hall removed (01:30)
- [x] Engine indoor mode built as a local slice on branch `world/indoor-mode` (flat room, auto walls with cutaway, no sky/island); tests 786/788, demo runs locally (02:00)
- [x] Quiz answers mixed (correct option no longer always first) (02:15)
- [x] Welcoming Schulhaus facade (wings, timber entrance hall with glass front, canopy, flower boxes, Swiss flag) and school-like interior (floors, windows, door frames, lockers, boards, curtains, exit door); checked locally and in the app via Playwriter (02:40)

- [x] Schulhaus with a real corridor and rooms (Bibliothek, Aula, Interessen-Atelier, corridor, Lernatelier, Coaching-Raum, Pausenzone, Workshop-Raum, entrance hall); live as revision 3 and checked in the app via Playwriter. Room tile ranges for NPCs in `skills/npc/SKILL.md` (02:26)
- [x] Indoor mode checked locally via Playwriter (no sky or island, walls hide toward the camera, sky returns outdoors); the same Schulhaus file switches to the indoor look once the engine PR is released (02:26)
- [x] Indoor mode PR opened: HazuInc/HazuApp#7183 (not live without an app release and Andy's approval; see Saturday)
- [ ] ~~Optional: Obergeschoss as its own level~~ dropped: the morning route fits on one floor

- [x] Luca's personas in the Schulhaus (Frau Arnold, Lea, Tobi, Quirin, Yara, Matilda, Herr Tesla) and Herr Meinhard as Genius coach: the visitor speaks as themselves; live as revision 4, checked in the app (03:27)
- [x] Station «Säuren und Basen» (`widgets/saeuren-basen/`) with Herr Tesla: safety gear, hypothesis, red-cabbage indicator, pH scale; live and linked to him (03:27)
- [x] Station «Konflikt in der Projektgruppe» (`widgets/konflikt/`): decide for Joel in a group conflict, scripted branches, 8 endings; live and linked to Herr Meinhard (03:27)
- [x] Stations are linked to characters with the tag `hw-npc-<id>` (also the Sägestation); unused place Hazus moved to «Reserve», so the world shows no stray signboards (03:27)
- [x] Indoor PR HazuInc/HazuApp#7183: second review fixed (XR sky state, weather indoors, AR table) and a ceiling in first person (03:27)

- [x] Schulhaus walls: colliders every 0.4 m (radius 0.2), so the body no longer walks halfway into walls; all doorways still passable (checked locally) (03:36)

## Saturday, 24 October

Times are Europe/Zurich and match the commits in this repo.

Night (concept, Luca):

- [x] Shared concept baseline documented; freedom during the learning path and unchanged grading regulations clarified (00:42)
- [x] Six learner and two coach personas, age-appropriate independent projects, given traits separated from draft scenarios (02:25)
- [x] Luca's «Ein Mathematikvormittag» (Lea and Joel: learning goal, own route, formative feedback) built on branch `codex/mathe` (03:48), expanded to six scenes with projects and coaching (08:49); local German narration trial with Piper TTS

Morning (world and stations):

- [x] Bridge fix: stations never saved on hazu.app (the SDK declares `HazuAPI` as a global const, the template checked `window.HazuAPI`); fixed in all widgets and the template, checked live: lab and conflict scene save their result items (07:45)
- [x] Concept focus: village slimmed to the arrival (Schulhaus + Joel as greeter); Werkstatt, Küche, Garten and the Sägestation moved to «Reserve»; Toni, Jana, Rossi removed (07:57)
- [x] «Säuren und Basen» rebuilt as an open Säure-Base-Labor: mix freely, red-cabbage colour, measure pH, neutralise, three challenges; live with Herr Tesla (07:57)
- [x] Morning route ⓪–⑦ through the Schulhaus, built on Luca's concept; signs above the doors carry the route numbers (09:38)
- [x] Real furniture in the Schulhaus rooms (desks, chairs, sofas, bookcases, boards) (09:38)
- [x] Tagesplan station live at Yara in the entrance hall: fixed points, free blocks, «Sicht Coach», «Im Haus»; the plan is saved through the bridge (09:38)
- [x] Privacy fix: visitor results (Tagesplan, lab, conflict) are saved as private items, not visible to other visitors (09:44)
- [x] Places, route and Tagesplan rooms in the docs match the new placements (09:47)
- [x] All characters turned into guided conversations with one quiz question each, together covering the concept map ([concept-coverage.md](concept-coverage.md)) (09:50)
- [x] Small Bergdorf with chalets around the square (09:55)
- [x] README for the jury (problem, target group, route, before vs new) and full AI and open-source disclosure in [tools.md](tools.md) (10:09)
- [x] Lab safety rules cite chemsuisse (school guide 2019) and Suva (eye protection) ([safety.md](safety.md)) (10:11)
- [x] Real lockers in the corridor, furniture silhouettes, neutral conversation replies (10:12)
- [x] Suva-relevant lines woven into the route: Frau Arnold on learning from near misses, Herr Tesla on choosing safety gear yourself (11:34)
- [x] Deployment manifest: every live Hazu revision traced to a repo file by checksum, plus the conversion scripts ([deployment.md](deployment.md)) (11:39)
- [x] Säure-Base-Labor: shuffled safety gear, icons instead of emojis, back button, realistic mixing (11:55)
- [x] Workshop-Raum lab equipment (bench, fume hood, safety corner, periodic table, solar panel) (12:08)
- [x] Herr Tesla's walk-to spot and the three station posts placed inside the rooms (12:43)
- [x] Paper notes from Friday evening and «What came from us, what came from AI» in the README; personas matched to the paper notes (12:43)
- [x] Animated pitch deck as a Hazu presentation (12:53); reworked to the scene-framed pitch (14:02)
- [x] World open without an account: anyone with the link can walk it (13:16)
- [x] Tobi's conversation rewritten around his own project; learner traits as subtitles (13:19)
- [x] Final demo video, 48 s with music (14:03)
- [x] Konflikt station: initials centred in the cast circles (14:08)
- [x] Luca's Mathematikvormittag archived in «Reserve» as a widget; its content (Lea and Joel, Frau Sutter's Mathe-Fixpunkt, Quirin) now lives in the route's Lernatelier characters (09:38)

Engine (outside this repo):

- [x] Indoor mode PR [HazuInc/HazuApp#7183](https://github.com/HazuInc/HazuApp/pull/7183) with review fixes (XR sky state, weather indoors, AR table), ceiling in first person, shadows, sliding along walls instead of stopping
- [x] Indoor mode reviewed and merged by Hazu's CTO (10:12); live on hazu.app with the 12:29 engine build; the Schulhaus runs in it

Still open:

- [ ] Herr Meinhard (AI) tested in the world with the pitch question
- [x] Backup video recorded: `output/demo-final.mp4` (14:03)
- [ ] Pitch rehearsed and timed (draft in [pitch.md](pitch.md))
- [ ] Optional: two or three other participants walk through the world; note their feedback

## Friday's plan for the night (closed)

| # | Task | Who | Outcome |
| - | ---- | --- | ------- |
| 1 | Invite partner: GitHub repo and editor rights on the Hazu | Gabriel | done |
| 2 | Design the village exterior | Gabriel | done (`level/bergdorf.json`), later slimmed and rebuilt as the small Bergdorf |
| 3 | NPC prompt template plus teacher and coach personas | Luca | done as personas ([personas.md](personas.md)) and the NPC guide |
| 4 | Interiors: Werkstatt, Coaching-Raum, Lernatelier | Gabriel | done inside the Schulhaus; Werkstatt now in Reserve |
| 5 | Dashboard station with briefing and progress path | Luca | replaced by the Tagesplan station; a timeline with milestones is a next step |
| 6 | Coach as a Genius configuration, prompt in `coach/` | Gabriel | done (Herr Meinhard) |
| 7 | Commit, update this file, sleep a few hours | both | done |

## Saturday goals set on Friday (closed)

- [x] ~~Village plus three interiors playable~~ replaced by one Schulhaus with nine rooms and the morning route
- [x] ~~Dashboard station saves progress through the bridge~~ done as the Tagesplan station, which saves the plan
- [ ] ~~Hazard hunt station in the workshop~~ dropped with the Werkstatt; safety now sits in the Säure-Base-Labor
- [ ] AI coach answers using our principles: prompt live, check in the world still open (see above)
- [ ] Backup video of the demo recorded (see above)
- [ ] Final presentation rehearsed (see above)
