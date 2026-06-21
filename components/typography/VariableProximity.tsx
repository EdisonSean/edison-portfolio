"use client";

import {
  CSSProperties,
  forwardRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";

type FalloffMode = "linear" | "exponential" | "gaussian";

type VariableProximityProps = {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef?: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: FalloffMode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId = 0;

    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef?: RefObject<HTMLElement | null>) {
  const positionRef = useRef({
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
  });

  useEffect(() => {
    const resetPosition = () => {
      positionRef.current = {
        x: Number.POSITIVE_INFINITY,
        y: Number.POSITIVE_INFINITY,
      };
    };

    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        updatePosition(event.clientX, event.clientY);
      }
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        resetPosition();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePosition(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", resetPosition);
    window.addEventListener("touchcancel", resetPosition);
    window.addEventListener("blur", resetPosition);
    window.addEventListener("pagehide", resetPosition);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", resetPosition);
      window.removeEventListener("touchcancel", resetPosition);
      window.removeEventListener("blur", resetPosition);
      window.removeEventListener("pagehide", resetPosition);
    };
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>(
  (
    {
      label,
      fromFontVariationSettings,
      toFontVariationSettings,
      containerRef,
      radius = 180,
      falloff = "linear",
      className = "",
      onClick,
      style,
      ...restProps
    },
    ref,
  ) => {
    const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const mousePositionRef = useMousePositionRef(containerRef);

    const parsedSettings = useMemo(() => {
      const parseSettings = (settingsStr: string) =>
        new Map(
          settingsStr
            .split(",")
            .map((setting) => setting.trim())
            .map((setting) => {
              const [name, value] = setting.split(" ");
              return [
                name.replace(/['"]/g, ""),
                Number.parseFloat(value),
              ] as const;
            }),
        );

      const fromSettings = parseSettings(fromFontVariationSettings);
      const toSettings = parseSettings(toFontVariationSettings);
      const axes = new Set([...fromSettings.keys(), ...toSettings.keys()]);

      return Array.from(axes).map((axis) => {
        const fromValue = fromSettings.get(axis);
        const toValue = toSettings.get(axis);

        return {
          axis,
          fromValue: fromValue ?? toValue ?? 0,
          toValue: toValue ?? fromValue ?? 0,
        };
      });
    }, [fromFontVariationSettings, toFontVariationSettings]);

    const calculateDistance = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    const calculateFalloff = (distance: number) => {
      const safeRadius = Math.max(radius, 1);
      const progress = Math.min(Math.max(distance / safeRadius, 0), 1);
      const proximity = 1 - progress;

      switch (falloff) {
        case "exponential":
          return proximity ** 2;
        case "gaussian": {
          const sigma = 0.5;
          const edgeValue = Math.exp(-0.5 * (1 / sigma) ** 2);
          const value = Math.exp(-0.5 * (progress / sigma) ** 2);
          return Math.min(
            Math.max((value - edgeValue) / (1 - edgeValue), 0),
            1,
          );
        }
        case "linear":
        default:
          return proximity;
      }
    };

    const interpolateSettings = (falloffValue: number) =>
      parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue =
            fromValue + (toValue - fromValue) * falloffValue;

          return `'${axis}' ${interpolatedValue}`;
        })
        .join(", ");

    useAnimationFrame(() => {
      const containerRect = containerRef?.current?.getBoundingClientRect();
      const containerLeft = containerRect?.left ?? 0;
      const containerTop = containerRect?.top ?? 0;
      const { x, y } = mousePositionRef.current;

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2 - containerLeft;
        const letterCenterY = rect.top + rect.height / 2 - containerTop;

        const distance = calculateDistance(
          x,
          y,
          letterCenterX,
          letterCenterY,
        );
        const falloffValue = calculateFalloff(distance);
        const newSettings = interpolateSettings(falloffValue);

        letterRef.style.fontVariationSettings = newSettings;
      });
    });

    const words = label.split(" ");
    let letterIndex = 0;

    return (
      <span
        ref={ref}
        className={`${className} variable-proximity notranslate`}
        onClick={onClick}
        style={{ display: "inline", ...style }}
        translate="no"
        {...restProps}
      >
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            lang="zxx"
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word.split("").map((letter) => {
              const currentLetterIndex = letterIndex;
              letterIndex += 1;

              return (
                <span
                  key={currentLetterIndex}
                  ref={(element) => {
                    letterRefs.current[currentLetterIndex] = element;
                  }}
                  style={{
                    display: "inline-block",
                    fontVariationSettings: fromFontVariationSettings,
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span style={{ display: "inline-block" }}>&nbsp;</span>
            )}
          </span>
        ))}
        <span className="sr-only">{label}</span>
      </span>
    );
  },
);

VariableProximity.displayName = "VariableProximity";

export default VariableProximity;
