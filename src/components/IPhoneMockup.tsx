import iphoneFrame from "@/assets/iphone-frame.png";

interface IPhoneMockupProps {
  screenSrc: string;
  alt: string;
}

const IPhoneMockup = ({ screenSrc, alt }: IPhoneMockupProps) => {
  return (
    <div className="relative flex-shrink-0 w-[180px] sm:w-[200px]">
      {/* Screenshot positioned inside the frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={screenSrc}
          alt={alt}
          className="absolute rounded-[8.5%] object-cover"
          style={{
            top: "2.8%",
            left: "5.8%",
            width: "88.4%",
            height: "94.8%",
          }}
          loading="lazy"
        />
      </div>
      {/* Frame overlay */}
      <img
        src={iphoneFrame}
        alt=""
        className="relative z-10 w-full h-auto pointer-events-none"
        draggable={false}
      />
    </div>
  );
};

export default IPhoneMockup;
