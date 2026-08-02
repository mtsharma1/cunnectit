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
        className={`relative shrink-0 overflow-hidden ${
          isFooter ? "h-[52px] w-[220px]" : "h-9 w-[150px]"
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
              ? "-left-[33px] -top-[169px] w-[285px]"
              : "-left-[23px] -top-[115px] w-[195px]"
          }`}
        />
      </span>
    </span>
  );
}
