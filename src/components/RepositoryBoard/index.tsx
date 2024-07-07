"use server";
import { Edit } from "lucide-react";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import React from "react";
import Pagination from "~/components/sections/pagination";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import IssueImportModal from "./IssueImportModal";
import BoardTabsTrigger from "./BoardTabsTrigger";
import { getCounts } from "./action";

const TAB_VALUE = {
  published: "published",
  inprogress: "inprogress",
  inreview: "inreview",
  done: "done",
  draft: "draft",
};

const invoices = [
  {
    invoice: "#INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "#INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "#INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "#INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "#INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "#INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "#INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "#INV0011",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "#INV0022",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "#INV0033",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "#INV004a",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "#INV005x",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "#INV006g",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "#INV007f",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "#INV001a",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "#INV002j",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "#INV003o",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "#INV004r",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "#INV005v",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "#INV006p",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "#INV007q",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const RepositoryBoard = async ({
  b,
  repoId,
}: {
  b: string;
  repoId: string;
}) => {
  const count = await getCounts(repoId);
  return (
    <Tabs defaultValue={b || TAB_VALUE.published}>
      <div className="flex items-center justify-between">
        <BoardTabsTrigger b={b} count={count} />
        <IssueImportModal repoId={repoId} />
      </div>
      <TabsContent className="m-0" value={TAB_VALUE.published}>
        <div className="max-h-[calc(100vh-291px)] overflow-scroll ">
          <div className="min-h-[calc(100vh-291px)] pt-3">
            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              {/* <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.invoice}
                  onClick={() => {
                    console.log("you");
                  }}
                  className=" cursor-pointer"
                >
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell>Hey</TableCell>
                  <TableCell>{invoice.totalAmount}</TableCell>
                  <TableCell className=" text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-inherit"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("first");
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody> */}
              {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
            </Table>
          </div>
        </div>
        <Pagination page={1} totalPages={12} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inprogress}>
        <div className="max-h-[calc(100vh-291px)] overflow-scroll ">
          <div className="min-h-[calc(100vh-291px)] pt-3">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
              libero soluta illum adipisci voluptas sunt deserunt, amet omnis
              quidem, aperiam, nemo doloremque alias id fugiat cupiditate quis.
              Tempora, voluptatem delectus.
            </span>
          </div>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inreview}>
        <div className="max-h-[calc(100vh-291px)] overflow-scroll ">
          <div className="min-h-[calc(100vh-291px)] pt-3">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
              libero soluta illum adipisci voluptas sunt deserunt, amet omnis
              quidem, aperiam, nemo doloremque alias id fugiat cupiditate quis.
              Tempora, voluptatem delectus.
            </span>
          </div>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.done}>
        <div className="max-h-[calc(100vh-291px)] overflow-scroll ">
          <div className="min-h-[calc(100vh-291px)] pt-3">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
              libero soluta illum adipisci voluptas sunt deserunt, amet omnis
              quidem, aperiam, nemo doloremque alias id fugiat cupiditate quis.
              Tempora, voluptatem delectus.
            </span>
          </div>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.draft}>
        <div className="max-h-[calc(100vh-291px)] overflow-scroll ">
          <div className="min-h-[calc(100vh-291px)] pt-3">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
              libero soluta illum adipisci voluptas sunt deserunt, amet omnis
              quidem, aperiam, nemo doloremque alias id fugiat cupiditate quis.
              Tempora, voluptatem delectus.
            </span>
          </div>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
    </Tabs>
  );
};

export default RepositoryBoard;
