import { DEFAULTS } from "../../constants/defaults";
import { getValueFromPath } from "../../utils/object/get-value";
import { ComputeDataContext } from "../types/contexts";
import { getMinMaxIndicatorSetpointBase } from "./min-max-indicator-setpoint-base";

export function getMinMaxIndicator(
  card: ComputeDataContext,
  row: number,
  gauge: "primary" | "secondary",
  element: "min_indicator" | "max_indicator"
) {
  const base = getMinMaxIndicatorSetpointBase(card, row, gauge, element);
  if (!base) return;

  const gaugePath = gauge === "primary" ? "" : "secondary.";
  const opacity =
    (getValueFromPath(
      card._config,
      `entities[${row}].${gaugePath}${element}.opacity`
    ) as number | undefined) ?? DEFAULTS.ui.minMaxIndicators.opacity;

  return {
    value: base.value,
    color: base.customColor ?? DEFAULTS.ui.minMaxIndicators.fill,
    opacity: opacity,
    customShape: base.customShape,
  };
}
