import { INVALID_ENTITY } from "../../constants/constants";
import type { HomeAssistant } from "../../dependencies/ha";
import { isAvailable, UNAVAILABLE } from "../../dependencies/ha";
import {
  formatEntityToLocal,
  formatNumberToLocal,
} from "../../utils/number/format-to-locale";
import { NumberUtils } from "../../utils/number/numberUtils";
import type { GetValueFn } from "../types/template";
import type { BarGaugeCardProCardConfig } from "../config";
import { ValueAndValueText } from "../types/types";
import { formatValueAndUnit } from "../../utils/string/unit";

export function getValueAndValueText(
  hass: HomeAssistant,
  config: BarGaugeCardProCardConfig,
  getValue: GetValueFn,
  row: number
): ValueAndValueText {
  const cfg = config.entities![row];
  const entity = cfg.entity;
  const attribute = cfg.attribute;

  const templateValue = getValue(`entities[${row}].value`);
  const templateValueText = getValue(`entities[${row}].valueText`);

  let valueText: string | undefined;
  let stateObj;
  if (entity !== undefined) stateObj = hass.states[entity];

  // 1 - config.value
  // 2 - config.entity with config.attribute
  // 3 - config.entity state
  let value =
    NumberUtils.tryToNumber(templateValue) ??
    (attribute !== undefined
      ? NumberUtils.tryToNumber(stateObj?.attributes[attribute])
      : NumberUtils.tryToNumber(stateObj?.state));

  if (value === undefined) {
    if (entity && !stateObj) {
      return { value: undefined, valueText: INVALID_ENTITY };
    } else if (stateObj && !isAvailable(stateObj)) {
      return { value: undefined, valueText: UNAVAILABLE };
    } else {
      value = undefined;
    }
  }

  // 1 - value_texts.<type>.value
  // 2 - value or inner.value
  // 3 - attribute or inner.attribute
  // 4 - entity

  // Allow empty string to overwrite value_text
  if (templateValueText === "") {
    return { value: value, valueText: "" };
  } else if (templateValueText !== undefined) {
    if (NumberUtils.isNumeric(templateValueText)) {
      valueText = formatNumberToLocal(hass, templateValueText) ?? "";
    } else {
      return { value: value, valueText: templateValueText as string };
    }
  } else if (templateValue || attribute) {
    valueText = formatNumberToLocal(hass, value) ?? "";
  } else if (entity) {
    valueText = formatEntityToLocal(hass, entity) ?? "";
  } else {
    valueText = "";
  }

  let unit = getValue<string>(`entities[${row}].unit_of_measurement`);
  unit =
    unit === ""
      ? ""
      : unit ||
        (attribute ? "" : stateObj?.attributes?.unit_of_measurement) ||
        "";

  valueText = formatValueAndUnit(hass, valueText, unit, cfg.unit_before_value);

  return { value, valueText, unit_of_measurement: unit };
}

export function getSecondaryValueAndValueText(
  hass: HomeAssistant,
  getValue: GetValueFn,
  row: number,
  primaryUnit: string | undefined,
  unit_before_value = false
): { value: number; valueText: string } | undefined {
  const value = getValue<string>(`entities[${row}].secondary.value`);
  if (!value) return undefined;

  if (NumberUtils.isNumeric(value)) {
    const formattedValue = formatNumberToLocal(hass, value) ?? String(value);

    return {
      value: value,
      valueText: formatValueAndUnit(
        hass,
        formattedValue,
        primaryUnit,
        unit_before_value
      ),
    };
  }

  const stateObj = hass.states[value];
  if (!stateObj) return undefined;

  const valueFromEntity = NumberUtils.tryToNumber(stateObj.state);
  if (!NumberUtils.isNumeric(valueFromEntity)) return undefined;

  const unitFromEntity = stateObj.attributes?.unit_of_measurement;
  const formattedEntityValue =
    formatEntityToLocal(hass, value) ?? String(valueFromEntity);

  return {
    value: valueFromEntity,
    valueText: formatValueAndUnit(
      hass,
      formattedEntityValue,
      unitFromEntity ?? primaryUnit,
      unit_before_value
    ),
  };
}
