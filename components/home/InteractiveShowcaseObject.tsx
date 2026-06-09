import ShapeBlur from "./ShapeBlur";

export default function InteractiveShowcaseObject() {
  return (
    <section
      id="top"
      className="relative flex w-full min-w-0 flex-1 items-center justify-center py-14 sm:py-16 lg:py-8"
      aria-label="Interactive showcase object"
    >
      <div className="relative h-[240px] w-[min(82vw,760px)] min-w-[260px] max-w-[calc(100vw-2.5rem)] sm:h-[300px] lg:h-[360px]">
        <ShapeBlur
          className="absolute inset-0"
          logoSrc="/assets/logo/LOGO_SVG_horizontal.svg"
          logoAspect={369.6609 / 98.2799}
          shapeSize={1.04}
          baseSoftness={0.9}
          blurRadius={86}
          circleSize={0.05}
          circleEdge={0.3}
        />
      </div>
    </section>
  );
}
