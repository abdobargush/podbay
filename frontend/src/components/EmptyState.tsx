import Image from "next/image";

const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Image
        src="/images/img-empty.png"
        width={200}
        height={200}
        alt="أبحر في خليج البودكاست 🌊"
        className="rounded grayscale opacity-70"
      />
      <p className="mt-2 text-neutral-400 text-lg">أبحر في خليج البودكاست 🌊</p>
    </div>
  );
};

export default EmptyState;
