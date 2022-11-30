import React, { useEffect } from "react";
import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBCardGroup,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteTodo, getTodosByUser } from "../redux/features/todoSlice";
import { setCurrentPage } from "../redux/features/todoSlice";
import Pagination from "../components/Pagination";
import { searchTodos } from "../redux/features/todoSlice";
import { useState } from "react";


const Dashboard = () => {
  const [search, setSearch] = useState("");

  const { user } = useSelector((state) => ({ ...state.auth }));
  const { userTodos, currentPage, searches } = useSelector(
    (state) => ({ ...state.todo })
  );
  const { numberOfPages } = useSelector((state) => ({ ...state.todo }));
  const [currentTodos, setCurrent] = useState();
 

  const userId = user?.result?._id;
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrent(userTodos);
  },[userTodos]);

  useEffect(() => {
    if (search.length >= 2) {
  setCurrent(searches);
    }
   // eslint-disable-next-line
  },[searches]);



  useEffect(() => {
    if (userId) {
      dispatch(getTodosByUser({ userId, currentPage }));

    }
     // eslint-disable-next-line
  }, [currentPage]);

  useEffect(() => {
     // eslint-disable-next-line
    if (search.length >= 2) {
      dispatch(searchTodos(search));
    } else if (search.length < 2) {
      setCurrent(userTodos);
    }
     // eslint-disable-next-line
  }, [search,currentPage]);
  const excerpt = (str) => {
    if (str.length > 40) {
      str = str.substring(0, 40) + " ...";
    }
    return str;
  };


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this todo ?")) {
      dispatch(deleteTodo({ id }));
    }
  };



  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "600px",
        alignContent: "center",
        padding: '120px 10px'
      }}
    >
      <div
      style={{
        height: "75px",
        position: "relative",
      }}
    >
        <MDBBtn href="/AddTodo" style={{ width: "auto",marginBottom:"20px",position:"absolute",right:"0" }}>
                { "Add New" }
              </MDBBtn>
              </div>
      <form className="d-flex input-group w-auto mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search Todo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      
      </form>
    

  

      {currentTodos &&
        currentTodos.length > 0 &&
        currentTodos.map((item) => (
          <MDBCardGroup key={item._id}>
            <MDBCard style={{ maxWidth: "680px" }} className="mt-2">
              <MDBRow className="g-0">
                <MDBCol md="3">
                  <MDBCardImage
                    className="rounded"
                    src={item.imageFile}
                    alt={item.title}
                    fluid
                  />
                </MDBCol>
                <MDBCol md="9">
                  <MDBCardBody>
                    <div>
                      <MDBCardTitle className="text-start">
                        {item.title}
                      </MDBCardTitle>
                      <MDBCardText className="text-start">
                        <small className="text-muted">
                          {excerpt(item.description)}
                        </small>
                      </MDBCardText>
                    </div>
                    <div
                      style={{
                        marginLeft: "5px",
                        float: "right",
                        marginTop: "-60px",
                      }}
                    >
                      <MDBBtn className="mt-1 me-1" tag="a" color="none">
                        <Link to={`/todo/${item._id}`}>
                          <MDBIcon
                            fas
                            icon="eye"
                            style={{ color: "#dd4b39" }}
                            size="lg"
                          />
                        </Link>
                      </MDBBtn>
                      <MDBBtn className="mt-1" tag="a" color="none">
                        <MDBIcon
                          fas
                          icon="trash"
                          style={{ color: "#dd4b39" }}
                          size="lg"
                          onClick={() => handleDelete(item._id)}
                        />
                      </MDBBtn>
                      <Link to={`/editTodo/${item._id}`}>
                        <MDBIcon
                          fas
                          icon="edit"
                          style={{ color: "#55acee", marginLeft: "10px" }}
                          size="lg"
                        />
                      </Link>
                    </div>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCardGroup>
        ))}
      {currentTodos?.length > 0 && !search  &&(
        <Pagination
          setCurrentPage={setCurrentPage}
          numberOfPages={numberOfPages}
          currentPage={currentPage}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default Dashboard;
