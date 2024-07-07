import React from "react";
import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  more?: string;
  justify?: "start" | "end" | "center";
}

const Pagination = ({
  page,
  totalPages,
  more,
  justify = "center",
}: PaginationProps) => {
  const maxPagesToShow = 6;
  const halfRange = Math.floor(maxPagesToShow / 2);

  let start = Math.max(page - halfRange, 1);
  let end = Math.min(page + halfRange, totalPages);

  // Adjust start and end if they go out of bounds
  if (end - start < maxPagesToShow - 1) {
    if (start === 1) {
      end = Math.min(start + maxPagesToShow - 1, totalPages);
    } else if (end === totalPages) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }
  }

  const pageNumbers = [];
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }
  return (
    <PaginationContainer className={`my-1.5 justify-${justify}`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              page === 1
                ? ""
                : more
                  ? more + `&page=${page - 1}`
                  : `?page=${page - 1}`
            }
          />
        </PaginationItem>
        {pageNumbers.map((num) => (
          <PaginationItem key={num}>
            <PaginationLink
              href={more ? more + `&page=${num}` : `?page=${num}`}
              isActive={page === num}
            >
              {num}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={
              page === totalPages
                ? ""
                : more
                  ? more + `&page=${page + 1}`
                  : `?page=${page + 1}`
            }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  );
};

export default Pagination;
