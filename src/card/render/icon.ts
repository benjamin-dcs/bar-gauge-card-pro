import { html } from "lit";
import { IconData } from "../types/types";
import { styleMap } from "lit/directives/style-map.js";
import { HomeAssistant } from "../../dependencies/ha";

export function renderIcon(hass: HomeAssistant, iconData: IconData) {
  return html` <div class="icon">
    <ha-tile-icon
      style=${styleMap({
        "--tile-icon-color": iconData.color,
      })}
    >
      <ha-state-icon
        slot="icon"
        .icon=${iconData.icon}
        .hass=${hass}
      ></ha-state-icon>
    </ha-tile-icon>
  </div>`;
}
