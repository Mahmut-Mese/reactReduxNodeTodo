import React from "react";
import { MDBPagination, MDBPaginationItem, MDBBtn } from "mdb-react-ui-kit";
import { AppDispatch } from "../redux/store";
import { setCurrentPage } from "../redux/features/todoSlice";

interface PaginationProps {
  setCurrentPage: typeof setCurrentPage;
  currentPage: number;
  numberOfPages: number | null;
  dispatch: AppDispatch;
}

const Pagination: React.FC<PaginationProps> = ({
  setCurrentPage,
  currentPage,
  numberOfPages,
  dispatch,
}): React.JSX.Element => {
  const renderPagination = (): React.JSX.Element | null => {
    if (currentPage === numberOfPages && currentPage === 1) return null;
    if (currentPage === 1) {
      return (
        <MDBPagination center className="mb-0">
          <MDBPaginationItem>
            <p className="fw-bold mt-1">1</p>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              rounded
              className="mx-2"
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage !== numberOfPages) {
      return (
        <MDBPagination center className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              rounded
              className="mx-2"
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <p className="fw-bold mt-1">{currentPage}</p>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              rounded
              className="mx-2"
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination center className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              rounded
              className="mx-2"
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <p className="fw-bold mt-1">{currentPage}</p>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return <div className="mt-4">{renderPagination()}</div>;
};

export default Pagination;
