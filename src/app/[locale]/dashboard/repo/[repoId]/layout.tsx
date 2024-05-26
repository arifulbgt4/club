import GoBack from "~/components/go-back";

export default async function SingleProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-5 flex items-center">
        <GoBack />
      </div>
      {children}
    </>
  );
}
