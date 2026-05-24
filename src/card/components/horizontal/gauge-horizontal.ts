import { css, html, LitElement, nothing } from "lit";
import type { CSSResultGroup, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ComputedEntityConfig, EntityRenderData } from "../../types/types";

import "./gauge-horizontal-row";

@customElement("bar-gauge-horizontal")
export class HorizontalGauge extends LitElement {
  @property({ attribute: false }) public config!: ComputedEntityConfig[];
  @property({ attribute: false }) public data!: EntityRenderData[];

  protected override render(): TemplateResult | typeof nothing {
    if (!this.config || !this.data) return nothing;

    return html` ${this.config.map((config, index) => {
      const data = this.data[index];
      return html`<bar-gauge-horizontal-row
        .config=${config}
        .data=${data}
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
      `,
    ];
  }
}
