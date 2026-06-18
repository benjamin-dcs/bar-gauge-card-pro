import { NumberUtils } from "../../utils/number/numberUtils";
import { getValueFromPath } from "../../utils/object/get-value";
import { ComputeDataContext } from "../types/contexts";

export function getMinMaxIndicatorSetpointBase(
  card: ComputeDataContext,
  bar: number,
  element: "min_indicator" | "max_indicator" | "setpoint"
):
  | undefined
  | {
      value: number;
      customColor: string | undefined;
      customShape: string | undefined;
    } {
  const type = getValueFromPath(
    card._config,
    `entities[${bar}].${element}.type`
  );
  if (type === undefined) return undefined;

  const customColorKey = `entities.[${bar}].${element}.color`;
  const customColor = card.getLightDarkModeColor(customColorKey);

  let value: number | undefined;
  if (type === "attribute") {
    const entity = card._config?.entities?.[bar].entity;
    if (!entity) return undefined;

    const configValue = getValueFromPath(
      card._config,
      `entities[${bar}].${element}.value`
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
      `entities[${bar}].${element}.value`
    );
    value = NumberUtils.tryToNumber(configValue);
  } else if (type === "template") {
    value = NumberUtils.tryToNumber(
      card.getValue(`entities[${bar}].${element}.value`)
    );
  }

  if (value === undefined || value === null) return;

  const customShape = card.getValidatedSvgPath(
    `entities[${bar}].shapes.${element}`
  );

  return { value, customColor, customShape };
}
