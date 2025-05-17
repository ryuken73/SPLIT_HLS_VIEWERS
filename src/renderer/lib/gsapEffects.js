/* eslint-disable react-hooks/rules-of-hooks */
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function gsapEffect(ref, effect) {
  const { contextSafe } = useGSAP();
  const blinkAninamtion = contextSafe((from, to) => {
    const start = from || { opacity: 1};
    const end = to || { opacity: 0, duration: 1};
    gsap.fromTo(ref.current, start, end);
  });
  const hideAnimation = contextSafe((to) => {
    const end = to || { opacity: 0, duration: 1};
    gsap.to(ref.current, end);
  });
  const showAnimation = contextSafe((to) => {
    const end = to || { opacity: 1, duration: 1};
    gsap.to(ref.current, end);
  });

  const effectToFunction = {
    blink: blinkAninamtion,
    hide: hideAnimation,
    show: showAnimation
  };

  return effectToFunction[effect];
}

export default gsapEffect;

