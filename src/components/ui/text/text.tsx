import type { CSSProperties, ElementType, ReactNode } from "react";
import { FONT_SIZE, FONT_WEIGHT } from '../fontTokens';

type TextProps = {
  as?: ElementType;
  fontSize?: FONT_SIZE;
  fontWeight?: FONT_WEIGHT;
  className?: string;
  id?: string;
  children: ReactNode;
};

export function Text({
  as: Component = "p",
  fontSize = FONT_SIZE.MD,
  fontWeight = FONT_WEIGHT.REGULAR,
  className,
  id,
  children,
}: TextProps) {
  const style: CSSProperties = { fontSize, fontWeight };

  return (
    <Component id={id} className={className} style={style}>
      {children}
    </Component>
  );
}
