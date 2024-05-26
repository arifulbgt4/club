import Link from "next/link";
import { getIssues } from "./action";

export default async function Home() {
  const issues = await getIssues();
  return (
    <div className="container">
      {issues.map((item) => (
        <Link
          href={`/issue/${item.id}`}
          key={item?.id}
          className="mb-2 flex flex-col items-start rounded-lg border p-3 text-left text-sm transition-all "
        >
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{item?.title}</div>
                {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                about 1 year ago
              </div>
            </div>
            <div className="text-xs font-medium">weekend olans</div>
          </div>
          <div className="line-clamp-2 text-xs text-muted-foreground">
            {/* {item.text.substring(0, 300)} */}
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro
            nihil commodi molestias sequi fugiat minus sunt, voluptates natus
            magnam. Adipisci id officia nulla esse dolore veritatis doloribus
            ut? Fuga, placeat.
          </div>
          {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
               ) : null} */}
        </Link>
      ))}
      {/* <Hero />
      <Features />
      <Pricing />
      <OpenSource /> */}
    </div>
  );
}
