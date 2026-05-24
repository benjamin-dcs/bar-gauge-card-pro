// Core HA helpers
import type { LovelaceCardConfig } from "../dependencies/ha";
import {
  BarSegment,
  BarSegmentFrom,
  CardOrientation,
  GradientResolution,
  LightDarkModeColor,
  RoundStyle,
  SeverityColorMode,
} from "./types/types";

interface MinMaxIndicatorConfig {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
  attribute?: string;
  opacity?: number;
  label?: boolean;
  label_color?: string | LightDarkModeColor;
  precision?: number;
}

interface SetpointConfig {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
  attribute?: string;
  label?: boolean;
  precision?: number;
}

export interface IconConfig {
  icon: string;
  icon_color?: string;
}

export type BarGaugeEntity = {
  entity?: string;
  attribute?: string;
  min?: number | string;
  max?: number | string;
  value?: string;
  value_secondary?: string;

  round?: RoundStyle;
  bar_size?: number;

  segments?: BarSegment[] | BarSegmentFrom[] | string;

  severity?: boolean;
  severity_centered?: boolean;
  severity_color_mode?: SeverityColorMode;

  gradient?: boolean;
  gradient_background?: boolean;
  gradient_background_opacity?: number;
  gradient_resolution?: GradientResolution;

  min_indicator?: MinMaxIndicatorConfig;
  max_indicator?: MinMaxIndicatorConfig;
  setpoint?: SetpointConfig;

  hide_text_bar?: boolean;

  unit_of_measurement?: string;
  unit_before_value?: boolean;

  title?: string;
};

export type BarGaugeCardProCardConfig = LovelaceCardConfig & {
  header?: string;
  entities?: BarGaugeEntity[];

  orientation?: CardOrientation;

  hide_background?: boolean;
  hide_all_text_bars?: boolean;

  log_debug?: boolean;
};
