# ox_target — UI Edition

A RedM/Vorp/RSG edition of the `ox_target` resource featuring a completely redesigned target interface and individual appearance settings for every player.

## Features

- twelve visual option styles: Glass, Solid, Minimal, Neon, Outline, Western, Frost, Carbon, Gold, Crimson, Ghost, and Terminal
- twelve option shapes: Standard, Pill, Compact, Sharp, Split Icon, Floating, Ticket, Cut Corners, Double Frame, Soft Panel, Side Stripe, and Badge
- `/ox` appearance menu with a real-time preview
- complete `/ox` interface in Croatian, English, and German, with each player's language preference saved locally
- nine built-in target icons
- custom Font Awesome classes or direct HTTPS links to PNG, WebP, and GIF images instead of an icon
- custom accent, secondary, text, and background colors
- linear option positioning to the right, left, or below the target
- adjustable border thickness, corner radius, width, UI scale, option height, and opacity from 20% to 100%
- toggles for glow effects, animations, dual-color effects, and option numbers
- eight motion styles: pulse, breathe, spin, bounce, wiggle, flip, orbit, and no motion
- six two-color animation modes: smooth transition, quick switch, flowing gradient, option wave, two-color glow, and border pulse
- a flowing gradient that visibly transitions between the selected primary and secondary colors across the active option
- seven option arrangements: list, cross, full circle, arc, fan, zig-zag, and Custom
- adjustable distance between radial options and the target; larger option sets automatically continue on an additional ring
- Custom arrangement editor: select 1–6 preview options and drag each option to the desired position
- a separate Custom arrangement is saved for every option count from 1 through 6
- preview presets for interactions, jobs, vehicles, storage, or custom labels
- the preview uses the same center, coordinates, and selected UI scale as the in-game HUD; the previous left/below setting cannot offset radial or Custom arrangements
- local per-player settings stored through resource KVP, with no database required
- ACE-protected server default appearance for first-time players; personal player settings always take priority
- portable `OX1:` settings codes that players can copy, send, paste, preview, and save
- safe option-label rendering without HTML injection
- full compatibility with existing `ox_target` options and exports
- fully transparent and inactive NUI while neither the target nor `/ox` is open; CEF `backdrop-filter` is not used, preventing black rectangles
- releasing ALT in hold mode immediately closes the target and releases the mouse even while the NUI cursor is focused; toggle mode closes correctly on the next key press

## Installation

1. Replace your existing `ox_target` folder with this folder.
2. Verify the resource order in `server.cfg`:

```cfg
ensure ox_lib
ensure ox_target
```

3. Restart the resource or server.
4. Players can type `/ox` in chat, customize their appearance, and click **Save Changes**.

Appearance settings are client-side and every player can use a different design. No database or additional server script is required.

## Command Configuration

The default appearance command is `/ox`. You can change it with a convar before starting the resource:

```cfg
setr ox_target:appearanceCommand "targetui"
```

Set an empty value to disable the command:

```cfg
setr ox_target:appearanceCommand ""
```

## Server Default Appearance

Grant trusted administrators permission to manage the default appearance in `server.cfg`:

```cfg
add_principal identifier.steam:000000000000000 group.admin ##Your Steam
add_ace group.admin ox_target.admin allow

or 

add_principal identifier.steam:000000000000000 group.dev ##Your Steam
add_ace group.dev ox_target.admin allow

or 

add_principal identifier.steam:000000000000000 group.owner ##Your Steam
add_ace group.owner ox_target.admin allow
```

An authorized administrator can open `/ox`, configure the appearance, and click **Set as Server Default**. The button is hidden from players without the ACE permission.

The server default is stored through resource KVP and does not require a database. It is used when a player has no personal appearance saved yet. Once that player saves their own settings, their personal appearance takes priority on future joins.

## Sharing Appearance Settings

1. Open `/ox` and configure the appearance.
2. In the **Sharing** section, click **Copy Code**.
3. Send the generated `OX1:` code to another player.
4. The recipient pastes it into the same field and clicks **Import Code**.
5. The imported appearance is previewed immediately. Click **Save Changes** to store it permanently.

Imported codes pass through the same validation as manually selected settings. The recipient keeps their own interface language.

## Original Project

This is a RedM edition of [ox_target](https://github.com/overextended/ox_target), adapted for RedM/VORP/RSG. The original MIT license is included in the `LICENSE` file.


https://cdn.discordapp.com/attachments/1415705291642634350/1533963893720879275/image.png?ex=6a7266b3&is=6a711533&hm=cac802376f459e8c7c6b38bfc7108be66ca98f5ac63c24d8071fc27d13268dd5&

https://cdn.discordapp.com/attachments/1415705291642634350/1533963980542841052/image.png?ex=6a7266c8&is=6a711548&hm=dbee74f603d78127ae3ef07384a92c22690d889873700798f56579e69419e8cd&

https://cdn.discordapp.com/attachments/1415705291642634350/1533964031306760263/image.png?ex=6a7266d4&is=6a711554&hm=1e8df244cde72c341b00e680d250fd3de867dc62e4f7fbc443bff727b0bf21b7&

https://cdn.discordapp.com/attachments/1415705291642634350/1533964081000611871/image.png?ex=6a7266e0&is=6a711560&hm=0ba646f6346cc8bb60bfe6257f31ebf3b617ac569285911875e8f24eb9eccf3e&
