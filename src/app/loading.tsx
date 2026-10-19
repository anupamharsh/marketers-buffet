import { ClocheLoader } from "@/components/brand/ClocheLoader";

export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <ClocheLoader />
    </div>
  );
}
