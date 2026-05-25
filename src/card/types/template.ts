import type { RenderTemplateResult } from "../../dependencies/ha";
import { CacheManager } from "../../dependencies/mushroom";

export const ENTITY_TEMPLATE_FIELDS = [
  "icon.icon",
  "icon.icon_color",
  "min",
  "max",
  "secondary_value",
  "segments",
  "setpoint.value",
  "title",
  "value",
] as const;
export const ROOT_TEMPLATE_KEYS = ["min"] as const;

export function getTemplateKeys(config: { entities?: unknown[] }): string[] {
  const entityKeys = (config.entities ?? []).flatMap((_, i) =>
    ENTITY_TEMPLATE_FIELDS.map((field) => `entities[${i}].${field}`)
  );
  return [...ROOT_TEMPLATE_KEYS, ...entityKeys];
}

export type TemplateResults = Record<string, RenderTemplateResult | undefined>;

export const templateCache = new CacheManager<TemplateResults>(1000);
export type GetValueFn = <T = unknown>(key: string) => T;
export type GetLightDarkModeColorFn = (key: string) => string | undefined;
