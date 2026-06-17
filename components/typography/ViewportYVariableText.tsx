"use client";

import { useEffect, useMemo, useRef } from "react";

type ViewportYVariableTextProps = {
  label: string;
  className?: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  viewportRadiusRatio?: number;
};

function parseFontVariationSettings(settings: string) {
  return new Map(
    settings
      .split(",")
      .map((setting) => setting.trim())
      .map((setting) => {
        const [name, value] = setting.split(" ");
        return [name.replace(/['"]/g, ""), Number.parseFloat(value)] as const;
      }),
  );
}

function gaussianFalloff(progress: number) {
  const sigma = 0.5;
  const edgeValue = Math.exp(-0.5 * (1 / sigma) ** 2);
  const value = Math.exp(-0.5 * (progress / sigma) ** 2);

  return Math.min(Math.max((value - edgeValue) / (1 - edgeValue), 0), 1);
}

export default function ViewportYVariableText({
  label,
  className = "",
  fromFontVariationSettings,
  toFontVariationSettings,
  viewportRadiusRatio = 0.42,
}: ViewportYVariableTextProps) {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const axes = useMemo(() => {
    const fromSettings = parseFontVariationSettings(fromFontVariationSettings);
    const toSettings = parseFontVariationSettings(toFontVariationSettings);
    const axisNames = new Set([...fromSettings.keys(), ...toSettings.keys()]);

    return Array.from(axisNames).map((axis) => {
      const fromValue = fromSettings.get(axis);
      const toValue = toSettings.get(axis);

      return {
        axis,
        fromValue: fromValue ?? toValue ?? 0,
        toValue: toValue ?? fromValue ?? 0,
      };
    });
  }, [fromFontVariationSettings, toFontVariationSettings]);

  useEffect(() => {
    let animationFrameId = 0;

    const updateSettings = () => {
      animationFrameId = 0;

      const textElement = textRef.current;
      if (!textElement) {
        return;
      }

      const rect = textElement.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      const viewportCenterY = window.innerHeight / 2;
      const radius = Math.max(1, window.innerHeight * viewportRadiusRatio);
      const progress = Math.min(
        Math.max(Math.abs(elementCenterY - viewportCenterY) / radius, 0),
        1,
      );
      const falloffValue = gaussianFalloff(progress);
      const fontVariationSettings = axes
        .map(({ axis, fromValue, toValue }) => {
          const value = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${value}`;
        })
        .join(", ");

      textElement.style.fontVariationSettings = fontVariationSettings;
    };

    const scheduleUpdate = () => {
      if (animationFrameId === 0) {
        animationFrameId = window.requestAnimationFrame(updateSettings);
      }
    };

    updateSettings();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [axes, viewportRadiusRatio]);

  return (
    <span
      ref={textRef}
      className={`${className} variable-proximity notranslate`}
      style={{ fontVariationSettings: fromFontVariationSettings }}
      lang="zxx"
      translate="no"
    >
      {label}
    </span>
  );
}
