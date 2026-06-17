/* eslint-disable @typescript-eslint/no-explicit-any */
// External dependencies
import hash from "object-hash/dist/object_hash";
import type { UnsubscribeFunc } from "home-assistant-js-websocket";
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

// Core HA helpers
import type { HomeAssistant, LovelaceCard } from "../dependencies/ha";
import { subscribeRenderTemplate } from "../dependencies/ha";
import { isTemplate as _isTemplate } from "../dependencies/ha/common/string/has-template";

// Internalized external dependencies
import { computeDarkMode, registerCustomCard } from "../dependencies/mushroom";

// Local utilities
import * as Logger from "../utils/logger";
import { getValueFromPath } from "../utils/object/get-value";

// Local constants & types
import { LOGGER_SETTINGS, VERSION } from "../constants/logger";
import type { GetValueFn, TemplateResults } from "./types/template";
import { getTemplateKeys, templateCache } from "./types/template";
import {
  CardOrientation,
  ComputedEntityConfig,
  EntityRenderData,
  LightDarkModeColor,
} from "./types/types";
import { DEFAULTS } from "../constants/defaults";
import { BarGaugeCardProCardConfig } from "./config";

import "./components/horizontal/gauge-horizontal";
import { isValidSvgPath } from "../dependencies/is-svg-path/valid-svg-path";
import { cardStyles } from "./css/card";
import { processConfigUpdate } from "./config-update/process-config-update";
import {
  ComputeDataContext,
  ProcessConfigUpdateContext,
} from "./types/contexts";
import { computeData } from "./data/compute-data";

//=============================================================================
// CARD REGISTRATION
//=============================================================================

registerCustomCard({
  type: "bar-gauge-card-pro",
  name: "Bar Gauge Card Pro",
  description: "Build beautiful Bar Gauge cards using gradients and templates",
});

//=============================================================================
// CARD
//=============================================================================

@customElement("bar-gauge-card-pro")
export class BarGaugeCardProCard extends LitElement implements LovelaceCard {
  constructor() {
    super();
    Logger.initializeLogger(VERSION);
  }

  public readonly log = Logger.createLogger();

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() _config?: BarGaugeCardProCardConfig;

  header?: string;

  hideAllTextBars = false;
  hideBackground = false;

  compact = false;

  orientation: CardOrientation = "horizontal";

  computedConfig: ComputedEntityConfig[] = [];
  renderData: EntityRenderData[] = [];

  // Template handling
  private _templatedKeys: Set<string> = new Set();
  private _nonTemplatedTemplateKeysCache = new Map<string, any>();
  @state() private _templateResults?: TemplateResults;
  @state() private readonly _unsubRenderTemplates: Map<
    string,
    Promise<UnsubscribeFunc>
  > = new Map();

  public getCardSize(): number {
    return 3;
  }

  public setConfig(config: BarGaugeCardProCardConfig): void {
    if (config.log_debug === true) {
      this.log.setLogLevel(Logger.LogLevel.DEBUG);
    } else {
      this.log.setLogLevel(LOGGER_SETTINGS.DEFAULT_LOG_LEVEL);
    }

    processConfigUpdate(this as unknown as ProcessConfigUpdateContext, config);

    // Template handling
    // Determine templated keys for quicker access to templates
    // Cache non-templated template keys as they are fixed values
    this._templatedKeys = new Set<string>();
    this._nonTemplatedTemplateKeysCache = new Map<string, any>();

    getTemplateKeys(config).forEach((key) => {
      const currentKeyValue = getValueFromPath(this._config, key);
      const newKeyValue = getValueFromPath(config, key);

      if (
        newKeyValue !== currentKeyValue ||
        this._config?.entity != config.entity ||
        this._config?.entity2 != config.entity2
      ) {
        this._tryDisconnectKey(key);
      }

      if (newKeyValue !== undefined) {
        if (_isTemplate(String(newKeyValue))) {
          this._templatedKeys.add(key);
        } else {
          this._nonTemplatedTemplateKeysCache.set(key, newKeyValue);
        }
      }
    });

    this._config = config;
  }

  //=============================================================================
  // LIT LIFECYCLE
  //=============================================================================

  public override connectedCallback() {
    super.connectedCallback();
    this._tryConnect();
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();
    this._tryDisconnect();

    if (this._config && this._templateResults) {
      const key = this._computeCacheKey();
      templateCache.set(key, this._templateResults);
    }
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);
    if (!this._config || !this.hass) return;

    if (!this._templateResults) {
      const key = this._computeCacheKey();
      if (templateCache.has(key)) {
        this._templateResults = templateCache.get(key)!;
      } else {
        this._templateResults = {};
      }
    }

    const configChanged = changedProperties.has("_config");
    const hassChanged = changedProperties.has("hass");
    const templateResultsChanged = changedProperties.has("_templateResults");
    if (!configChanged && !hassChanged && !templateResultsChanged) return;

    computeData(this as unknown as ComputeDataContext);
  }

  private getValidatedSvgPath(key: string): string | undefined {
    const path = this.getValue<string>(key);
    return path === "" || isValidSvgPath(path) ? path : undefined;
  }

  protected override render() {
    return html`
      <ha-card
        style=${styleMap({
          "--bar-height": DEFAULTS.ui.barHeight,
          ...(this.hideBackground
            ? { background: "none", border: "none", "box-shadow": "none" }
            : {}),
        })}
      >
        ${this.renderHeader()}
        ${this.orientation === "horizontal"
          ? html`<bar-gauge-horizontal
              .hass=${this.hass}
              .compact=${this.compact}
              .config=${this.computedConfig}
              .data=${this.renderData}
              class="card-content"
            >
            </bar-gauge-horizontal>`
          : html`<bar-gauge-vertical
              .config=${this.computedConfig}
              .data=${this.renderData}
              .hass=${this.hass}
            >
            </bar-gauge-vertical>`}
      </ha-card>
    `;
  }

  private renderHeader(): TemplateResult | typeof nothing {
    return this.header
      ? html`<h1 class="card-header">${this.header}</h1>`
      : nothing;
  }

  //=============================================================================
  // TEMPLATE HANDLING
  //=============================================================================

  private _tryConnect(): void {
    this._templatedKeys.forEach((key) => {
      this._tryConnectKey(key);
    });
  }

  private async _tryConnectKey(key: string): Promise<void> {
    if (
      this._unsubRenderTemplates.get(key) !== undefined ||
      !this.hass ||
      !this._config ||
      !this.isTemplate(key)
    ) {
      return;
    }

    const key_value = getValueFromPath(this._config, key);

    try {
      const sub = subscribeRenderTemplate(
        this.hass.connection,
        (result) => {
          this._templateResults = {
            ...this._templateResults,
            [key]: result,
          };
        },
        {
          template: String(key_value),
          entity_ids: this._config.entity_id,
          variables: {
            config: this._config,
            user: this.hass.user!.name,
          },
          strict: true,
        }
      );
      this._unsubRenderTemplates.set(key, sub);
      await sub;
    } catch {
      const result = {
        result: String(key_value ?? ""),
        listeners: {
          all: false,
          domains: [],
          entities: [],
          time: false,
        },
      };
      this._templateResults = {
        ...this._templateResults,
        [key]: result,
      };
      this._unsubRenderTemplates.delete(key);
    }
  }

  private _tryDisconnect(): void {
    Array.from(this._unsubRenderTemplates.keys()).forEach((key) => {
      this._tryDisconnectKey(key);
    });
  }

  private async _tryDisconnectKey(key: string): Promise<void> {
    const unsubRenderTemplate = this._unsubRenderTemplates.get(key);
    if (!unsubRenderTemplate) return;

    try {
      const unsub = await unsubRenderTemplate;
      unsub();
      this._unsubRenderTemplates.delete(key);
    } catch (err: any) {
      if (err.code === "not_found" || err.code === "template_error") {
        // If we get here, the connection was probably already closed. Ignore.
      } else {
        throw err;
      }
    }
  }

  private isTemplate(key: string): boolean {
    if (key === undefined) return false;
    if (this._templatedKeys?.size) return this._templatedKeys.has(key);
    return _isTemplate(String(getValueFromPath(this._config, key)));
  }

  public getValueBound = ((key) => this.getValue(key)) as GetValueFn;
  public getValue<T = unknown>(key: string): T | undefined {
    // Use .get() directly instead of .has() + .get() (reduces Map operations)
    let value = this._nonTemplatedTemplateKeysCache?.get(key);
    if (value !== undefined) return value as T;

    value = this.isTemplate(key)
      ? this._templateResults?.[key]?.result
      : getValueFromPath(this._config, key);

    return value as T;
  }

  public getLightDarkModeColor(key: string): string | undefined {
    const configColor = this.getValue<string | LightDarkModeColor>(key);
    if (
      typeof configColor === "object" &&
      configColor !== null &&
      "light_mode" in configColor &&
      "dark_mode" in configColor
    ) {
      return computeDarkMode(this.hass)
        ? configColor.dark_mode
        : configColor.light_mode;
    }

    if (typeof configColor === "string") {
      return configColor;
    }
    return undefined;
  }

  private _computeCacheKey() {
    return hash(this._config);
  }

  static get styles(): CSSResultGroup {
    return cardStyles;
  }
}
