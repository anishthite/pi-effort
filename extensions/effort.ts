/**
 * /effort — Quickly set the thinking effort level in pi.
 *
 * Usage:
 *   /effort              Show the current level
 *   /effort high         Set the level (off|minimal|low|medium|high|xhigh)
 *   /effort <Tab>        Autocomplete the available levels
 *
 * Levels are clamped to the active model's capabilities — non-reasoning
 * models will stay at "off" even if you ask for "high", and pi will tell
 * you when that happens.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh"] as const;
type Level = (typeof LEVELS)[number];

export default function effortExtension(pi: ExtensionAPI) {
	pi.registerCommand("effort", {
		description: "Set thinking effort (off|minimal|low|medium|high|xhigh)",
		getArgumentCompletions: (prefix) => {
			const p = prefix.toLowerCase();
			const matches = LEVELS.filter((l) => l.startsWith(p)).map((l) => ({
				value: l,
				label: l,
			}));
			return matches.length > 0 ? matches : null;
		},
		handler: async (args, ctx) => {
			const arg = args?.trim().toLowerCase();

			if (!arg) {
				ctx.ui.notify(
					`Thinking: ${pi.getThinkingLevel()} • Usage: /effort <${LEVELS.join("|")}>`,
					"info",
				);
				return;
			}

			if (!LEVELS.includes(arg as Level)) {
				ctx.ui.notify(
					`Unknown level "${arg}". Try one of: ${LEVELS.join(", ")}`,
					"error",
				);
				return;
			}

			const previous = pi.getThinkingLevel();
			pi.setThinkingLevel(arg as Level);
			const actual = pi.getThinkingLevel();

			if (actual !== arg) {
				ctx.ui.notify(
					`Thinking clamped to "${actual}" (model does not support "${arg}")`,
					"warning",
				);
			} else if (actual === previous) {
				ctx.ui.notify(`Thinking already at "${actual}"`, "info");
			} else {
				ctx.ui.notify(`Thinking: ${previous} → ${actual}`, "info");
			}
		},
	});
}
