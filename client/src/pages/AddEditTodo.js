import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBValidation,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import FileBase from "react-file-base64";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTodo, updateTodo, getTodo } from "../redux/features/todoSlice";

const initialState = {
  title: "",
  description: "",
  tags: [],
};

const AddEditTodo = () => {
  const [todoData, setTodoData] = useState(initialState);
  const [tagErrMsg, setTagErrMsg] = useState(null);
  const { userTodos, todo } = useSelector((state) => ({
    ...state.todo,
  }));
  const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { title, description, tags } = todoData;
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      let singleTodo = userTodos.find((todo) => todo.id === parseInt(id));
      
      if (!singleTodo) {
        dispatch(getTodo(id));
        return;
      }
      
      if (singleTodo) {
        const tagsArray = Array.isArray(singleTodo.tags) ? singleTodo.tags : 
                         (typeof singleTodo.tags === 'string' ? singleTodo.tags.split(',').filter(tag => tag.trim()) : []);
        setTodoData({ 
          ...singleTodo, 
          tags: tagsArray 
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id && todo && todo.id === parseInt(id)) {
      console.log('Todo fetched from API:', todo);
      const tagsArray = Array.isArray(todo.tags) ? todo.tags : 
                       (typeof todo.tags === 'string' ? todo.tags.split(',').filter(tag => tag.trim()) : []);
      setTodoData({ 
        ...todo, 
        tags: tagsArray 
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todo, id]);

 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tags.length <= 0) {
      setTagErrMsg("Please provide some tags");
    }
    if (title && description && tags) {
      const updatedTodoData = { ...todoData, name: user?.result?.name };

      if (!id) {
        dispatch(createTodo({ updatedTodoData, navigate }));
      } else {
        dispatch(updateTodo({ id, updatedTodoData, navigate }));
      }
      handleClear();
    }
  };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setTodoData({ ...todoData, [name]: value });
  };
  const handleAddTag = (tag) => {
    const { name, value } = tag.target;
    
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    setTodoData({ ...todoData, [name]: tagsArray });
    setTagErrMsg(null);
  };

  const handleClear = () => {
    setTodoData({ title: "", description: "", tags: [] });
  };
  return (
    <div
      style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "450px",
        alignContent: "center",
        marginTop: "120px",
      }}
      className="container"
    >
      <MDBCard alignment="center">
        <h5>{id ? "Update Todo" : "Add Todo"}</h5>
        <MDBCardBody>
          <MDBValidation onSubmit={handleSubmit} className="row g-3" noValidate>
            <div className="col-md-12">
              <MDBInput
                placeholder="Enter Title"
                type="text"
                value={title || ""}
                name="title"
                onChange={onInputChange}
                className="form-control"
                required
                invalid
                validation="Please provide title"
              />
            </div>
            <div className="col-md-12">
              <MDBInput
                placeholder="Enter Description"
                type="text"
                value={description}
                name="description"
                onChange={onInputChange}
                className="form-control"
                required
                invalid
                textarea
                rows={4}
                validation="Please provide description"
              />
            </div>
            <div className="col-md-12">
              <MDBInput
                type="text"
                 name="tags"
                 placeholder="Enter Tags (comma-separated)"
                 className="form-control"
                 value={Array.isArray(tags) ? tags.join(', ') : tags || ''}
                 onChange={(tag) => handleAddTag(tag)}
               />
              {tagErrMsg && <div className="tagErrMsg">{tagErrMsg}</div>}
            </div>
            <div className="d-flex justify-content-start">
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) =>
                  setTodoData({ ...todoData, imageFile: base64 })
                }
              />
            </div>
            <div className="col-12">
              <MDBBtn type="submit" style={{ width: "100%" }}>
                {id ? "Update" : "Submit"}
              </MDBBtn>
              <MDBBtn
                style={{ width: "100%" }}
                className="mt-2"
                color="danger"
                onClick={handleClear}
              >
                Clear
              </MDBBtn>
            </div>
          </MDBValidation>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default AddEditTodo;
