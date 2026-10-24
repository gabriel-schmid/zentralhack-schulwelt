# Local speech synthesis trial

Piper is installed in an isolated local Python environment, outside the Git
repository. No HeyGen connection or cloud speech API is used. After downloading
the dependencies and voice model, synthesis runs locally on the CPU.

## Components and licensing

- Engine: OHF-Voice Piper (`piper-tts` 1.8.0), GPL-3.0.
  https://github.com/OHF-Voice/piper1-gpl
- Voice: `de_DE-thorsten-medium`, German (Germany), 22050 Hz.
  Its model card lists the underlying Thorsten dataset as CC0 and notes
  fine-tuning from the English lessac medium voice. This records the model
  card's claim rather than asserting a separate legal audit of all training data.
  https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
- This uses an existing synthetic voice; no user voice recording or cloning.

## Files

- `output/tts/prozentrechnung-probe.txt`: Swiss High German sample narration.
- `output/tts/prozentrechnung-probe.wav`: generated listening sample.

The example deliberately uses different values from the observer demo:
CHF 80 increased by 25% gives CHF 100; decreasing that by 25% gives CHF 75.
This is a voice trial, not a complete explanatory lesson or published video.

## Reproduce

With Piper and the voice files available, run:

```text
python -m piper -m /path/to/de_DE-thorsten-medium.onnx -f output/tts/prozentrechnung-probe.wav --input-file output/tts/prozentrechnung-probe.txt
```

Keep the large voice model and Python environment outside the repository.
Listen before producing complete videos: check number pronunciation, pace,
pauses and intelligibility for ages 12–15. A successful WAV file alone does
not establish that the narration sounds natural.
