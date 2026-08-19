import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export { useReducedMotion };

/** Scroll reveal wrapper — stagger-friendly, respects reduced motion. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Animated counter that starts when visible. Values are demo-safe labels. */
export function Counter({ to, prefix = "", suffix = "", duration = 1.4 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#01";

/** Scramble-decode text — signature label treatment. */
export function Scramble({ text, className, speed = 28 }: { text: string; className?: string; speed?: number }) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || reduce) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    let last = 0;
    const total = text.length;
    const tick = (now: number) => {
      if (now - last >= speed) {
        last = now;
        frame++;
        const settled = Math.floor((frame / (total + 8)) * total);
        let s = "";
        for (let i = 0; i < total; i++) {
          if (i < settled) s += text[i];
          else if (text[i] === " ") s += " ";
          else s += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        setOut(s);
        if (settled >= total) {
          setOut(text);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, reduce, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {out}
    </span>
  );
}

/** Line-mask reveal for display headings. */
export function MaskLines({ lines, className, delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            initial={reduce ? { opacity: 0 } : { y: "112%" }}
            whileInView={reduce ? { opacity: 1 } : { y: "0%" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
