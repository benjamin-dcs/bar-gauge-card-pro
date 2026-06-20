import { NumberUtils } from "../../utils/number/numberUtils";
import { getValueFromPath } from "../../utils/object/get-value";
import { ComputeDataContext } from "../types/contexts";

export function getMinMaxIndicatorSetpointBase(
  card: ComputeDataContext,
  bar: number,
  gauge: "primary" | "secondary",
  element: "min_indicator" | "max_indicator" | "setpoint"
):
  | undefined
  | {
      value: number;
      customColor: string | undefined;
      customShape: string | undefined;
    } {
  const gaugePath = gauge === "primary" ? "" : "secondary.";
  const type = getValueFromPath(
    card._config,
    `entities[${bar}].${gaugePath}${element}.type`
  );
  if (type === undefined) return undefined;

  const customColorKey = `entities.[${bar}].${gaugePath}${element}.color`;
  const customColor = card.getLightDarkModeColor(customColorKey);

  let value: number | undefined;
  if (type === "attribute") {
    const entity = card._config?.entities?.[bar].entity;
    if (!entity) return undefined;

    const configValue = getValueFromPath(
      card._config,
      `entities[${bar}].${gaugePath}${element}.value`
    );
    if (typeof configValue !== "string") return undefined;

    const stateObj = card.hass?.states[entity];
    if (!stateObj) return undefined;

    value = NumberUtils.tryToNumber(stateObj.attributes[configValue]);
  } else if (type === "entity") {
    const configValue = getValueFromPath(
      card._config,
      `entities[${bar}].${element}.value`
    );
    if (typeof configValue !== "string") return undefined;

    const stateObj = card.hass?.states[configValue];
    if (!stateObj) return undefined;

    value = NumberUtils.tryToNumber(stateObj.state);
  } else if (type === "number") {
    const configValue = getValueFromPath(
      card._config,
      `entities[${bar}].${gaugePath}${element}.value`
    );
    value = NumberUtils.tryToNumber(configValue);
  } else if (type === "template") {
    value = NumberUtils.tryToNumber(
      card.getValue(`entities[${bar}].${gaugePath}${element}.value`)
    );
  }

  if (value === undefined || value === null) return;

  const gaugeShapePath = gauge === "primary" ? "" : "secondary_";
  const customShape = card.getValidatedSvgPath(
    `entities[${bar}].shapes.${gaugeShapePath}${element}`
  );

  return { value, customColor, customShape };
}
