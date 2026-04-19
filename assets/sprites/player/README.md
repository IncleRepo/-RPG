# Player Sprite Set

`assets/sprites/player/` contains the main character motion frames for issue `#52`.

## Concept

- Character: `여명 인양사`
- Origin: `미라진 출신`
- Visual keywords: sea-salvager coat, brass trim, red scarf, tomorrow-crystal shard
- Canvas: `48x48 PNG`, transparent background
- Facing: single right-facing 3/4 view for base action prototyping

## Motion List

- `idle`: 4 frames
- `walk`: 6 frames
- `run`: 6 frames
- `jump`: 4 frames
- `fall`: 4 frames
- `attack`: 6 frames
- `hurt`: 3 frames
- `death`: 6 frames

## Files

- Frame naming follows `<motion>_<index>.png`
- Example: `idle_00.png`, `walk_03.png`, `attack_05.png`
- Preview sheet: `player-motion-preview.png`

## Regeneration

If the sprite set needs tuning, regenerate the PNG files with:

```bash
python3 scripts/generate_player_sprites.py
```
