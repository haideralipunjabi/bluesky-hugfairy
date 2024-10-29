import classNames from "classnames";

export enum AlertTypes {
  SUCCESS,
  ERROR,
}
const configs = [
  "bg-green-300 text-green-900 outline-green-500",
  "bg-red-300 text-red-900 outline-red-500",
];

export default function Alert({
  children,
  type,
}: {
  children: React.ReactNode;
  type: AlertTypes;
}) {
  return (
    <div
      className={classNames(
        "md:text-l fixed bottom-20 left-10 right-10 mx-auto w-fit py-2 px-6 text-center text-sm outline lg:text-xl",
        configs[type],
      )}
    >
      {children}
    </div>
  );
}

export function SuccessAlert({ children }: { children: React.ReactNode }) {
  return <Alert type={AlertTypes.SUCCESS}>{children}</Alert>;
}
export function ErrorAlert({ children }: { children: React.ReactNode }) {
  return <Alert type={AlertTypes.ERROR}>{children}</Alert>;
}
