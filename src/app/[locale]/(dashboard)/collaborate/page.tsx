export default function CollaboratePage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h3 className=" text-xl font-semibold">
          The collaborator board only for private repository
        </h3>
        <p className="text-muted-foreground">
          If you are ina repository Collaborator then you can see those
          repository in left side list.
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className=" text-xl font-semibold">
          You are able to see list of issues in a repositorys assigned
        </h3>
        <p className="text-muted-foreground">
          If you are ina repository Collaborator then you can see those
          repository in left side list.
        </p>
      </div>
    </div>
  );
}
