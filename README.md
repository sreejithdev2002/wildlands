# Wildlands: The Lost Crystal

A procedural low-poly third-person adventure prototype built with React, Vite, React Three Fiber, Drei, and Rapier. The first level is designed to run without downloaded models or textures.

## Requirements
- Node.js 20.19+ or 22.12+ recommended (Vite 7 requirement)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite. For a production build:
```bash
npm run build
npm run preview
```

## Controls
- **WASD / arrow keys:** move relative to camera facing
- **Shift:** sprint
- **Space:** jump
- **Mouse drag:** rotate camera
- **Mouse wheel:** zoom
- **Escape / pause button:** pause or resume
- **Touch devices:** drag the left virtual joystick to move; drag the scene to look; use jump and run buttons

Collect all five crystals and approach the portal at the north end of the path. Use the pause overlay to resume or restart the level.

## Structure
```text
wildlands/
├── public/{models,textures,audio}/
├── src/
│   ├── components/
│   │   ├── Collectibles/{Crystal,Portal}.jsx
│   │   ├── Environment/Environment.jsx
│   │   ├── Player/Player.jsx
│   │   └── UI/HUD.jsx
│   ├── game/gameConfig.js
│   ├── scenes/LevelOne.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Assets and licensing
The playable level currently uses procedural meshes and no external asset files, so it does not depend on third-party model availability or licenses. To add art later, browse these official catalogs and review the license on the specific asset page before use:
- Kenney: https://kenney.nl/assets (many packs are CC0; confirm the individual pack)
- Quaternius: https://quaternius.com/ (check the license listed for each pack)
- Poly Pizza: https://poly.pizza/ (license varies by model; verify the individual listing)

No third-party asset is silently bundled in this project.

## Notes / next steps
- This is a procedural first-level prototype, not a production game. The character is a low-poly placeholder, not a rigged animated character.
- Add a more polished touch joystick knob response, a dedicated touch camera zone, and test controls on physical iOS/Android devices.
- For a production release, add authored terrain meshes, accessible UI, sound, save data, additional levels, automated gameplay tests, and device profiling.
- Test `npm install`, `npm run build`, desktop keyboard/mouse input, touch cancellation, and portal completion in your target browsers before deployment.
