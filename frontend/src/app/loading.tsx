import Image from "next/image";

export default function Loading() {
  return (
    <section className="flex-1 h-full flex justify-center items-center">
      <Image
        src="/images/img-loader.svg"
        width={164}
        height={164}
        alt="جار التحميل ..."
      />
    </section>
  );
}
