import { DEFAULTS } from "../../constants/defaults";
import { BarGaugeCardProCardConfig } from "../config";
import type { ProcessConfigUpdateContext } from "../types/contexts";
import type { EntityMode, SeverityColorMode } from "../types/types";

export function processConfigUpdate(
  card: ProcessConfigUpdateContext,
  config: BarGaugeCardProCardConfig
) {
  card.header = config.header ?? undefined;
  card.hideAllTextBars = config.hide_all_text_bars ?? false;
  card.hideBackground = config.hide_background ?? false;
  card.orientation = config.orientation ?? DEFAULTS.ui.orientation;
  card.compact =
    card.orientation == "horizontal" ? (config.compact ?? false) : undefined;

  if (config.entities) {
    config.entities.forEach((entityConfig, row: number) => {
      let gradient: boolean | undefined = undefined;
      let gradientBackground: boolean | undefined = undefined;
      let gradientBackgroundOpacity: number | undefined = undefined;
      let severityColorMode: SeverityColorMode | undefined = undefined;
      let severityCentered: boolean | undefined = undefined;
      let mode: EntityMode;

      const isSeverity = entityConfig.severity ?? false;

      if (isSeverity) {
        gradientBackground = entityConfig.gradient_background ?? false;
        gradientBackgroundOpacity = gradientBackground
          ? (entityConfig.gradient_background_opacity ??
            DEFAULTS.gradient.backgroundOpacity)
          : undefined;
        severityColorMode =
          entityConfig.severity_color_mode ?? DEFAULTS.severity.colorMode;
        severityCentered = entityConfig.severity_centered ?? false;

        mode = "severity";
      } else {
        gradient = entityConfig.gradient ?? false;

        mode = entityConfig.gradient ? "gradient" : "flat";
      }

      const gradientResolution =
        ((isSeverity ? gradientBackground : gradient) ?? false)
          ? (entityConfig.gradient_resolution ?? DEFAULTS.gradient.resolution)
          : undefined;

      const round = entityConfig.round ?? DEFAULTS.ui.roundStyle;
      const hideTextBar =
        (card.hideAllTextBars || entityConfig.hide_text_bar) ?? false;

      card.computedConfig[row] = {
        gradient: gradient,
        gradientBackground: gradientBackground,
        gradientBackgroundOpacity: gradientBackgroundOpacity,
        gradientResolution: gradientResolution,
        isSeverity: isSeverity,
        severityColorMode: severityColorMode,
        severityCentered: severityCentered,
        mode: mode,
        round: round,
        hideTextBar: hideTextBar,
        unit_before_value: entityConfig.unit_before_value ?? false,
      };
    });
  } else {
    card.computedConfig = [];
  }
}
