import { ImSpinner2 } from "react-icons/im";

export default function BuilderLoading() {
  return (
    <div className="flex items-center justify-center gap-4 w-full h-full">
      <ImSpinner2 className="animate-spin w-12 h-12" />
    </div>
  )
}