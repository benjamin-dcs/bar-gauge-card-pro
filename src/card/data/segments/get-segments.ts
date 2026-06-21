// Internalized external dependencies
import type { Logger } from "../../../utils/logger";

// Local utilities
import { getInterpolatedColor } from "../../../utils/color/get-interpolated-color";
import type {
  GradientResolution,
  LinearGradientSegment,
  SeverityColorMode,
} from "../../types/types";

// Local constants & types
import { getThemeColors } from "../../../constants/theme";
import type { GetValueFn } from "../../types/template";

import {
  getInterpolatedLinearGradientSegments,
  getLinearGradientSegments,
  getSegments,
} from "./core";

export function getLinearGradientString(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  row: number,
  min: number,
  max: number,
  resolution: GradientResolution,
  opacity: number | undefined,
  fromMidpoints = false
): string {
  const linearSegments =
    resolution === "auto"
      ? getLinearGradientSegments(
          log,
          getTemplateKeyValue,
          row,
          min,
          max,
          fromMidpoints
        )
      : getInterpolatedLinearGradientSegments(
          log,
          getTemplateKeyValue,
          row,
          min,
          max,
          resolution,
          fromMidpoints
        );

  let parts: string[] = [];
  if (opacity === undefined) {
    for (let i = 0; i < linearSegments.length; i++) {
      parts.push(
        `color-mix(in srgb, ${linearSegments[i].color} 100%, transparent) ${linearSegments[i].percentage}%`
      );

      if (resolution !== "auto") {
        if (i + 1 < linearSegments.length) {
          parts.push(
            `color-mix(in srgb, ${linearSegments[i].color} 100%, transparent) ${linearSegments[i + 1].percentage}%`
          );
        } else {
          parts.push(
            `color-mix(in srgb, ${linearSegments[i].color} 100%, transparent) 100%`
          );
        }
      }
    }
  } else {
    parts = linearSegments.map(
      ({ color, percentage }) =>
        `color-mix(in srgb, ${color} ${opacity * 100}%, transparent) ${percentage}%`
    );
  }

  return parts.join(", ");
}

/**
 * Compute the segment color at a specific value
 */
export function computeSeverity(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  severity_color_mode: SeverityColorMode,
  row: number,
  min: number,
  max: number,
  value: number,
  clamp_min = false
): string | undefined {
  if (clamp_min) value = Math.max(value, min);

  const interpolation = severity_color_mode === "interpolation";
  if (interpolation) {
    const gradienSegments = getLinearGradientSegments(
      log,
      getTemplateKeyValue,
      row,
      min,
      max,
      true
    );
    return getInterpolatedColor({
      gradientSegments: gradienSegments,
      min: min,
      max: max,
      value: Math.min(value, max), // beyond max, the gauge shows max. Also needed for getInterpolatedColor
    });
  } else {
    return getSegmentColor(log, getTemplateKeyValue, row, min, max, value);
  }
}

/**
 * Get the configured segment color at a specific value
 */
function getSegmentColor(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  row: number,
  min: number,
  max: number,
  value: number
): string {
  const segments = getSegments(log, getTemplateKeyValue, row, min, max);
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (
      segment &&
      value >= segment.pos &&
      (i + 1 === segments.length || value < segments[i + 1]?.pos)
    ) {
      return segment.color;
    }
  }
  return getThemeColors().info; // should never happen, but just in case
}

export function getFlatLinearGradientString(
  log: Logger,
  getTemplateKeyValue: GetValueFn,
  row: number,
  min: number,
  max: number
): string {
  const segments = getSegments(log, getTemplateKeyValue, row, min, max);
  const numSegments = segments.length;

  if (numSegments < 2) {
    return segments[0].color;
  }

  const diff = max - min;
  const linearSegments: LinearGradientSegment[] = [];

  for (let i = 0; i < numSegments; i++) {
    const level = segments[i].pos;
    const color = segments[i].color;
    let percentage: number;

    if (level <= min) {
      if (i + 1 < numSegments) {
        const nextLevel = segments[i + 1].pos;
        if (nextLevel <= min) {
          // both current level and next level are invisible -> skip
          continue;
        }
      }
      percentage = 0;
    } else if (level >= max) {
      break;
    } else {
      percentage = ((level - min) / diff) * 100;
    }

    linearSegments.push({ percentage: percentage, color: color });
  }

  // Solidify segments
  const parts: string[] = [];
  for (let i = 0; i < linearSegments.length; i++) {
    parts.push(`${linearSegments[i].color} ${linearSegments[i].percentage}%`);

    if (i + 1 < linearSegments.length) {
      parts.push(
        `${linearSegments[i].color} ${linearSegments[i + 1].percentage}%`
      );
    } else {
      parts.push(`${linearSegments[i].color} 100%`);
    }
  }

  return parts.join(", ");
}
