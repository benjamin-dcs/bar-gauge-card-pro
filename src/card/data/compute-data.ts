// Core HA helpers
import { getValueInPercentage, normalize } from "../../dependencies/ha";

// Local utilities
import { NumberUtils } from "../../utils/number/numberUtils";
import { deepEqual } from "../../utils/object/deep-equal";
import {
  getSecondaryValueAndValueText,
  getValueAndValueText,
} from "./get-value-and-valueText";
import { getSetpoint } from "./get-setpoint";
import {
  computeSeverity,
  getFlatLinearGradientString,
  getLinearGradientString,
} from "./segments/get-segments";

// Local constants & types
import { DEFAULTS } from "../../constants/defaults";
import type { BarGaugeEntity } from "../config";
import type { ComputeDataContext } from "../types/contexts";
import type {
  EntityMode,
  EntityRenderData,
  IconData,
  MinMaxIndicatorData,
  SecondaryValueData,
  SetpointData,
  SeverityColorMode,
  SeverityData,
} from "../types/types";
import { getMinMaxIndicator } from "./get-min-max-indicator";

export function computeData(card: ComputeDataContext) {
  if (!card._config.entities) return;

  const candidates: EntityRenderData[] = card._config.entities.map(
    (_entity: BarGaugeEntity, row: number) => {
      const config = card.computedConfig[row];

      const title = !config.hideTextBar ? getEntityTitle(card, row) : undefined;

      const min = NumberUtils.toNumberOrDefault(
        card.getValue(`entities[${row}].min`),
        DEFAULTS.values.min
      );
      const max = NumberUtils.toNumberOrDefault(
        card.getValue(`entities[${row}].max`),
        DEFAULTS.values.max
      );

      const valueAndValueText = getValueAndValueText(
        card.hass,
        card._config,
        card.getValueBound,
        row
      );

      let percentage = getValueInPercentage(
        normalize(valueAndValueText.value ?? min, min, max),
        min,
        max
      );

      let offset = 0;
      let linearGradient: string | undefined = undefined;
      let severity: SeverityData | undefined = undefined;

      if (config.mode === "severity") {
        const color =
          config.severityColorMode !== "gradient"
            ? computeSeverity(
                card.log,
                card.getValueBound,
                config.severityColorMode!,
                row,
                min,
                max,
                valueAndValueText.value ?? min,
                true
              )
            : getLinearGradientString(
                card.log,
                card.getValueBound,
                row,
                min,
                max,
                config.gradientResolution!,
                undefined
              );

        if (config.gradientBackground) {
          linearGradient = getLinearGradientString(
            card.log,
            card.getValueBound,
            row,
            min,
            max,
            config.gradientResolution!,
            config.gradientBackgroundOpacity
          );
        }

        if (config.severityCentered) {
          if (percentage < 50) {
            offset = percentage;
            percentage = 50 - percentage;
          } else {
            offset = 50;
            percentage = percentage - 50;
          }
        }

        severity = { offsetPercentage: offset, color };
      } else if (config.mode === "gradient") {
        linearGradient = getLinearGradientString(
          card.log,
          card.getValueBound,
          row,
          min,
          max,
          config.gradientResolution!,
          undefined
        );
      } else {
        linearGradient = getFlatLinearGradientString(
          card.log,
          card.getValueBound,
          row,
          min,
          max
        );
      }

      let iconData: IconData | undefined = undefined;
      const _icon = card.getValue<string>(`entities[${row}].icon.icon`);
      if (_icon) {
        // [TODO] replace with getValueFromPath
        const color =
          card.getValue<string>(`entities[${row}].icon.icon_color`) ??
          DEFAULTS.ui.iconColor;
        iconData = {
          icon: _icon,
          color: color,
        };
      }

      let minIndicatorData: MinMaxIndicatorData | undefined = undefined;
      const _minIndicator = getMinMaxIndicator(
        card,
        row,
        "primary",
        "min_indicator"
      );
      if (_minIndicator) {
        const minIndicatorValue = _minIndicator.value;
        const minIndicatorPercentage = getValueInPercentage(
          normalize(minIndicatorValue ?? min, min, max),
          min,
          max
        );
        minIndicatorData = {
          percentage: minIndicatorPercentage,
          ..._minIndicator,
        };
      }

      let maxIndicatorData: MinMaxIndicatorData | undefined = undefined;
      const _maxIndicator = getMinMaxIndicator(
        card,
        row,
        "primary",
        "max_indicator"
      );
      if (_maxIndicator) {
        const maxIndicatorValue = _maxIndicator.value;
        const maxIndicatorPercentage = getValueInPercentage(
          normalize(maxIndicatorValue ?? max, min, max),
          min,
          max
        );
        maxIndicatorData = {
          percentage: maxIndicatorPercentage,
          ..._maxIndicator,
        };
      }

      let setpointData: SetpointData | undefined = undefined;
      const _setpoint = getSetpoint(card, row, "primary");
      if (_setpoint) {
        const setpointValue = _setpoint.value;
        const setpointPercentage = getValueInPercentage(
          normalize(setpointValue ?? min, min, max),
          min,
          max
        );
        setpointData = {
          percentage: setpointPercentage,
          ..._setpoint,
        };
      }

      const customShapeValue = card.getValidatedSvgPath(
        `entities[${row}].shapes.value`
      );

      const dataSecondary = computeSecondaryData(
        card,
        row,
        config.mode,
        config.mode === "severity"
          ? {
              isCentered: config.severityCentered!,
              colorMode: config.severityColorMode!,
            }
          : undefined,
        {
          unit_of_measurement: valueAndValueText.unit_of_measurement ?? "",
          unit_before_value: config.unit_before_value,
          min: min,
          max: max,
        }
      );

      return {
        icon: iconData,
        title,
        min,
        max,
        valueAndValueText,
        percentage,
        linearGradient,
        severity,
        minIndicator: minIndicatorData,
        maxIndicator: maxIndicatorData,
        setpoint: setpointData,
        customShapeValue: customShapeValue,
        secondary: dataSecondary,
      };
    }
  );

  if (
    candidates.some(
      (candidate, index) => !deepEqual(card.renderData[index], candidate)
    )
  ) {
    card.renderData = candidates;
  }
}

function getEntityTitle(
  card: ComputeDataContext,
  row: number
): string | undefined {
  const configValue = card.getValue<string>(`entities[${row}].title`);
  if (configValue === "" || configValue !== undefined) return configValue;

  let stateObj;
  const entity = card._config?.entities?.[row].entity;
  if (entity !== undefined) stateObj = card.hass?.states[entity];
  return stateObj?.attributes.friendly_name;
}

function computeSecondaryData(
  card: ComputeDataContext,
  row: number,
  mode: EntityMode,
  severityData:
    | {
        isCentered: boolean;
        colorMode: SeverityColorMode;
      }
    | undefined,
  primaryValueData: {
    unit_of_measurement: string;
    unit_before_value: boolean;
    min: number;
    max: number;
  }
): SecondaryValueData | undefined {
  const valueAndValueText = getSecondaryValueAndValueText(
    card.hass,
    card.getValueBound,
    row,
    primaryValueData.unit_of_measurement,
    primaryValueData.unit_before_value
  );

  if (!valueAndValueText) return undefined;

  const min = primaryValueData.min;
  const max = primaryValueData.max;

  let percentage = getValueInPercentage(
    normalize(valueAndValueText.value ?? min, min, max),
    min,
    max
  );

  let color: string | undefined = undefined;
  let offset: number | undefined = undefined;

  if (mode === "severity") {
    color =
      percentage != null
        ? computeSeverity(
            card.log,
            card.getValueBound,
            severityData!.colorMode,
            row,
            min,
            max,
            valueAndValueText?.value ?? min,
            true
          )
        : undefined;

    if (severityData!.isCentered) {
      if (percentage != null) {
        if (percentage < 50) {
          offset = percentage;
          percentage = 50 - percentage;
        } else {
          offset = 50;
          percentage = percentage - 50;
        }
      }
    }
  }

  let minIndicatorData: MinMaxIndicatorData | undefined = undefined;
  const _minIndicator = getMinMaxIndicator(
    card,
    row,
    "secondary",
    "min_indicator"
  );
  if (_minIndicator) {
    const minIndicatorValue = _minIndicator.value;
    const minIndicatorPercentage = getValueInPercentage(
      normalize(minIndicatorValue ?? min, min, max),
      min,
      max
    );
    minIndicatorData = {
      percentage: minIndicatorPercentage,
      ..._minIndicator,
    };
  }

  let maxIndicatorData: MinMaxIndicatorData | undefined = undefined;
  const _maxIndicator = getMinMaxIndicator(
    card,
    row,
    "secondary",
    "max_indicator"
  );
  if (_maxIndicator) {
    const maxIndicatorValue = _maxIndicator.value;
    const maxIndicatorPercentage = getValueInPercentage(
      normalize(maxIndicatorValue ?? max, min, max),
      min,
      max
    );
    maxIndicatorData = {
      percentage: maxIndicatorPercentage,
      ..._maxIndicator,
    };
  }

  let setpointData: SetpointData | undefined = undefined;
  const _setpoint = getSetpoint(card, row, "secondary");
  if (_setpoint) {
    const setpointValue = _setpoint.value;
    const setpointPercentage = getValueInPercentage(
      normalize(setpointValue ?? min, min, max),
      min,
      max
    );
    setpointData = {
      percentage: setpointPercentage,
      ..._setpoint,
    };
  }

  return {
    percentage: percentage,
    offsetPercentage: offset,
    color: color,
    valueText: valueAndValueText.valueText,
    customShape: card.getValidatedSvgPath(
      `entities[${row}].shapes.valueSecondary`
    ),
    minIndicator: minIndicatorData,
    maxIndicator: maxIndicatorData,
    setpoint: setpointData,
  };
}
