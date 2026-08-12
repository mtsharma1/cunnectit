import Image from "next/image";

type BrandLogoProps = {
  size?: "header" | "footer";
};

export function BrandLogo({ size = "header" }: BrandLogoProps) {
  const isFooter = size === "footer";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`relative shrink-0 overflow-hidden ${
          isFooter ? "size-14" : "size-10"
        }`}
        aria-hidden="true"
      >
        <Image
          src="/images/cunnectit-logo.jpg"
          alt=""
          width={1254}
          height={1254}
          priority={!isFooter}
          className={`absolute max-w-none mix-blend-multiply ${
            isFooter
              ? "-left-[45px] -top-[25px] w-[140px]"
              : "-left-[33px] -top-[18px] w-[104px]"
          }`}
        />
      </span>

      <span
        className={`flex shrink-0 flex-col justify-center ${
          isFooter ? "min-w-[224px]" : "min-w-[154px]"
        }`}
        aria-label="Cunnect IT — Connect, Innovate, Grow"
      >
        <span
          className={`whitespace-nowrap font-semibold leading-[0.82] tracking-[-0.055em] text-[#03255e] ${
            isFooter ? "text-[42px]" : "text-[28px]"
          }`}
        >
          Cunnect<span className="ml-[0.18em] uppercase text-[#04bfe7]">IT</span>
        </span>
        <span
          className={`mt-1 whitespace-nowrap font-mono font-semibold uppercase text-[#03255e]/70 ${
            isFooter
              ? "text-[7px] tracking-[0.2em]"
              : "text-[5px] tracking-[0.17em]"
          }`}
        >
          Connect <span className="text-[#04bfe7]">•</span> Innovate{" "}
          <span className="text-[#04bfe7]">•</span> Grow
        </span>
      </span>
    </span>
  );
}
