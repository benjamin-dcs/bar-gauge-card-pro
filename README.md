# Bar Gauge Card Pro

### Build beautiful Bar Gauge cards using 🌈 gradients and 🛠️ templates!

## Todo

- Add Vertical mode
- Add Visual Editor
- Add custom shapes
- Add custom styling variables

## Description

Build as a more space-efficient alternative for
[Gauge Card Pro](https://github.com/benjamin-dcs/gauge-card-pro), I created
`Bar Gauge Card Pro`.

- 🌈 Native gradient support for `segments`
- 🛠️ Use templates for the majority of the fields
- ↔ Ability to start `severity` gauges from the center
- ✨ Additional icon indicator next to the gauge
- 🪛 Several styling options
- 🎨 Every element in the card can have its colour defined. This can be a single
  colour or two colours for light- or darkmode. Of course, allows templating!
- 👬 Set `value` and `value_text` independently
- 🎨 Automatic color interpolation for `severity` gauges
- 😶‍🌫️ Native ability to hide the background

## Support This Project

If you find **Bar Gauge Card Pro** useful, consider supporting its development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/benjamindcs)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor%20on%20GitHub-30363d?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/benjamin-dcs)

## Table of contents

- [Configuration variables](#configuration-variables)
  - [Entity Configuration variables](#entity-configuration-variables)
  - [Icon Configuration variables](#icon-configuration-variables)
  - [Min/Max Indicator Configuration variables](#minmax-indicator-configuration-variables)
  - [Setpoint Configuration variables](#setpoint-configuration-variables)

## Configuration variables

| Name                 | Type    | Default      | Description                                                             | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :------------------- | :------ | :----------- | :---------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `type`               | string  |              | `custom:bar-gauge-card-pro`                                             |                                                                             |
| `header`             | string  |              | Header of the card                                                      |                                                                             |
| `entities`           | list    |              | List of individual [bar configuration](#entity-configuration-variables) |                                                                             |
| `orientation`        | string  | `horizontal` | Orientation of the bars. Valid values are `horizontal` and `vertical`   |                                                                             |
| `compact`            | boolean | `false`      | Show all data in-line with the bar. Only shows `title` and value        |                                                                             |
| `hide_all_text_bars` | boolean | `false`      | Hides all text-bars                                                     |                                                                             |
| `hide_background`    | boolean | `false`      | Hides the background and border of the card                             |                                                                             |

### Entity Configuration variables

| Name                          | Type                                                                  | Default                                                                  | Description                                                                                              | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :---------------------------- | :-------------------------------------------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `entity`                      | string                                                                | Optional                                                                 | Entity for value, templates, actions and features (e.g.: `{{ states(entity) }}`)                         |                                                                             |
| `secondary`                   | [secondary object](#secondary-configuration-variables)                | Configuration of the secondary bar                                       |                                                                                                          |                                                                             |
| `attribute`                   | string                                                                | Optional                                                                 | Attribute of `entity` to use for value                                                                   |                                                                             |
| `min`                         | number                                                                | 0                                                                        | Minimum value for graph                                                                                  | ✔️ (only templatable in code-editor/yaml)                                   |
| `max`                         | number                                                                | 100                                                                      | Maximum value for graph                                                                                  | ✔️ (only templatable in code-editor/yaml)                                   |
| `segments`                    | list of [segment objects](#segments-configuration-variables)          | Optional                                                                 | List of colors and their corresponding start values                                                      | ✔️                                                                          |
| `severity`                    | boolean                                                               | `false`                                                                  | Show the bar as a severity gauge                                                                         |                                                                             |
| `severity_centered`           | boolean                                                               | Optional                                                                 | Severity gauge (requires disabled needle) start at the center                                            |                                                                             |
| `severity_color_mode`         | string                                                                | `basic`                                                                  | Sets the mode to determine/render the color of the value of a severity gauge.                            |                                                                             |
|                               |                                                                       |                                                                          | • `basic`: Color determined based on `segments`                                                          |                                                                             |
|                               |                                                                       |                                                                          | • `interpolation`: Color determined based on `segments`, interpolated between segment positions          |                                                                             |
|                               |                                                                       |                                                                          | • `gradient`: Show part of the gradient-arc as value                                                     |                                                                             |
| `gradient`                    | boolean                                                               | `false`                                                                  | Shows segments as a gradient (requires needle)                                                           |                                                                             |
| `gradient_background`         | boolean                                                               | `false`                                                                  | Shows the background as a gradient for severity gauge (requires disabled needle)                         |                                                                             |
| `gradient_background_opacity` | number (0-1)                                                          | `0.25`                                                                   | Opacity for gradient background                                                                          |                                                                             |
| `gradient_resolution`         | string or number                                                      | `auto`                                                                   | Level of detail for the gradient. Must be `auto` or a number indicating the amount of segments to create |                                                                             |
| `icon`                        | [icon object](#icon-configuration-variables)                          |                                                                          |                                                                                                          |                                                                             |
| `min_indicator`               | [min/max indicator object](#minmax-indicator-configuration-variables) |                                                                          | Configuration of the min indicator                                                                       |                                                                             |
| `max_indicator`               | [min/max indicator object](#minmax-indicator-configuration-variables) |                                                                          | Configuration of the max indicator                                                                       |                                                                             |
| `setpoint`                    | [setpoint object](#setpoint-configuration-variables)                  |                                                                          | Configuration for the setpoint needle                                                                    |                                                                             |
| `title`                       | string                                                                | Friendly name of `entity`                                                | Title of the bar                                                                                         |                                                                             |
| `unit_of_measurement`         | string                                                                | `unit of measurement` of `entity` for primary or `entity2` for secondary | Unit of measurement. Use `""` to overwrite the default                                                   | ✔️                                                                          |
| `unit_before_value`           | boolean                                                               | false                                                                    | Place unit of measurement in front of value                                                              |                                                                             |
| `value`                       | template                                                              | state of `entity`                                                        | Value for graph                                                                                          | ✔️ (only available in code-editor/yaml)                                     |
| `hide_text_bar`               | boolean                                                               | `false`                                                                  | Hide the text-bar                                                                                        |                                                                             |
| `round`                       | string                                                                | `off`                                                                    | Rounds the ends of the bar. Valid values are `off`, `full`, `medium` and `small`                         |                                                                             |
| `shapes`                      | [shapes object](#shapes-configuration-variables)                      |                                                                          | Configuration of the shapes several elements                                                             |                                                                             |

### Secondary Configuration variables

| Name            | Type                                                                  | Default | Description                                            | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------------- | :-------------------------------------------------------------------- | :------ | :----------------------------------------------------- | :-------------------------------------------------------------------------- |
| `value`         | template                                                              |         | Value for secondary graph. Can be an entity or a value | ✔️ (only available in code-editor/yaml)                                     |
| `min_indicator` | [min/max indicator object](#minmax-indicator-configuration-variables) |         | Configuration of the min indicator                     |                                                                             |
| `max_indicator` | [min/max indicator object](#minmax-indicator-configuration-variables) |         | Configuration of the max indicator                     |                                                                             |
| `setpoint`      | [setpoint object](#setpoint-configuration-variables)                  |         | Configuration for the setpoint needle                  |                                                                             |

### Segments configuration variables

Segments can be defined in two ways. Either using `from:` or `pos:`. For gradient bars, the two behave differently. For more information checkout [this wiki](https://github.com/benjamin-dcs/gauge-card-pro/wiki/from%E2%80%90segments-vs-pos%E2%80%90segments).

`from` and `pos` can be a `number` or a `percentage` (e.g. `"50%"`)

#### Fixed list with from

```yaml
segments:
  - from: 0
    color: "#4caf50"
  - from: 25
    color: "#8bc34a"
  - from: 50
    color: "#ffeb3b"
  - from: 75
    color: "#ff9800"
  - from: 100
    color: "#f44336"
  - from: 125
    color: "#926bc7"
  - from: 150
    color: "#795548"
```

#### Fixed list with pos

```yaml
segments:
  - pos: -1
    color: var(--error-color)
  - pos: -0.25
    color: var(--warning-color)
  - pos: 0.5
    color: var(--success-color)
```

#### Template list

```yaml
segments: |-
  {% set max = states('sensor.max_sensor') | float %}
  {{
    [
      { "from": 0, "color": "#4caf50" },
      { "from": 25, "color": "#8bc34a" },
      { "from": 50, "color": "#ffeb3b" },
      { "from": 75, "color": "#ff9800" },
      { "from": 100, "color": "#f44336" },
      { "from": 125, "color": "#926bc7" },
      { "from": max, "color":"#795548"  }
    ]
  }}
```

### Icon Configuration variables

| Name                | Type                                                                                                    | Default  | Description       | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :------------------ | :------------------------------------------------------------------------------------------------------ | :------- | :---------------- | :-------------------------------------------------------------------------- |
| `icon`              | string                                                                                                  | Required | Icon              |                                                                             |
| `icon_color`        | string                                                                                                  | Optional | Color of the icon |                                                                             |
| `tap_action`        | [Home Assistant Tap action](https://www.home-assistant.io/dashboards/actions/#tap-action)               |          |                   |                                                                             |
| `hold_action`       | [Home Assistant Hold action](https://www.home-assistant.io/dashboards/actions/#hold-action)             |          |                   |                                                                             |
| `double_tap_action` | [Home Assistant Double tap action](https://www.home-assistant.io/dashboards/actions/#double-tap-action) |          |                   |                                                                             |

### Min/Max Indicator Configuration variables

| Name      | Type                                           | Default              | Description                                                                  | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------- | :--------------------------------------------- | :------------------- | :--------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `type`    | string                                         | Required             | `attribute`, `entity`, `number` or `template`                                |                                                                             |
| `value`   | value corresponding to the type                | Required             | Value of the needle                                                          |                                                                             |
|           |                                                |                      | • `attribute`: attribute of `entity` (main-gauge) or `entity2` (inner-gauge) |                                                                             |
|           |                                                |                      | • `entity`: Entity_id                                                        |                                                                             |
|           |                                                |                      | • `number`: Fixed number                                                     |                                                                             |
|           |                                                |                      | • `template`: Template that returns a number                                 | ✔️                                                                          |
| `color`   | [string or map<sup>5</sup>](#1-color-examples) | `var(--error-color)` | Color of the needle                                                          | ✔️                                                                          |
| `opacity` | number                                         | 0.8                  | Opacity of the min or max indicator                                          |                                                                             |

### Setpoint Configuration variables

| Name        | Type                                           | Default              | Description                                                                  | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :---------- | :--------------------------------------------- | :------------------- | :--------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `type`      | string                                         | Required             | `attribute`, `entity`, `number` or `template`                                |                                                                             |
| `value`     | value corresponding to the type                | Required             | Value of the needle                                                          |                                                                             |
|             |                                                |                      | • `attribute`: attribute of `entity` (main-gauge) or `entity2` (inner-gauge) |                                                                             |
|             |                                                |                      | • `entity`: Entity_id                                                        |                                                                             |
|             |                                                |                      | • `number`: Fixed number                                                     |                                                                             |
|             |                                                |                      | • `template`: Template that returns a number                                 | ✔️                                                                          |
| `color`     | [string or map<sup>5</sup>](#1-color-examples) | `var(--error-color)` | Color of the needle                                                          | ✔️                                                                          |
| `label`     | boolean                                        | false                | Enables a label indicating the value (main gauge only)                       |                                                                             |
| `precision` | number                                         | Optional             | Amount of decimals to round the label to                                     |                                                                             |

### Shapes Configuration variables

> [!NOTE]
>
> The value needs to be a valid svg path. You can use an online tool like [svg-path-editor](https://yqnn.github.io/svg-path-editor/) to design your own custom needles!

| Name             | Type   | Default                                                          | Description                                    | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :--------------- | :----- | :--------------------------------------------------------------- | :--------------------------------------------- | :-------------------------------------------------------------------------- |
| `value`          | string | `M 0 -0.75 A 0.75 0.75 0 0 1 0 0.75 A 0.75 0.75 0 1 1 0 -0.75 z` | Shape of the main value **without** secondary  | ✔️                                                                          |
|                  | string | `M -0.4 -1 L 0.4 -1 L 0 -0.1 L -0.4 -1 z`                        | Shape of the main value **with** secondary     | ✔️                                                                          |
| `valueSecondary` | string | `M -0.4 -1 L 0.4 -1 L 0 -0.1 L -0.4 -1 z`                        | Shape of the secondary value                   | ✔️                                                                          |
| `min_indicator`  | string | -                                                                | Shape of the main min-indicator                | ✔️                                                                          |
| `max_indicator`  | string | -                                                                | Shape of the main max-indicator                | ✔️                                                                          |
| `setpoint`       | string | `M 0 -0.4 A 0.4 0.4 0 0 1 0 0.4 A 0.4 0.4 0 1 1 0 -0.4 z`        | Shape of the setpoint needle of the main gauge | ✔️                                                                          |

## Installation

### Via HACS (recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=benjamin-dcs&repository=bar-gauge-card-pro&category=plugin)

1. Click the button above **or** open **HACS → Frontend**
2. Click **⋮ → Custom repositories**
3. Add `https://github.com/benjamin-dcs/bar-gauge-card-pro` as type **Lovelace**
4. Find **Bar Gauge Card Pro** and click **Download**
5. **Reload** your browser

### Manual

1. Download `bar-gauge-card-pro.js` from the [latest release](https://github.com/benjamin-dcs/bar-gauge-card-pro/releases)
2. Copy both files to `/config/www/`
3. Go to **Settings → Dashboards → Resources**
4. Add `/local/bar-gauge-card-pro.js` as a **JavaScript module**
5. **Reload** the browser
