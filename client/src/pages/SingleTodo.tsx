import React, { useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardImage,
  MDBContainer,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getTodo } from "../redux/features/todoSlice";
import { RootState, AppDispatch } from "../redux/store";

const SingleTodo: React.FC = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { todo } = useSelector((state: RootState) => state.todo);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getTodo(parseInt(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div
      style={{
        marginTop: "80px",
      }}
    >
      <MDBContainer>
        <MDBCard className="mb-3 mt-2">
          {todo && todo.imageFile && (
            <MDBCardImage
              position="top"
              style={{ width: "100%", maxHeight: "600px" }}
              src={todo.imageFile}
              alt={todo.title}
            />
          )}
          <MDBCardBody>
            <MDBBtn
              tag="a"
              color="none"
              style={{ float: "left", color: "#000" }}
              onClick={() => navigate("/")}
            >
              <MDBIcon
                fas
                size="lg"
                icon="long-arrow-alt-left"
                style={{ float: "left" }}
              />
            </MDBBtn>
            <h3>{todo?.title}</h3>
            <div style={{ float: "left" }}>
              <span className="text-start">
                {todo && todo.tags && Array.isArray(todo.tags) && todo.tags.map((item) => `#${item} `)}
              </span>
            </div>
            <br />
            <MDBCardText className="lead mb-0 text-start">
              {todo?.description}
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default SingleTodo;
