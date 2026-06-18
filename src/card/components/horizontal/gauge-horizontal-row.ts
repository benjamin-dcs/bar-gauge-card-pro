import { html, LitElement, nothing } from "lit";
import type { CSSResultGroup, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import { DEFAULTS, ROUND_FACTORS } from "../../../constants/defaults";
import type {
  SecondaryValueData,
  ComputedEntityConfig,
  EntityRenderData,
  SeverityColorMode,
  MinMaxIndicatorData,
  SetpointData,
} from "../../types/types";
import { HomeAssistant } from "../../../dependencies/ha";
import { horizontalRowStyles } from "../../css/horizontal-row";
import { renderIcon } from "../../render/icon";

@customElement("bar-gauge-horizontal-row")
export class HorizontalGaugeRow extends LitElement {
  @property({ attribute: false }) public config!: ComputedEntityConfig;
  @property({ attribute: false }) public data!: EntityRenderData;

  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public compact: boolean = false;

  protected override render(): TemplateResult | typeof nothing {
    const conf = this.config;
    const data = this.data;

    if (!conf || !data) return nothing;

    if (this.compact) {
      return html`
        <div class="compact-title">
          ${data.icon ? renderIcon(this.hass, data.icon) : nothing}
          ${data.title ?? nothing}
        </div>
        ${this.renderValueBar()}
        <div class="compact-value">${data.valueAndValueText.valueText}</div>
      `;
    }

    return html`<div class="entity-row">
      ${data.icon ? renderIcon(this.hass, data.icon) : nothing}

      <div class="gauge-content">
        ${!conf.hideTextBar ? this.renderTextBar(data) : nothing}
        ${this.renderValueBar()}
      </div>
    </div>`;
  }

  private renderValueBar() {
    const conf = this.config;
    const data = this.data;

    const borderRadiusFactor = ROUND_FACTORS[conf.round];

    const shouldRenderGradientBg =
      (conf.isSeverity && conf.gradientBackground) ||
      conf.mode === "gradient" ||
      conf.mode === "flat";

    return html`<div
      class="value-bar"
      style=${styleMap({
        "border-radius": borderRadiusFactor
          ? `calc(var(--bar-height) / ${borderRadiusFactor})`
          : undefined,
      })}
    >
      ${conf.isSeverity
        ? html`<div
            class="severity-background"
            style=${styleMap({
              background: conf.gradientBackground ? "#ffffff" : "#eeeeee",
            })}
          ></div>`
        : nothing}
      ${shouldRenderGradientBg
        ? html`<div
            class="gradient-background"
            style=${styleMap({
              background: `linear-gradient(to right, ${this.data.linearGradient})`,
            })}
          ></div>`
        : nothing}
      ${conf.isSeverity
        ? this.renderSeverityBar(
            borderRadiusFactor,
            conf.severityColorMode!,
            data.secondary
          )
        : nothing }
      ${data.minIndicator
        ? this.renderMinIndicator(data.minIndicator, data.secondary !== undefined)
        : nothing}
      ${data.maxIndicator
        ? this.renderMaxIndicator(data.maxIndicator, data.secondary !== undefined)
        : nothing}
      ${conf.isSeverity
        ? nothing
        : this.renderValueIndicator(data.secondary)}
      ${data.setpoint ? this.renderSetpointIndicator(data.setpoint) : nothing}
    </div>`;
  }

  private renderTextBar(data: EntityRenderData) {
    return html` <div class="text-bar">
      ${data.title
        ? html`<div class="text-bar-left">${data.title}</div>`
        : nothing}
      <div class="text-bar-right">
        ${data.setpoint?.label
          ? html`<div class="text-bar-right-setpoint">
              🎯 ${data.setpoint.label}
            </div>`
          : nothing}
        <div class="text-bar-right-value-text">
          ${data.setpoint?.label ? " - " : ""}
          ${data.secondary
            ? html`<span style="font-size: var(--ha-font-size-xs);">①</span>`
            : ""}
          ${data.valueAndValueText.valueText}
          ${data.secondary
            ? html` -
                <span style="font-size: var(--ha-font-size-xs);">②</span> ${data
                  .secondary.valueText}`
            : ""}
        </div>
      </div>
    </div>`;
  }

  private renderSeverityBar(
    borderRadiusFactor: number | undefined,
    severityColorMode: SeverityColorMode,
    secondary: SecondaryValueData | undefined
  ) {
    if (!this.data.severity) return nothing;
    borderRadiusFactor =
      borderRadiusFactor && secondary
        ? borderRadiusFactor * 1
        : borderRadiusFactor;

    const radius = borderRadiusFactor
      ? `calc(var(--bar-height) / ${borderRadiusFactor})`
      : undefined;

    const roundLeft =
      (this.config.severityCentered &&
        this.data.severity.offsetPercentage < 50) ??
      false;
    const roundRight =
      !this.config.severityCentered ||
      (this.config.severityCentered &&
        this.data.severity.offsetPercentage === 50);

    if (severityColorMode !== "gradient") {
      return html`
        ${this.data.severity.offsetPercentage === 50
          ? html`<div
              style=${styleMap({
                height: secondary ? "45%" : "100%",
                width: "50%",
              })}
            ></div>`
          : nothing}
        <div
          class="severity-value"
          style=${styleMap({
            background: this.data.severity.color,
            height: secondary ? "45%" : "100%",
            left: `${this.data.severity.offsetPercentage ?? 0}%`,
            width: `${this.data.percentage ?? 0}%`,
            "border-top-left-radius": roundLeft ? radius : undefined,
            "border-bottom-left-radius": roundLeft ? radius : undefined,
            "border-top-right-radius": roundRight ? radius : undefined,
            "border-bottom-right-radius": roundRight ? radius : undefined,
          })}
        ></div>

        ${secondary
          ? html`<div
              class="severity-value severity-secondary-value"
              style=${styleMap({
                background: this.data.secondary?.color,
                left: `${secondary.offsetPercentage ?? 0}%`,
                width: `${secondary.percentage ?? 0}%`,
                "border-top-left-radius": roundLeft ? radius : undefined,
                "border-bottom-left-radius": roundLeft ? radius : undefined,
                "border-top-right-radius": roundRight ? radius : undefined,
                "border-bottom-right-radius": roundRight ? radius : undefined,
              })}
            ></div>`
          : nothing}
      `;
    }

    const offset = this.data.severity.offsetPercentage;
    const percentage = this.data.percentage;

    const offsetSecondary = secondary?.offsetPercentage;
    const percentageSecondary = secondary?.percentage;

    return html`
      ${offset === 50
        ? html`<div
            style=${styleMap({
              height: secondary ? "45%" : "100%",
              width: "50%",
            })}
          ></div>`
        : nothing}
      <div
        class="severity-value"
        style=${styleMap({
          background: `linear-gradient(to right, ${this.data.severity.color})`,
          "background-size": "100cqw 100cqh",
          "background-position": `-${offset}cqw 0cqh`,
          "background-repeat": "no-repeat",
          height: secondary ? "45%" : "100%",
          left: `${offset ?? 0}%`,
          width: `${percentage ?? 0}%`,
          "border-top-left-radius": roundLeft ? radius : undefined,
          "border-bottom-left-radius": roundLeft ? radius : undefined,
          "border-top-right-radius": roundRight ? radius : undefined,
          "border-bottom-right-radius": roundRight ? radius : undefined,
        })}
      ></div>

      ${secondary
        ? html`<div
            class="severity-value severity-secondary-value"
            style=${styleMap({
              background: `linear-gradient(to right, ${this.data.severity.color})`,
              "background-size": "100cqw 100cqh",
              "background-position": `-${offsetSecondary}cqw 0cqh`,
              "background-repeat": "no-repeat",
              left: `${offsetSecondary ?? 0}%`,
              width: `${percentageSecondary ?? 0}%`,
              "border-top-left-radius": roundLeft ? radius : undefined,
              "border-bottom-left-radius": roundLeft ? radius : undefined,
              "border-top-right-radius": roundRight ? radius : undefined,
              "border-bottom-right-radius": roundRight ? radius : undefined,
            })}
          ></div>`
        : nothing}
    `;
  }

  private renderValueIndicator(secondary: SecondaryValueData | undefined) {
    return html` <div class="value-indicator">
      <svg
        viewBox="-1 -1 2 2"
        xmlns="http://www.w3.org/2000/svg"
        class="value-indicator-svg"
        style=${styleMap({
          left: `${this.data.percentage ?? 0}%`,
        })}
      >
        <path
          d="${this.data.customShapeValue ??
          (secondary
            ? DEFAULTS.svg.value.secondary
            : DEFAULTS.svg.value.single)}"
          style=${styleMap({
            fill: "#d6d6d6",
            stroke: "#4e4e4e",
            "stroke-width": secondary ? "0.15" : "0.25",
          })}
        ></path>
      </svg>
      ${secondary
        ? html`<svg
            viewBox="-1 -1 2 2"
            xmlns="http://www.w3.org/2000/svg"
            class="value-indicator-svg"
            style=${styleMap({
              left: `${secondary.percentage ?? 0}%`,
              transform: "translateX(-50%) rotate(180deg)",
              stroke: "#4e4e4e",
              "stroke-width": secondary ? "0.15" : "0.25",
            })}
          >
            <path
              d="${secondary.customShape ?? DEFAULTS.svg.value.secondary}"
              style="
                fill: #d6d6d6;
              "
            ></path>
          </svg>`
        : nothing}
    </div>`;
  }

  private renderMinIndicator(data: MinMaxIndicatorData, secondary: boolean = false) {
    if (data.customShape) {
      return html` <div class="value-indicator">
        <svg
          viewBox="-1 -1 2 2"
          xmlns="http://www.w3.org/2000/svg"
          class="value-indicator-svg"
          style=${styleMap({
            left: `${data.percentage ?? 0}%`,
          })}
        >
          <path
            d="${data.customShape}"
            style=${styleMap({
              fill: data.color,
              opacity: data.opacity,
            })}
          ></path>
        </svg>
      </div>`;
    }

    return html`<div
      class="min-indicator"
      style=${styleMap({
        height: secondary ? "45%" : "100%",
        width: `${data.percentage ?? 0}%`,
        background: data.color,
        opacity: data.opacity,
      })}
    ></div>`;
  }

  private renderMaxIndicator(data: MinMaxIndicatorData, secondary: boolean = false) {
    if (data.customShape) {
      return html` <div class="value-indicator">
        <svg
          viewBox="-1 -1 2 2"
          xmlns="http://www.w3.org/2000/svg"
          class="value-indicator-svg"
          style=${styleMap({
            left: `${data.percentage ?? 0}%`,
          })}
        >
          <path
            d="${data.customShape}"
            style=${styleMap({
              fill: data.color,
              opacity: data.opacity,
            })}
          ></path>
        </svg>
      </div>`;
    }

    return html`<div
      class="max-indicator"
      style=${styleMap({
        height: secondary ? "45%" : "100%",
        left: `${data.percentage ?? 0}%`,
        background: data.color,
        opacity: data.opacity,
      })}
    ></div>`;
  }

  private renderSetpointIndicator(data: SetpointData) {
    return html` <div class="value-indicator">
      <svg
        viewBox="-1 -1 2 2"
        xmlns="http://www.w3.org/2000/svg"
        class="value-indicator-svg"
        style=${styleMap({
          left: `${data.percentage ?? 0}%`,
        })}
      >
        <path
          d="${data.customShape ?? DEFAULTS.svg.setpoint}"
          style=${styleMap({
            fill: data.color,
          })}
        ></path>
      </svg>
    </div>`;
  }

  static get styles(): CSSResultGroup {
    return horizontalRowStyles;
  }
}
