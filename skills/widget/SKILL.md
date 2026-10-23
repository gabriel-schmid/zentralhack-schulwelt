---
name: widget
description: Wie man eine Station für die Schulwelt baut, als eine HTML-Datei mit der Hazu-Bridge (Daten und KI). Lesen, bevor du ein Widget in widgets/ anlegst oder änderst.
---

# Eine Station (Widget) bauen

Eine Station ist **eine einzige HTML-Datei**. Sie läuft auf hazu.app in einem
abgeschotteten iframe und spricht über die Hazu-Bridge mit der Plattform.
Start: `widgets/_vorlage/index.html` kopieren.

## Grundregeln

- Alles in einer Datei: HTML, CSS, JS. Relative Imports funktionieren nicht.
- Bibliotheken nur per CDN mit fester Version (z. B.
  `https://cdn.jsdelivr.net/npm/three@0.170.0/...`).
- Responsive: Das Widget läuft im Overlay oder im Vollbild. `100vw`/`100vh`,
  `clamp()` für Schrift, keine festen Pixelbreiten.
- Schrift Lato, helles Design als Standard.
- `localStorage`, `sessionStorage` und Cookies werfen im iframe einen Fehler.
  Immer in `try/catch`, nie für Fortschritt verwenden.
- Links immer mit `target="_blank"`.

## Bridge

```html
<script src="https://storage.googleapis.com/hazu-ch.appspot.com/files/artifacts/AYbnyrL6JhG3xUjfimN8/hazu-api.js"></script>
```

```js
const hazu = await HazuAPI.init();

hazu.context.hazuId;      // Hazu, in dem die Station liegt
hazu.context.displayName; // Name der Person
hazu.context.language;    // "de", "en", "fr"
hazu.context.isEditor;    // darf die Person bearbeiten?

// Daten lesen und schreiben
const kinder = await hazu.getChildren();
const item = await hazu.getItem(id);
const neu = await hazu.createItem({ parentId, title, type: "item", description });
await hazu.updateItem(id, { title, description });
```

### KI (Genius)

```js
const session = await hazu.genius.createSession({
  configId: "<ID der Genius-Konfiguration>", // von Gabriel
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

Modellnamen: `hazu/fast` (schnell, günstig), `hazu/standard`, `hazu/deep`.
Keine anderen Modellnamen eintragen.

## Lokal testen

Ausserhalb von Hazu gibt es keine Bridge. Die Vorlage merkt das und nimmt
Testdaten (`MOCK`), damit man das Widget direkt im Browser öffnen kann. KI
antwortet lokal mit einem Platzhaltertext.

## In die Welt bringen

1. Widget committen und pushen.
2. Gabriel lädt die Datei auf hazu.app hoch und legt am passenden Ort einen
   Hazu mit Tag `hz-world-sim` an, der das Widget öffnet.
3. In der Welt prüfen: Station anlaufen, Widget öffnen, einmal durchspielen.
4. In [docs/orte.md](../../docs/orte.md) den Status nachführen.
