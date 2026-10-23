---
name: widget
description: How to build a station for the Schulwelt as one HTML file using the Hazu bridge (data and AI). Read before creating or changing a widget in widgets/.
---

# Building a station (widget)

A station is **one single HTML file**. On hazu.app it runs in a sandboxed
iframe and talks to the platform through the Hazu bridge. Start by copying
`widgets/_template/index.html`.

## Basics

- Everything in one file: HTML, CSS, JS. Relative imports do not work.
- Libraries only from a CDN with a pinned version (e.g.
  `https://cdn.jsdelivr.net/npm/three@0.170.0/...`).
- Responsive: the widget runs in an overlay or full screen. Use `100vw`/`100vh`
  and `clamp()` for font sizes; no fixed pixel widths.
- Font Lato, light design by default.
- Visitor-facing text in German (Swiss spelling, «ss»); code and comments in
  English.
- `localStorage`, `sessionStorage` and cookies throw inside the iframe. Always
  wrap them in `try/catch` and never use them for progress.
- Links always with `target="_blank"`.

## Bridge

```html
<script src="https://storage.googleapis.com/hazu-ch.appspot.com/files/artifacts/AYbnyrL6JhG3xUjfimN8/hazu-api.js"></script>
```

```js
const hazu = await HazuAPI.init();

hazu.context.hazuId;      // Hazu the station lives in
hazu.context.displayName; // visitor's name
hazu.context.language;    // "de", "en", "fr"
hazu.context.isEditor;    // may the visitor edit?

// Read and write data
const children = await hazu.getChildren();
const item = await hazu.getItem(id);
const created = await hazu.createItem({ parentId, title, type: "item", description });
await hazu.updateItem(id, { title, description });
```

### AI (Genius)

```js
const session = await hazu.genius.createSession({
  configId: "<Genius configuration ID>", // ask Gabriel
  overrides: { systemMessage: "…", model: "hazu/fast" },
});

hazu.genius.streamMessage(
  session.sessionId,
  { parts: [{ type: "text", text: "Prüfe meinen Bauplan: …" }] },
  {
    onChunk: (c) => (out.textContent += c.text),
    onComplete: () => {},
    onError: (e) => console.error(e.code, e.message),
  },
);
```

Model names: `hazu/fast` (quick, cheap), `hazu/standard`, `hazu/deep`. Do not
use any other model names.

## Testing locally

Outside Hazu there is no bridge. The template notices and switches to mock data
(`MOCK`), so you can open the widget straight in a browser. Locally the AI
answers with a placeholder.

## Getting it into the world

1. Commit and push the widget.
2. Gabriel uploads the file to hazu.app and creates a Hazu with tag
   `hz-world-sim` at the right place that opens the widget.
3. Check in the world: walk up to the station, open the widget, play it once.
4. Update the status in [docs/places.md](../../docs/places.md).
