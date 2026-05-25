import { HomeAssistant } from "../../dependencies/ha";
import { Logger } from "../../utils/logger";
import { BarGaugeCardProCardConfig } from "../config";
import { GetValueFn } from "./template";
import {
  CardOrientation,
  ComputedEntityConfig,
  EntityRenderData,
} from "./types";

export interface ProcessConfigUpdateContext {
  readonly _config: BarGaugeCardProCardConfig;

  header?: string;

  hideAllTextBars: boolean;
  hideBackground: boolean;

  orientation: CardOrientation;

  computedConfig: ComputedEntityConfig[];
}

export interface ComputeDataContext {
  readonly hass: HomeAssistant;
  readonly _config: BarGaugeCardProCardConfig;

  log: Logger;

  computedConfig: ComputedEntityConfig[];
  renderData: EntityRenderData[];

  getValueBound: GetValueFn;
  getValue<T = unknown>(key: string): T | undefined;

  getLightDarkModeColor(key: string): string | undefined;

  getValidatedSvgPath(key: string): string | undefined;
}
