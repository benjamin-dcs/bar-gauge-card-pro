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

type MinMaxIndicatorConfig = {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
  attribute?: string;
  opacity?: number;
  label?: boolean;
  label_color?: string | LightDarkModeColor;
  precision?: number;
};

type SetpointConfig = {
  type: string;
  color?: string | LightDarkModeColor;
  value: number | string;
  attribute?: string;
  label?: boolean;
  precision?: number;
};

export type IconConfig = {
  icon: string;
  icon_color?: string;
};

type ShapesConfig = {
  value?: string;
  min_indicator?: string;
  max_indicator?: string;
  setpoint?: string;

  secondary_value?: string;
  secondary_min_indicator?: string;
  secondary_max_indicator?: string;
  secondary_setpoint?: string;
};

type SecondaryConfig = {
  value: string;
  min_indicator?: MinMaxIndicatorConfig;
  max_indicator?: MinMaxIndicatorConfig;
  setpoint?: SetpointConfig;
};

export type BarGaugeEntity = {
  entity?: string;
  attribute?: string;
  min?: number | string;
  max?: number | string;
  value?: string;

  secondary?: SecondaryConfig;

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

  icon?: IconConfig;

  min_indicator?: MinMaxIndicatorConfig;
  max_indicator?: MinMaxIndicatorConfig;
  setpoint?: SetpointConfig;

  hide_text_bar?: boolean;

  unit_of_measurement?: string;
  unit_before_value?: boolean;

  title?: string;

  shapes?: ShapesConfig;
};

export type BarGaugeCardProCardConfig = LovelaceCardConfig & {
  header?: string;
  entities?: BarGaugeEntity[];

  orientation?: CardOrientation;
  compact?: boolean;

  hide_background?: boolean;
  hide_all_text_bars?: boolean;

  log_debug?: boolean;
};
