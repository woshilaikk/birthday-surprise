---
name: web-game-level-validator
description: Validate and repair handcrafted browser-game levels before release. Use when Codex edits maze, reverse-control, obstacle, or Sokoban-style levels and must prove start safety, reachability, puzzle solvability, and player-friendly layouts instead of relying on visual inspection.
---

# Web Game Level Validator

1. Run `scripts/validate_levels.mjs <path-to-script.js>` before and after changing any game levels.
2. Treat a level as invalid when:
   - the spawn overlaps an obstacle,
   - the static map has no path from spawn to goal,
   - a path exists only through edge-hugging gaps smaller than a comfortable player corridor,
   - a Sokoban level has no solver-confirmed solution.
3. Prefer broad, legible routes over trick routes. Use moving obstacles and timers for difficulty before shrinking corridors.
4. After editing, rerun the validator until every level passes.
5. For browser games, manually inspect the rendered first screen of each changed level after automated validation; automated reachability is necessary but not sufficient for good play.

## Validator Output

- `reverse`: checks spawn safety, exact-step reachability, and minimum explored state count as a crude readability signal.
- `sokoban`: runs a breadth-first solver over player and box states and reports whether each level is solvable.

