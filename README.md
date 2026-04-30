# 4C360 Brochures

Standalone public microsite for interactive 4C360 solution brochures.

## Routes

- `/`
- `/4c360`
- `/4c360/properties`
- `/4c360/fm`
- `/4c360/marine`
- `/4c360/osh`
- `/4c360/retail-compliance`
- `/brochure`
- `/brochure/properties`
- `/brochure/retail-compliance`

## Local Run

```bash
npm install
npm run dev
```

## Replit Run

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## Environment

Optional ElevenLabs brochure advisor:

```bash
VITE_ELEVENLABS_SOLUTIONS_AGENT_ID=agent_id_here
```

On Replit, add this as a Secret named exactly:

```text
VITE_ELEVENLABS_SOLUTIONS_AGENT_ID
```

Then restart the app or republish so Vite can include it in the client build.

If the agent ID is missing, the brochure shows a graceful disabled advisor state.

## Future Domain

Target public domain:

```text
brochures.4cgrc.com
```
interactive brochures for 4C360 solutions
