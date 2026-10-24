# Tools, open source and AI used

The challenge requires us to disclose these. Add every new tool, library or AI
tool here.

## AI tools

| Tool | Who | Used for |
| ---- | --- | -------- |
| Claude Code with Claude models (Anthropic) | Gabriel | Most of the code, levels, dialogues, stations (widgets) and docs in this repo, and the engine indoor-mode PR, produced under Gabriel's direction: he set the goals, decided the content and checked the results. Several Claude Code agents worked in parallel on separate parts (levels, stations, docs). Commits co-authored by Claude carry a `Co-Authored-By` line. |
| ChatGPT (OpenAI) | Luca | Writing up the team's paper notes on concept and personas as text; the ideas and persona attributes came from the team |
| Codex (OpenAI) | Luca | Repository review, turning the team's notes into the shared concept baseline and persona documents, and the Mathematikvormittag station (branch `codex/mathe`) |
| Hazu Genius | in the world | Runs the AI coach Herr Meinhard live, with our system prompt ([coach/system-prompt.md](../coach/system-prompt.md)). Part of the existing Hazu platform. Model: Genius's default `hazu/fast`, currently GPT-6 Luna hosted in Frankfurt, under an EU-only model policy. |

How AI output was checked:

- Every level and station was opened and played in a browser, locally and on
  hazu.app (fullscreen, dialogues, doors, station results saved); see the
  checks noted in [progress.md](progress.md).
- Browser automation (Playwriter driving Chrome) for checks in the live app;
  Luca checked his station's scenes and mobile layout in Chrome.
- The engine indoor mode ran the engine's test suite plus browser checks, and
  had two review rounds before the PR; it stays unmerged until a human review.
- Concept texts were checked against the team's decisions
  ([shared-concept.md](shared-concept.md),
  [concept-coverage.md](concept-coverage.md)); AI suggestions stay marked as
  proposals until the team confirms them.
- Uploaded files were compared with the local files by checksum.

## Platform (existed before the hackathon)

| Tool | Used for |
| ---- | -------- |
| Hazu (hazu.app) | content, permissions, hosting of the world and the stations |
| Hazu World | 3D engine: walking, characters, level builder, Genius integration |
| Hazu widget bridge (`hazu-api.js`, loaded from Hazu's storage) | stations save results as items |
| Hazu Genius | the AI coach |

We extended Hazu World during the hackathon with an indoor mode
([HazuInc/HazuApp#7183](https://github.com/HazuInc/HazuApp/pull/7183), merged
and live on hazu.app since Saturday 12:29). That code lives in the engine repository, not here.

## Open source and third-party components

| Component | Version | License | Where | Before / during |
| --------- | ------- | ------- | ----- | --------------- |
| three.js (as `super-three`) | 0.181.0 | MIT | 3D rendering inside the Hazu World engine; our level files describe three.js geometries | part of the existing engine |
| IWSDK (`@iwsdk/core`) | 1.0.0 | MIT | VR/AR layer of the Hazu World engine | part of the existing engine |
| Vite | 7 | MIT | engine dev server for local testing of the indoor mode | part of the existing engine setup |
| Lato (Google Fonts) | – | OFL 1.1 | all stations | used during the hackathon |
| Font Awesome Free (from cdnjs) | 6.5.2 | icons CC BY 4.0, font SIL OFL 1.1, code MIT | icons in the Säure-Base-Labor | used during the hackathon |
| Playwriter (Chrome extension + CLI, Playwright API) | – | MIT | browser checks of the world and stations | used during the hackathon |
| Piper TTS (`piper-tts`) | 1.8.0 | GPL-3.0 | Luca's local German narration trial, run outside the repo; not part of the world | used during the hackathon |
| Piper voice `de_DE-thorsten-medium` | – | model card lists the Thorsten dataset as CC0 | same trial | used during the hackathon |

Details of the narration trial: `docs/local-tts.md` on branch `codex/mathe`.

Our stations load nothing else from outside: no other libraries, no
analytics, no external APIs. The pitch deck is a Hazu presentation on
hazu.app (existing platform feature).
