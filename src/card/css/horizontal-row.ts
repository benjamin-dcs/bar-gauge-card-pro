import { css } from "lit";

export const horizontalRowStyles = css`
  .entity-row {
    display: flex;
    align-items: flex-end;
  }

  .icon {
    width: var(--bar-height);
    height: var(--bar-height);
    margin-right: 8px;
  }

  ha-tile-icon {
    --tile-icon-size: var(--bar-height);
    --mdc-icon-size: var(--bar-height);
  }

  .gauge-content {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .text-bar {
    display: flex;
    position: relative;
  }

  .text-bar-left {
    display: block;
    position: relative;
    font-size: var(--ha-font-size-s);
    width: 100%;
  }

  .text-bar-right {
    display: flex;
    margin-left: auto;
    gap: 0.25rem;
    align-items: center;
  }

  .text-bar-right-value-text {
    font-size: var(--ha-font-size-s);
    white-space: nowrap;
  }

  .text-bar-right-setpoint {
    font-size: var(--ha-font-size-s);
    color: #ff0000;
    white-space: nowrap;
  }

  .value-bar {
    position: relative;
    width: 100%;
    height: var(--bar-height);
    overflow: hidden;
    container-type: size;
  }

  .gradient-background {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .severity-background {
    display: block;
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
  }

  .severity-value {
    display: block;
    position: absolute;
    inset: 0;
    transition: all 1s ease 0s;
  }

  .severity-secondary-value {
    align-self: flex-end;
    height: 45%;
  }

  .value-indicator {
    display: block;
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
  }

  .value-indicator-svg {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
    width: 3rem;
    transition: all 1s ease 0s;
  }
`;
