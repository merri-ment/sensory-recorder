import { gsap } from "gsap";

const ExpoOut = gsap.parseEase("expo.out");
const QuadOut = gsap.parseEase("quad.out");
const ExpoIn = gsap.parseEase("expo.in");
const ExpoInOut = gsap.parseEase("expo.inOut");
const SineInOut = gsap.parseEase("sine.inOut");
const QuadInOut = gsap.parseEase("quad.inOut");
const BackInOut = gsap.parseEase("back.inOut(2)");

export default function useGsap() {
  const splitColor = (value) => {
    if (value) {
      const color = gsap.utils.splitColor(value);
      const r = color[0] / 255;
      const g = color[1] / 255;
      const b = color[2] / 255;
      return [r, g, b];
    } else {
      return [0, 0, 0];
    }
  };

  return {
    splitColor,
    QuadOut,
    ExpoOut,
    ExpoIn,
    ExpoInOut,
    SineInOut,
    QuadInOut,
    BackInOut,
  };
}
