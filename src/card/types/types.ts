// External dependencies
import { z } from "zod";

//=============================================================================
// GENERIC TYPES
//=============================================================================

export type LightDarkModeColor = {
  light_mode: string;
  dark_mode: string;
};

//=============================================================================
// CARD TYPES
//=============================================================================

export type CardOrientation = "horizontal" | "vertical";
export type RoundStyle = "off" | "full" | "medium" | "small";

//=============================================================================
// ENTITY TYPES
//=============================================================================

export type EntityMode = "flat" | "gradient" | "severity";
export type GradientResolution = "auto" | number;
export type SeverityColorMode = "basic" | "interpolation" | "gradient";

export type ComputedEntityConfig = {
  gradient: boolean | undefined;
  gradientBackground: boolean | undefined;
  gradientBackgroundOpacity?: number;
  gradientResolution?: GradientResolution;

  isSeverity: boolean;
  severityColorMode: SeverityColorMode | undefined;
  severityCentered: boolean | undefined;

  mode: EntityMode;

  hideTextBar: boolean;

  round: RoundStyle;

  unit_before_value: boolean;
};

export type EntityRenderData = {
  title: string | undefined;

  min: number;
  max: number;
  valueAndValueText: ValueAndValueText;
  percentage: number;

  linearGradient: string | undefined;

  severity?: SeverityData;

  setpoint?: SetpointData;

  icon?: IconData;

  secondary?: SecondaryValueData;
};

// Pos is considered the standard in the code. From is only used to transform to pos
export type BarSegment = {
  pos: number;
  color: string;
};
export type BarSegmentFrom = {
  from: number;
  color: string;
};

export type LinearGradientSegment = {
  percentage: number;
  color: string | undefined;
};

export type IconData = {
  icon: string;
  color?: string;
};

export type SeverityData = {
  offsetPercentage: number;
  color: string | undefined;
};

export type SetpointData = {
  percentage: number;
  label: string | undefined;
};

export type SecondaryValueData = {
  percentage: number;
  offsetPercentage: number | undefined;
  color: string | undefined;
  valueText: string;
};

// Used to validate config `segments`
const percentage_regex = /^-?\d+(?:\.\d+)?%$/g;
export const BarSegmentSchemaFrom = z.object({
  from: z.union([z.coerce.number(), z.string().regex(percentage_regex)]),
  color: z.coerce.string(),
});
export const BarSegmentSchemaPos = z.object({
  pos: z.union([z.coerce.number(), z.string().regex(percentage_regex)]),
  color: z.coerce.string(),
});

export type ValueAndValueText = {
  value: number | undefined;
  valueText: string;
  unit_of_measurement?: string;
};
