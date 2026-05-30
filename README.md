# pi-effort

A tiny [pi](https://pi.dev) extension that adds a global `/effort` slash command for quickly setting the thinking effort level on reasoning-capable models.

```
/effort              # show current level
/effort high         # set the level
/effort <Tab>        # autocomplete the 6 valid levels
```

Pi already has `Shift+Tab` to cycle thinking levels — `/effort` is for when you want to jump directly to a specific level, with the convenience of autocomplete, instead of cycling through every intermediate step.

## Levels

`off` · `minimal` · `low` · `medium` · `high` · `xhigh`

The level is clamped to the active model's capabilities. If you ask for `high` on a non-reasoning model, pi will silently keep it at `off` and the extension will tell you that's what happened.

## Install

```bash
# from a local checkout (great for hacking)
pi install /path/to/pi-effort

# from git, once published
pi install git:github.com/anishthite/pi-effort

# from npm, once published
pi install npm:pi-effort

# try it for one session without installing
pi -e /path/to/pi-effort
```

By default `pi install` writes to your global settings (`~/.pi/agent/settings.json`). Add `-l` to install only for the current project.

## Verify

In a pi session:

```
/reload
/effort high
```

You should see a notification like `Thinking: medium → high` (or a clamp warning if the active model doesn't support `high`).

## How it works

The extension registers a single command via `pi.registerCommand("effort", …)` and toggles the active level with `pi.setThinkingLevel()`. That's the whole thing — about 60 lines including comments. See [`extensions/effort.ts`](./extensions/effort.ts).

It also implements `getArgumentCompletions` so `/effort <Tab>` shows the valid levels filtered by what you've typed so far.

## License

MIT — see [LICENSE](./LICENSE).
