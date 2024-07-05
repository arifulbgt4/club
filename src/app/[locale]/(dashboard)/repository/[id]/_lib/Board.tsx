"use client";
import {
  CircleCheckBig,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  Edit,
  RefreshCcwDot,
} from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Pagination from "~/components/sections/pagination";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import IssueImportModal from "./IssueImportModal";

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

const Board = ({ b, repoId }: { b: string; repoId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  console.log("path", pathname);
  return (
    <Tabs defaultValue={b || TAB_VALUE.published}>
      <div className="flex items-center justify-between">
        <TabsList className=" h-auto">
          <TabsTrigger
            value={TAB_VALUE.published}
            className="px-2.5 text-base"
            onClick={() => {
              if (b !== undefined || b !== TAB_VALUE.published) {
                router.push(pathname);
              }
            }}
          >
            <CircleDot className="mr-1.5 h-5 w-5 text-sky-500" /> Published (0)
          </TabsTrigger>
          <TabsTrigger
            value={TAB_VALUE.inprogress}
            className="px-2.5 text-base"
            onClick={() => {
              if (b !== TAB_VALUE.inprogress) {
                router.push(pathname + "?b=" + TAB_VALUE.inprogress);
              }
            }}
          >
            <CircleDotDashed className="mr-1.5 h-5 w-5 text-purple-500" /> In
            Progress (0)
          </TabsTrigger>
          <TabsTrigger
            value={TAB_VALUE.inreview}
            className="px-2.5 text-base"
            onClick={() => {
              if (b !== TAB_VALUE.inreview) {
                router.push(pathname + "?b=" + TAB_VALUE.inreview);
              }
            }}
          >
            <RefreshCcwDot className="mr-1.5 h-5 w-5 text-yellow-500" /> In
            Review (0)
          </TabsTrigger>
          <TabsTrigger
            value={TAB_VALUE.done}
            className="px-2.5 text-base"
            onClick={() => {
              if (b !== TAB_VALUE.done) {
                router.push(pathname + "?b=" + TAB_VALUE.done);
              }
            }}
          >
            <CircleCheckBig className="mr-1.5 h-5 w-5 text-green-500" /> Done
            (0)
          </TabsTrigger>
          <TabsTrigger
            value={TAB_VALUE.draft}
            className="px-2.5 text-base"
            onClick={() => {
              if (b !== TAB_VALUE.draft) {
                router.push(pathname + "?b=" + TAB_VALUE.draft);
              }
            }}
          >
            <CircleDashed className="mr-1.5 h-5 w-5" /> Draft (0)
          </TabsTrigger>
        </TabsList>
        <IssueImportModal repoId={repoId} />
      </div>
      <TabsContent className="m-0" value={TAB_VALUE.published}>
        <div className=" max-h-[calc(100vh-309px)] overflow-scroll">
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
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
            </TableBody>
            {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
          </Table>
        </div>
        <Pagination page={1} totalPages={12} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inprogress}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>inprogress</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inreview}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>inreview</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.done}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>done</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.draft}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>Draft</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
    </Tabs>
  );
};

export default Board;
