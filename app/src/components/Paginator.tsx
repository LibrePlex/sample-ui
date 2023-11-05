import { Box, Button, Text, useMediaQuery } from "@chakra-ui/react";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { RiContractLeftLine } from "react-icons/ri";
import { RiContractRightLine } from "react-icons/ri";

export const Paginator = ({
  onPageChange,
  pageCount,
  currentPage,
}: {
  onPageChange: Dispatch<SetStateAction<number>>;
  pageCount: number;
  currentPage: number;
}) => {
  const range = 2;
  const pages = useMemo(() => {
    return [...Array(range * 2 + 1).keys()]
      .map((item) => Math.max(-range, -currentPage) + item + currentPage)
      .filter((item) => item >= 0 && item < pageCount);
  }, [pageCount, currentPage]);

  useEffect(() => {
    if (currentPage > pageCount - 1) {
      onPageChange(Math.max(pageCount - 1, 0));
    }
  }, [pageCount, currentPage]);

  const [matches] = useMediaQuery("(max-width: 800px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: matches ? "column" : "row",
        alignItems: "center",
        alignContents: "center",
      }}
    >
      {pageCount > 1 && (
        <Box
          rowGap={3}
          columnGap={3}
          sx={{ display: "flex", flexDirection: matches ? "column" : "row" }}
        >
          <Box display="flex" alignItems="center" columnGap={1}>
            <Button
              disabled={currentPage === 1}
              size="small"
              variant="contained"
              onClick={() => {
                onPageChange(0);
              }}
            >
              <RiContractLeftLine />
            </Button>

            {pages.map((item, idx) => (
              <Button
                colorScheme="teal"
                key={idx}
                onClick={() => {
                  onPageChange(item);
                }}
                sx={{ minWidth: "40px" }}
                size="small"
                variant={item === currentPage ? "solid" : "outline"}
              >
                {item + 1}
              </Button>
            ))}

            <Button
              disabled={currentPage === pageCount - 1}
              size="small"
              variant="contained"
              onClick={() => {
                onPageChange(pageCount - 1);
              }}
            >
              <RiContractRightLine />
            </Button>
          </Box>
          <Box>
            <Text textAlign={"center"} variant="body1">
              {pageCount} pages
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};
