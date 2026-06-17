import { css, html, LitElement, nothing } from "lit";
import type { CSSResultGroup, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ComputedEntityConfig, EntityRenderData } from "../../types/types";
import { HomeAssistant } from "../../../dependencies/ha";

import "./gauge-horizontal-row";

@customElement("bar-gauge-horizontal")
export class HorizontalGauge extends LitElement {
  @property({ type: Boolean, reflect: true }) public compact: boolean = false;
  @property({ attribute: false }) public config!: ComputedEntityConfig[];
  @property({ attribute: false }) public data!: EntityRenderData[];
  @property({ attribute: false }) public hass!: HomeAssistant;

  protected override render(): TemplateResult | typeof nothing {
    if (!this.config || !this.data) return nothing;

    return html` ${this.config.map((config, index) => {
      const data = this.data[index];
      return html`<bar-gauge-horizontal-row
        .config=${config}
        .data=${data}
        .hass=${this.hass}
        .compact=${this.compact}
      ></bar-gauge-horizontal-row>`;
    })}`;
  }

  static get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: grid;
          gap: 0.5rem;
        }

        :host([compact]) {
          grid-template-columns: auto 1fr auto;
          align-items: center;
          column-gap: 0.75rem;
        }

        :host([compact]) bar-gauge-horizontal-row {
          display: grid;
          grid-column: 1 / -1;
          grid-template-columns: subgrid;
          align-items: center;
        }
      `,
    ];
  }
}
