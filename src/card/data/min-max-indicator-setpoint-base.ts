import { NumberUtils } from "../../utils/number/numberUtils";
import { getValueFromPath } from "../../utils/object/get-value";
import { ComputeDataContext } from "../types/contexts";

export function getMinMaxIndicatorSetpointBase(
  card: ComputeDataContext,
  row: number,
  bar: "primary" | "secondary",
  element: "min_indicator" | "max_indicator" | "setpoint"
):
  | undefined
  | {
      value: number;
      customColor: string | undefined;
      customShape: string | undefined;
    } {
  const gaugePath = bar === "primary" ? "" : "secondary.";
  const type = getValueFromPath(
    card._config,
    `entities[${row}].${gaugePath}${element}.type`
  );
  if (type === undefined) return undefined;

  const customColorKey = `entities.[${row}].${gaugePath}${element}.color`;
  const customColor = card.getLightDarkModeColor(customColorKey);

  let value: number | undefined;
  if (type === "attribute") {
    const entity = card._config?.entities?.[row].entity;
    if (!entity) return undefined;

    const configValue = getValueFromPath(
      card._config,
      `entities[${row}].${gaugePath}${element}.value`
    );
    if (typeof configValue !== "string") return undefined;

    const stateObj = card.hass?.states[entity];
    if (!stateObj) return undefined;

    value = NumberUtils.tryToNumber(stateObj.attributes[configValue]);
  } else if (type === "entity") {
    const configValue = getValueFromPath(
      card._config,
      `entities[${row}].${element}.value`
    );
    if (typeof configValue !== "string") return undefined;

    const stateObj = card.hass?.states[configValue];
    if (!stateObj) return undefined;

    value = NumberUtils.tryToNumber(stateObj.state);
  } else if (type === "number") {
    const configValue = getValueFromPath(
      card._config,
      `entities[${row}].${gaugePath}${element}.value`
    );
    value = NumberUtils.tryToNumber(configValue);
  } else if (type === "template") {
    value = NumberUtils.tryToNumber(
      card.getValue(`entities[${row}].${gaugePath}${element}.value`)
    );
  }

  if (value === undefined || value === null) return;

  const gaugeShapePath = bar === "primary" ? "" : "secondary_";
  const customShape = card.getValidatedSvgPath(
    `entities[${row}].shapes.${gaugeShapePath}${element}`
  );

  return { value, customColor, customShape };
}
