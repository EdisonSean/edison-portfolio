"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const SDF_TEXTURE_WIDTH = 1536;
const SDF_SPREAD = 112;
const SDF_PADDING_X = 92;
const SDF_PADDING_Y = 44;
const SDF_OVERSCAN = 260;
const EDT_INF = 1e20;

const vertexShader = /* glsl */ `
varying vec2 v_texcoord;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_texcoord = uv;
}
`;

const fragmentShader = /* glsl */ `
varying vec2 v_texcoord;

uniform sampler2D u_logoSdfTexture;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform float u_logoAspect;
uniform float u_shapeSize;
uniform float u_sdfSpread;
uniform float u_baseSoftness;
uniform float u_blurRadius;
uniform float u_circleSize;
uniform float u_circleEdge;
uniform vec2 u_sdfUvMin;
uniform vec2 u_sdfUvScale;

vec2 logoUv(vec2 uv) {
    float canvasAspect = u_resolution.x / u_resolution.y;
    vec2 fitted = uv;

    if (canvasAspect > u_logoAspect) {
        fitted.x = (uv.x - 0.5) * canvasAspect / u_logoAspect + 0.5;
    } else {
        fitted.y = (uv.y - 0.5) * u_logoAspect / canvasAspect + 0.5;
    }

    fitted = (fitted - 0.5) / u_shapeSize + 0.5;
    return fitted;
}

float logoDistance(vec2 uv) {
    vec2 fitted = logoUv(uv);
    vec2 sdfUv = u_sdfUvMin + fitted * u_sdfUvScale;

    if (sdfUv.x < 0.0 || sdfUv.x > 1.0 || sdfUv.y < 0.0 || sdfUv.y > 1.0) {
        return u_sdfSpread;
    }

    float encodedDistance = texture2D(u_logoSdfTexture, sdfUv).r;
    return (encodedDistance - 0.5) * u_sdfSpread * 2.0;
}

float pointerField(vec2 uv) {
    vec2 canvasSize = u_resolution / u_pixelRatio;
    vec2 posMouse = vec2(u_mouse.x / canvasSize.x, 1.0 - u_mouse.y / canvasSize.y);
    float distanceToMouse = length((uv - posMouse) * canvasSize);
    float radius = u_circleSize * min(canvasSize.x, canvasSize.y);
    float edge = u_circleEdge * min(canvasSize.x, canvasSize.y);

    return 1.0 - smoothstep(radius, radius + edge, distanceToMouse);
}

float logoAlpha(vec2 uv) {
    float distanceToLogo = logoDistance(uv);
    return 1.0 - smoothstep(-u_baseSoftness, u_baseSoftness, distanceToLogo);
}

float variableRadiusLogoBlur(vec2 uv, float radius) {
    vec2 canvasSize = u_resolution / u_pixelRatio;
    vec2 stepUv = vec2(radius) / canvasSize;
    float alpha = 0.0;
    float weightSum = 0.0;

    for (int i = 0; i < 48; i++) {
        float index = float(i) + 0.5;
        float sampleRadius = sqrt(index / 48.0);
        float sampleAngle = index * 2.39996323;
        float weight = 1.0 - sampleRadius * 0.72;
        vec2 offset = vec2(cos(sampleAngle), sin(sampleAngle)) * sampleRadius;

        alpha += logoAlpha(uv + offset * stepUv) * weight;
        weightSum += weight;
    }

    return alpha / weightSum;
}

void main() {
    float field = pointerField(v_texcoord);
    float localRadius = u_blurRadius * pow(field, 1.18);
    float alpha = variableRadiusLogoBlur(v_texcoord, localRadius);

    gl_FragColor = vec4(vec3(1.0), clamp(alpha, 0.0, 1.0));
}
`;

function distanceTransform1d(
  source: Float32Array,
  count: number,
  output: Float32Array,
  locations: Int32Array,
  boundaries: Float32Array,
) {
  let k = 0;
  locations[0] = 0;
  boundaries[0] = -EDT_INF;
  boundaries[1] = EDT_INF;

  for (let q = 1; q < count; q += 1) {
    let s = 0;

    do {
      const r = locations[k];
      s =
        (source[q] + q * q - source[r] - r * r) /
        (2 * q - 2 * r);
      if (s <= boundaries[k]) {
        k -= 1;
      }
    } while (k >= 0 && s <= boundaries[k]);

    k += 1;
    locations[k] = q;
    boundaries[k] = s;
    boundaries[k + 1] = EDT_INF;
  }

  k = 0;

  for (let q = 0; q < count; q += 1) {
    while (boundaries[k + 1] < q) {
      k += 1;
    }

    const r = locations[k];
    const diff = q - r;
    output[q] = diff * diff + source[r];
  }
}

function distanceTransform2d(grid: Float32Array, width: number, height: number) {
  const maxDimension = Math.max(width, height);
  const source = new Float32Array(maxDimension);
  const output = new Float32Array(maxDimension);
  const locations = new Int32Array(maxDimension);
  const boundaries = new Float32Array(maxDimension + 1);

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      source[y] = grid[y * width + x];
    }

    distanceTransform1d(source, height, output, locations, boundaries);

    for (let y = 0; y < height; y += 1) {
      grid[y * width + x] = output[y];
    }
  }

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * width;

    for (let x = 0; x < width; x += 1) {
      source[x] = grid[rowOffset + x];
    }

    distanceTransform1d(source, width, output, locations, boundaries);

    for (let x = 0; x < width; x += 1) {
      grid[rowOffset + x] = output[x];
    }
  }

  return grid;
}

type SdfTextureResult = {
  texture: THREE.DataTexture;
  uvMin: THREE.Vector2;
  uvScale: THREE.Vector2;
};

function createLogoMaskCanvas(image: HTMLImageElement, aspect: number) {
  const sourceWidth = SDF_TEXTURE_WIDTH;
  const sourceHeight = Math.max(1, Math.round(sourceWidth / aspect));
  const width = sourceWidth + SDF_OVERSCAN * 2;
  const height = sourceHeight + SDF_OVERSCAN * 2;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create logo mask canvas context.");
  }

  const maxDrawWidth = sourceWidth - SDF_PADDING_X * 2;
  const maxDrawHeight = sourceHeight - SDF_PADDING_Y * 2;
  let drawWidth = maxDrawWidth;
  let drawHeight = drawWidth / aspect;

  if (drawHeight > maxDrawHeight) {
    drawHeight = maxDrawHeight;
    drawWidth = drawHeight * aspect;
  }

  const x = SDF_OVERSCAN + (sourceWidth - drawWidth) / 2;
  const y = SDF_OVERSCAN + (sourceHeight - drawHeight) / 2;

  context.clearRect(0, 0, width, height);
  context.drawImage(image, x, y, drawWidth, drawHeight);

  return {
    canvas,
    uvMin: new THREE.Vector2(SDF_OVERSCAN / width, SDF_OVERSCAN / height),
    uvScale: new THREE.Vector2(sourceWidth / width, sourceHeight / height),
  };
}

function createLogoSdfTexture(
  image: HTMLImageElement,
  aspect: number,
): SdfTextureResult {
  const mask = createLogoMaskCanvas(image, aspect);
  const { canvas } = mask;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not read logo mask canvas context.");
  }

  const { width, height } = canvas;
  const imageData = context.getImageData(0, 0, width, height).data;
  const outer = new Float32Array(width * height);
  const inner = new Float32Array(width * height);

  for (let index = 0; index < width * height; index += 1) {
    const alpha = imageData[index * 4 + 3] / 255;
    const isInside = alpha > 0.35;

    outer[index] = isInside ? 0 : EDT_INF;
    inner[index] = isInside ? EDT_INF : 0;
  }

  distanceTransform2d(outer, width, height);
  distanceTransform2d(inner, width, height);

  const textureData = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceIndex = y * width + x;
      const textureIndex = (height - 1 - y) * width + x;
      const signedDistance =
        Math.sqrt(outer[sourceIndex]) - Math.sqrt(inner[sourceIndex]);
      const encoded = Math.round(
        THREE.MathUtils.clamp(
          0.5 + signedDistance / (SDF_SPREAD * 2),
          0,
          1,
        ) * 255,
      );
      const dataIndex = textureIndex * 4;

      textureData[dataIndex] = encoded;
      textureData[dataIndex + 1] = encoded;
      textureData[dataIndex + 2] = encoded;
      textureData[dataIndex + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(
    textureData,
    width,
    height,
    THREE.RGBAFormat,
  );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return {
    texture,
    uvMin: mask.uvMin,
    uvScale: mask.uvScale,
  };
}

function loadSvgAsSdfTexture(src: string, aspect: number) {
  return new Promise<SdfTextureResult>((resolve, reject) => {
    const image = new Image();

    const objectUrlPromise = fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load SVG texture: ${response.status}`);
        }
        return response.text();
      })
      .then((svg) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        return URL.createObjectURL(blob);
      });

    image.onload = () => {
      try {
        const texture = createLogoSdfTexture(image, aspect);
        URL.revokeObjectURL(image.src);
        resolve(texture);
      } catch (error) {
        URL.revokeObjectURL(image.src);
        reject(error);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      reject(new Error("Could not rasterize SVG logo texture."));
    };

    objectUrlPromise
      .then((objectUrl) => {
        image.src = objectUrl;
      })
      .catch(reject);
  });
}

type ShapeBlurProps = {
  className?: string;
  logoSrc?: string;
  logoAspect?: number;
  pixelRatioProp?: number;
  shapeSize?: number;
  baseSoftness?: number;
  blurRadius?: number;
  circleSize?: number;
  circleEdge?: number;
  outerPointerRange?: number;
  outerPointerNearOffset?: number;
  outerPointerWeakOffset?: number;
  outerPointerBlurRadius?: number;
  outerPointerCircleSize?: number;
  outerPointerCircleEdge?: number;
};

type PointerPosition = {
  x: number;
  y: number;
  distanceProgress: number;
};

export default function ShapeBlur({
  className = "",
  logoSrc = "/assets/logo/LOGO_SVG_horizontal.svg",
  logoAspect = 369.6609 / 98.2799,
  pixelRatioProp = 2,
  shapeSize = 1.04,
  baseSoftness = 0.9,
  blurRadius = 86,
  circleSize = 0.16,
  circleEdge = 0.22,
  outerPointerRange = 0,
  outerPointerNearOffset = 0.1,
  outerPointerWeakOffset = 0.38,
  outerPointerBlurRadius = 28,
  outerPointerCircleSize = 0.26,
  outerPointerCircleEdge = 0.52,
}: ShapeBlurProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let active = true;
    let animationFrameId: number | null = null;
    let lastTime = 0;

    const inactivePointerPosition = -10000;
    const vMouse = new THREE.Vector2(-10000, -10000);
    const vMouseDamp = new THREE.Vector2(-10000, -10000);
    const vResolution = new THREE.Vector2();
    let hasPointer = false;
    const emptyTexture = new THREE.DataTexture(
      new Uint8Array([255, 255, 255, 255]),
      1,
      1,
      THREE.RGBAFormat,
    );
    emptyTexture.needsUpdate = true;
    let logoSdfTexture: THREE.Texture | null = null;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.userSelect = "none";
    renderer.domElement.style.setProperty("-webkit-user-select", "none");
    renderer.domElement.style.setProperty("-webkit-touch-callout", "none");
    mount.appendChild(renderer.domElement);

    const geo = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_logoSdfTexture: { value: emptyTexture },
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: pixelRatioProp },
        u_logoAspect: { value: logoAspect },
        u_shapeSize: { value: shapeSize },
        u_sdfSpread: { value: SDF_SPREAD },
        u_baseSoftness: { value: baseSoftness },
        u_blurRadius: { value: blurRadius },
        u_circleSize: { value: circleSize },
        u_circleEdge: { value: circleEdge },
        u_sdfUvMin: { value: new THREE.Vector2(0, 0) },
        u_sdfUvScale: { value: new THREE.Vector2(1, 1) },
      },
      transparent: true,
    });

    loadSvgAsSdfTexture(logoSrc, logoAspect)
      .then(({ texture, uvMin, uvScale }) => {
        if (!active) {
          texture.dispose();
          return;
        }

        logoSdfTexture = texture;
        material.uniforms.u_logoSdfTexture.value = texture;
        material.uniforms.u_logoAspect.value = logoAspect;
        material.uniforms.u_sdfUvMin.value.copy(uvMin);
        material.uniforms.u_sdfUvScale.value.copy(uvScale);
      })
      .catch((error: unknown) => {
        console.error(error);
      });

    const quad = new THREE.Mesh(geo, material);
    scene.add(quad);

    const resetPointer = () => {
      vMouse.set(inactivePointerPosition, inactivePointerPosition);
      hasPointer = false;
      material.uniforms.u_blurRadius.value = blurRadius;
      material.uniforms.u_circleSize.value = circleSize;
      material.uniforms.u_circleEdge.value = circleEdge;
    };

    const getMappedPointerPosition = (
      clientX: number,
      clientY: number,
    ): PointerPosition => {
      const rect = mount.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      if (outerPointerRange <= 0) {
        return { x: localX, y: localY, distanceProgress: 0 };
      }

      const outsideDistance = Math.hypot(
        Math.max(rect.left - clientX, 0, clientX - rect.right),
        Math.max(rect.top - clientY, 0, clientY - rect.bottom),
      );

      if (outsideDistance === 0) {
        return { x: localX, y: localY, distanceProgress: 0 };
      }

      const nearestX = THREE.MathUtils.clamp(localX, 0, rect.width);
      const nearestY = THREE.MathUtils.clamp(localY, 0, rect.height);
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const toCenterX = centerX - nearestX;
      const toCenterY = centerY - nearestY;
      const toCenterLength = Math.max(1, Math.hypot(toCenterX, toCenterY));
      const minDimension = Math.max(1, Math.min(rect.width, rect.height));
      const rangeDistance = outerPointerRange * minDimension;
      const rangeProgress = Math.sqrt(
        THREE.MathUtils.smoothstep(outsideDistance, 0, rangeDistance),
      );
      const inwardOffset =
        THREE.MathUtils.lerp(
          outerPointerNearOffset,
          outerPointerWeakOffset,
          rangeProgress,
        ) * minDimension;
      const innerX = nearestX + (toCenterX / toCenterLength) * inwardOffset;
      const innerY = nearestY + (toCenterY / toCenterLength) * inwardOffset;

      return {
        x: THREE.MathUtils.lerp(localX, innerX, rangeProgress),
        y: THREE.MathUtils.lerp(localY, innerY, rangeProgress),
        distanceProgress: rangeProgress,
      };
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const pointerPosition = getMappedPointerPosition(clientX, clientY);
      vMouse.set(pointerPosition.x, pointerPosition.y);
      material.uniforms.u_blurRadius.value = THREE.MathUtils.lerp(
        blurRadius,
        outerPointerBlurRadius,
        pointerPosition.distanceProgress,
      );
      material.uniforms.u_circleSize.value = THREE.MathUtils.lerp(
        circleSize,
        outerPointerCircleSize,
        pointerPosition.distanceProgress,
      );
      material.uniforms.u_circleEdge.value = THREE.MathUtils.lerp(
        circleEdge,
        outerPointerCircleEdge,
        pointerPosition.distanceProgress,
      );

      if (!hasPointer) {
        vMouseDamp.copy(vMouse);
        hasPointer = true;
      }
    };

    const onPointerMove = (event: MouseEvent | PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onPointerDown = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        resetPointer();
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
    };

    const resize = () => {
      if (!active) return;

      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, pixelRatioProp);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);

      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      quad.scale.set(width, height, 1);
      vResolution.set(width, height).multiplyScalar(dpr);
      material.uniforms.u_pixelRatio.value = dpr;
    };

    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerEnd);
    document.addEventListener("pointercancel", onPointerEnd);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", resetPointer);
    document.addEventListener("touchcancel", resetPointer);
    window.addEventListener("resize", resize);
    window.addEventListener("blur", resetPointer);
    window.addEventListener("pagehide", resetPointer);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const update = () => {
      if (!active) return;

      const time = performance.now() * 0.001;
      const dt = time - lastTime;
      lastTime = time;

      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt);
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      active = false;

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", resetPointer);
      window.removeEventListener("pagehide", resetPointer);
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerEnd);
      document.removeEventListener("pointercancel", onPointerEnd);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", resetPointer);
      document.removeEventListener("touchcancel", resetPointer);

      scene.remove(quad);
      geo.dispose();
      material.dispose();
      emptyTexture.dispose();
      logoSdfTexture?.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [
    logoSrc,
    logoAspect,
    pixelRatioProp,
    shapeSize,
    baseSoftness,
    blurRadius,
    circleSize,
    circleEdge,
    outerPointerRange,
    outerPointerNearOffset,
    outerPointerWeakOffset,
    outerPointerBlurRadius,
    outerPointerCircleSize,
    outerPointerCircleEdge,
  ]);

  return <div className={className} ref={mountRef} />;
}
