# Progress

Tick off each milestone and add the time. This is also our evidence for the
jury.

## Friday, 23 October

- [x] Team found, idea agreed
- [x] Repo and Hazu structure set up (23:20)
- [x] First walkable version of the village (auto-generated, 23:30)
- [x] Designed Bergdorf level live: square with forum, workshop hall, five houses with doors, 8 NPCs incl. Genius coach (23:50, checked in the app)
- [ ] Personas for all places

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
- [ ] Indoor mode PR for AndyBot (not live without an app release and Andy's approval)
- [ ] Optional: Obergeschoss as its own level, reached by stairs (travel point), no engine change needed

- [x] Luca's personas in the Schulhaus (Frau Arnold, Lea, Tobi, Quirin, Yara, Matilda, Herr Tesla) and Herr Meinhard as Genius coach: the visitor speaks as themselves; live as revision 4, checked in the app (03:27)
- [x] Station «Säuren und Basen» (`widgets/saeuren-basen/`) with Herr Tesla: safety gear, hypothesis, red-cabbage indicator, pH scale; live and linked to him (03:27)
- [x] Station «Konflikt in der Projektgruppe» (`widgets/konflikt/`): decide for Joel in a group conflict, scripted branches, 8 endings; live and linked to Herr Meinhard (03:27)
- [x] Stations are linked to characters with the tag `hw-npc-<id>` (also the Sägestation); unused place Hazus moved to «Reserve», so the world shows no stray signboards (03:27)
- [x] Indoor PR HazuInc/HazuApp#7183: second review fixed (XR sky state, weather indoors, AR table) and a ceiling in first person (03:27)

- [x] Schulhaus walls: colliders every 0.4 m (radius 0.2), so the body no longer walks halfway into walls; all doorways still passable (checked locally) (03:36)

## Tonight's plan

| # | Task | Who |
| - | ---- | --- |
| 1 | Invite partner: GitHub repo and editor rights on the Hazu | Gabriel |
| 2 | ~~Design the village exterior~~ done as `level/bergdorf.json`; now check it in the app and polish in the builder | Gabriel |
| 3 | NPC prompt template (Vorlage) plus teacher and coach personas | Partner |
| 4 | ~~Interior of the Werkstatt~~ done; next the Coaching-Raum and Lernatelier | Gabriel |
| 5 | Copy the widget template to `widgets/dashboard/`, first version: briefing and progress path with mock data | Partner |
| 6 | Coach as a Genius configuration in «Figuren», using the prompt in `coach/` | Gabriel |
| 7 | Commit, update this file, sleep a few hours | both |

## Saturday, 24 October

- [ ] Village plus three interiors playable (Werkstatt, Coaching-Raum, Lernatelier)
- [ ] Dashboard station saves progress through the bridge
- [ ] Hazard hunt station in the workshop
- [ ] AI coach answers using our principles
- [ ] Backup video of the demo recorded
- [ ] Final presentation rehearsed

- [x] Shared concept baseline documented; freedom during the learning path and unchanged grading regulations clarified (00:42, Europe/Zurich).

- [x] Documented six learner and two coach personas, age-appropriate independent projects, and separation of given traits from draft scenarios (02:25, Europe/Zurich).
