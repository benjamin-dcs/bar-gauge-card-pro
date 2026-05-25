import { blankBeforePercent, HomeAssistant } from "../../dependencies/ha";

export const formatValueAndUnit = (
  hass: HomeAssistant,
  value: string | number,
  unit: string | undefined,
  unit_before_value = false
): string => {
  if (!unit) return String(value);
  if (unit_before_value) {
    // For now always a space between unit and value
    return unit !== "" ? `${unit} ${value}` : String(value);
  } else {
    if (unit === "%") {
      unit = `${blankBeforePercent(hass.locale)}%`;
    } else if (unit !== "") {
      unit = ` ${unit}`;
    }
    return value + unit;
  }
};
