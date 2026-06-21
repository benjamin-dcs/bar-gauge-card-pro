import { DEFAULTS } from "../../constants/defaults";
import { formatNumberToLocal } from "../../utils/number/format-to-locale";
import { getValueFromPath } from "../../utils/object/get-value";
import { ComputeDataContext } from "../types/contexts";
import { getMinMaxIndicatorSetpointBase } from "./min-max-indicator-setpoint-base";

export function getSetpoint(
  card: ComputeDataContext,
  row: number,
  bar: "primary" | "secondary"
) {
  const base = getMinMaxIndicatorSetpointBase(card, row, bar, "setpoint");
  if (!base) return;

  let label: string | undefined = undefined;

  const hasLabel = card._config?.entities?.[row].setpoint?.label ?? false;
  if (hasLabel) {
    let value = base.value;
    const gaugePath = bar === "primary" ? "" : "secondary.";
    const precision = getValueFromPath(
      card._config,
      `entities[${row}]${gaugePath}.setpoint.precision`
    ) as number | undefined;
    if (precision !== undefined) {
      const factor = 10 ** precision;
      value = Math.round(value * factor) / factor;
    }

    label = formatNumberToLocal(card.hass, value);
  }

  return {
    value: base.value,
    color: base.customColor ?? DEFAULTS.ui.setpointNeedleColor,
    label: label,
    customShape: base.customShape,
  };
}
