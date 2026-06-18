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
  EntityRenderData,
  IconData,
  MinMaxIndicatorData,
  SecondaryValueData,
  SetpointData,
  SeverityData,
} from "../types/types";
import { getMinMaxIndicator } from "./get-min-max-indicator";

export function computeData(card: ComputeDataContext) {
  if (!card._config.entities) return;

  const candidates: EntityRenderData[] = card._config.entities.map(
    (_entity: BarGaugeEntity, index: number) => {
      const config = card.computedConfig[index];

      const title = !config.hideTextBar
        ? getEntityTitle(card, index)
        : undefined;

      const min = NumberUtils.toNumberOrDefault(
        card.getValue(`entities[${index}].min`),
        DEFAULTS.values.min
      );
      const max = NumberUtils.toNumberOrDefault(
        card.getValue(`entities[${index}].max`),
        DEFAULTS.values.max
      );

      const valueAndValueText = getValueAndValueText(
        card.hass,
        card._config,
        card.getValueBound,
        index
      );
      const valueAndValueTextSecondary = getSecondaryValueAndValueText(
        card.hass,
        card.getValueBound,
        index,
        valueAndValueText.unit_of_measurement,
        config.unit_before_value
      );

      let percentage = getValueInPercentage(
        normalize(valueAndValueText.value ?? min, min, max),
        min,
        max
      );
      let percentageSecondary = valueAndValueTextSecondary
        ? getValueInPercentage(
            normalize(valueAndValueTextSecondary.value ?? min, min, max),
            min,
            max
          )
        : undefined;

      let offset = 0;
      let linearGradient: string | undefined = undefined;
      let severity: SeverityData | undefined = undefined;

      let colorSecondary: string | undefined = undefined;
      let offsetSecondary: number | undefined = undefined;

      if (config.mode === "severity") {
        const color =
          config.severityColorMode !== "gradient"
            ? computeSeverity(
                card.log,
                card.getValueBound,
                config.severityColorMode!,
                index,
                min,
                max,
                valueAndValueText.value ?? min,
                true
              )
            : getLinearGradientString(
                card.log,
                card.getValueBound,
                index,
                min,
                max,
                config.gradientResolution!,
                undefined
              );

        colorSecondary =
          percentageSecondary != null
            ? computeSeverity(
                card.log,
                card.getValueBound,
                config.severityColorMode!,
                index,
                min,
                max,
                valueAndValueTextSecondary?.value ?? min,
                true
              )
            : undefined;

        if (config.gradientBackground) {
          linearGradient = getLinearGradientString(
            card.log,
            card.getValueBound,
            index,
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

          if (percentageSecondary != null) {
            if (percentageSecondary < 50) {
              offsetSecondary = percentageSecondary;
              percentageSecondary = 50 - percentageSecondary;
            } else {
              offsetSecondary = 50;
              percentageSecondary = percentageSecondary - 50;
            }
          }
        }

        severity = { offsetPercentage: offset, color };
      } else if (config.mode === "gradient") {
        linearGradient = getLinearGradientString(
          card.log,
          card.getValueBound,
          index,
          min,
          max,
          config.gradientResolution!,
          undefined
        );
      } else {
        linearGradient = getFlatLinearGradientString(
          card.log,
          card.getValueBound,
          index,
          min,
          max
        );
      }

      let iconData: IconData | undefined = undefined;
      const _icon = card.getValue<string>(`entities[${index}].icon.icon`);
      if (_icon) {
        // [TODO] replace with getValueFromPath
        const color =
          card.getValue<string>(`entities[${index}].icon.icon_color`) ??
          DEFAULTS.ui.iconColor;
        iconData = {
          icon: _icon,
          color: color,
        };
      }

      let minIndicatorData: MinMaxIndicatorData | undefined = undefined;
      const _minIndicator = getMinMaxIndicator(card, index, "min_indicator");
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
      const _maxIndicator = getMinMaxIndicator(card, index, "max_indicator");
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
      const _setpoint = getSetpoint(card, index);
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

      const dataSecondary: SecondaryValueData | undefined =
        percentageSecondary != null
          ? {
              percentage: percentageSecondary,
              offsetPercentage: offsetSecondary,
              color: colorSecondary,
              valueText: valueAndValueTextSecondary!.valueText,
              customShape: card.getValidatedSvgPath(
                `entities[${index}].shapes.valueSecondary`
              ),
            }
          : undefined;

      const customShapeValue = card.getValidatedSvgPath(
        `entities[${index}].shapes.value`
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
        secondary: dataSecondary,
        customShapeValue: customShapeValue,
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
  bar: number
): string | undefined {
  const configValue = card.getValue<string>(`entities[${bar}].title`);
  if (configValue === "" || configValue !== undefined) return configValue;

  let stateObj;
  const entity = card._config?.entities?.[bar].entity;
  if (entity !== undefined) stateObj = card.hass?.states[entity];
  return stateObj?.attributes.friendly_name;
}
