import Image from "next/image";

type BrandLogoProps = {
  size?: "header" | "footer";
};

export function BrandLogo({ size = "header" }: BrandLogoProps) {
  const isFooter = size === "footer";

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`relative shrink-0 overflow-hidden bg-white ${
          isFooter ? "size-[52px] rounded-2xl" : "size-10 rounded-xl"
        }`}
        aria-hidden="true"
      >
        <Image
          src="/images/cunnectit-logo.jpg"
          alt=""
          width={1254}
          height={1254}
          priority={!isFooter}
          className={`absolute max-w-none ${
            isFooter
              ? "-left-[41px] -top-[23px] w-[130px]"
              : "-left-[33px] -top-[18px] w-[104px]"
          }`}
        />
      </span>

      <span>
        <span
          className={`block font-semibold leading-none tracking-[-0.04em] text-[#051d4f] ${
            isFooter ? "text-2xl" : "text-base"
          }`}
        >
          cunnect<span className="text-[#08bddd]">it</span>
        </span>
        <span
          className={`mt-1 block font-mono font-semibold uppercase text-[#15315c]/65 ${
            isFooter
              ? "text-[8px] tracking-[0.16em]"
              : "text-[7px] tracking-[0.12em]"
          }`}
        >
          Connect · Innovate · Grow
        </span>
      </span>
    </span>
  );
}
