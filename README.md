# Bar Gauge Card Pro

### Build beautiful Bar Gauge cards using 🌈 gradients and 🛠️ templates!

## Description

Build as a more space-efficient alternative for [Gauge Card Pro](https://github.com/benjamin-dcs/gauge-card-pro) I created this `Bar Gauge Card Pro`.


- 🌈 Native gradient support for `segments`
- 🛠️ Use templates for the majority of the fields
- ↔ Ability to start `severity` gauges from the center
- ✨ Additional icon indicator next to the gauge
- 🪛 Several styling options
- 🎨 Every element in the card can have its colour defined. This can be a single colour or two colours for light- or darkmode. Of course, allows templating!
- 👬 Set `value` and `value_text` independently
- 🎨 Automatic color interpolation for `severity` gauges
- 😶‍🌫️ Native ability to hide the background

<img width="778" height="564" alt="image" src="https://github.com/user-attachments/assets/d6c70c76-aa1e-4a7e-be44-c08d2043f626" />

## Support This Project

If you find **Bar Gauge Card Pro** useful, consider supporting its development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/benjamindcs)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor%20on%20GitHub-30363d?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/benjamin-dcs)

## Table of contents

- [Configuration variables](#configuration-variables)
  - [Icon Configuration variables](#icon-configuration-variables)
  - [Min/Max Indicator Configuration variables](#minmax-indicator-configuration-variables)
  - [Setpoint Configuration variables](#setpoint-configuration-variables)
  

## Configuration variables

| Name                  | Type             | Default     | Description                      | [Templatable](https://www.home-assistant.io/docs/configuration/templating/) |
| :-------------------- | :--------------- | :---------- | :------------------------------- | :-------------------------------------------------------------------------- |
| `type`                | string           |             | `custom:bar-gauge-card-pro`          |                                                                             |
| `header`              | string           |             | Header of the card               |                                                                             |
| `hide_background`     | boolean                                                               | `false`                     | Hides the background and border of the card                                                                                                                     |                                                                             |
