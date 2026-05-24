import { formatNumberToLocal } from "../../utils/number/format-to-locale";
import { getValueFromPath } from "../../utils/object/get-value";
import { ComputeDataContext } from "../types/contexts";
import { getMinMaxIndicatorSetpointBase } from "./min-max-indicator-setpoint-base";

export function getSetpoint(card: ComputeDataContext, bar: number) {
  const base = getMinMaxIndicatorSetpointBase(card, bar, "setpoint");
  if (!base) return;

  let label: string | undefined = undefined;

  const hasLabel = card._config?.entities?.[bar].setpoint?.label ?? false;
  if (hasLabel) {
    let value = base.value;
    const precision = getValueFromPath(
      card._config,
      `entities[${bar}].setpoint.precision`
    ) as number | undefined;
    if (precision !== undefined) {
      const factor = 10 ** precision;
      value = Math.round(value * factor) / factor;
    }

    label = formatNumberToLocal(card.hass, value);
  }

  return {
    value: base.value,
    customColor: base.customColor,
    label: label,
  };
}
