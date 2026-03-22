interface IPhoneMockupProps {
  screenSrc: string;
  alt: string;
}

const IPhoneMockup = ({ screenSrc, alt }: IPhoneMockupProps) => {
  return (
    <div className="relative flex-shrink-0 w-[180px] sm:w-[200px]">
      {/* iPhone 17 frame */}
      <div
        className="relative rounded-[44px] p-[6px] overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #D4854A 0%, #C97530 25%, #E8A060 50%, #B8682A 75%, #D4854A 100%)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.3), " +
            "0 4px 20px rgba(0,0,0,0.5), " +
            "0 8px 40px rgba(0,0,0,0.3), " +
            "inset 0 1px 1px rgba(255,255,255,0.25), " +
            "inset 0 -1px 1px rgba(0,0,0,0.15)",
        }}
      >
        {/* Inner bezel */}
        <div
          className="relative rounded-[38px] overflow-hidden"
          style={{
            background: "#1a1a1a",
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.8)",
          }}
        >
          {/* Dynamic island */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 w-[90px] h-[28px] bg-black rounded-full"
            style={{ boxShadow: "0 0 4px rgba(0,0,0,0.5)" }}
          />

          {/* Screen */}
          <div className="relative w-full overflow-hidden rounded-[38px]">
            <img
              src={screenSrc}
              alt={alt}
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Side button (power) */}
      <div
        className="absolute right-[-2.5px] top-[120px] w-[3px] h-[60px] rounded-r-sm"
        style={{
          background: "linear-gradient(180deg, #C97530 0%, #B8682A 50%, #C97530 100%)",
          boxShadow: "1px 0 2px rgba(0,0,0,0.3)",
        }}
      />
      {/* Volume buttons */}
      <div
        className="absolute left-[-2.5px] top-[100px] w-[3px] h-[30px] rounded-l-sm"
        style={{
          background: "linear-gradient(180deg, #C97530 0%, #B8682A 50%, #C97530 100%)",
          boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
        }}
      />
      <div
        className="absolute left-[-2.5px] top-[140px] w-[3px] h-[30px] rounded-l-sm"
        style={{
          background: "linear-gradient(180deg, #C97530 0%, #B8682A 50%, #C97530 100%)",
          boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
};

export default IPhoneMockup;
