/* eslint-disable @typescript-eslint/no-explicit-any */
import AttachPaymentMethod from "~/components/AttachPaymentMethod";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getInvoice, getPaymentMethods } from "./action";
import getPaymentMethodIcon from "~/components/shared/payment-method-icons";
import Remove from "./Remove";
import SetPrimary from "./SetPrimary";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Billing() {
  const { primary, additional } = await getPaymentMethods();
  const invoice = await getInvoice();
  console.log(invoice.data);
  return (
    <Card className="mb-10">
      <CardHeader className="mb-5">
        <CardTitle>Manage billing methods</CardTitle>
        <CardDescription>
          Add, update, or remove your billing methods.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex gap-5">
          <div className="w-1/2">
            {primary ? (
              <div>
                <h4 className=" mb-0.5 text-xl font-medium">Primary</h4>
                <p className="mb-3 text-sm text-muted-foreground">
                  Your primary billing method is used for all recurring
                  payments.
                </p>

                <div
                  key={primary?.id}
                  className=" flex max-w-96 flex-col items-center justify-between rounded border p-2.5 pl-4 sm:flex-row"
                >
                  <div className="mb-2 flex items-center sm:mb-0">
                    <div className=" scale-150">
                      {getPaymentMethodIcon(primary?.brand as string)()}
                    </div>

                    <span className=" ml-4 font-mono text-sm tracking-wide">
                      <span className=" mr-3 uppercase"> {primary?.brand}</span>{" "}
                      •••• {primary?.last4}
                    </span>
                  </div>
                  <Remove id={primary?.id as string} />
                </div>
              </div>
            ) : (
              <p className="mb-3 text-lg ">
                <span className=" font-bold">Missing billing info!</span> Add a
                payment method to publish paid issues. No charges until you
                publish.
              </p>
            )}
            {!!additional?.length && (
              <div>
                <h4 className=" mb-1 mt-10 text-xl font-medium">Additional</h4>
                {additional?.map((c) => (
                  <div
                    key={c?.id}
                    className=" flex max-w-[600px] flex-col items-center justify-between border-b p-5 sm:flex-row"
                  >
                    <div className="flex items-center">
                      <div className=" scale-125">
                        {getPaymentMethodIcon(c?.brand as string)()}
                      </div>{" "}
                      <span className=" ml-4 font-mono text-sm tracking-wide">
                        <span className="mr-3 uppercase"> {c?.brand}</span> ••••{" "}
                        {c?.last4}
                      </span>
                    </div>
                    <div className="flex">
                      <SetPrimary id={c?.id} />
                      <Remove id={c?.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-1/2"></div>
        </div>
      </CardContent>

      <CardFooter className=" flex-1 flex-col items-start justify-start">
        <AttachPaymentMethod />
      </CardFooter>
    </Card>
  );
}
