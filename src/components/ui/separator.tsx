import type { CSSProperties } from "react";
import { COLOR } from "./colorTokens";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  color?: COLOR;
  thickness?: string;
  className?: string;
  id?: string;
};

export function Separator({
  orientation = "horizontal",
  color = COLOR.GRIS_BORDE,
  thickness = "1px",
  className,
  id,
}: SeparatorProps) {
  const style: CSSProperties =
    orientation === "horizontal"
      ? { height: thickness, width: "100%", backgroundColor: color }
      : { width: thickness, height: "100%", backgroundColor: color };

  return <div id={id} className={className} style={style} />;
}
