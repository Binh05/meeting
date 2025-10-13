import { Input } from "@/components/ui/input";

export function InputForm({ ...props }: React.ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor={props?.id}>{props?.id}</label>
      <Input id={props?.id} {...props} className="mt-2" />
    </div>
  );
}
