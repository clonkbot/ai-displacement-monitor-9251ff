export function Scanlines() {
  return (
    <>
      {/* CRT Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          )`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Static noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 static-bg opacity-30" />

      {/* Vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)`,
        }}
      />

      {/* Occasional scan line */}
      <div
        className="fixed left-0 right-0 h-[2px] pointer-events-none z-50 opacity-10"
        style={{
          background: 'linear-gradient(90deg, transparent, #00ff41, transparent)',
          animation: 'scan 8s linear infinite',
        }}
      />
    </>
  );
}
