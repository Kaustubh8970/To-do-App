import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    datafetch();
  });

  const datafetch = async () => {
    try {
      const response = await axios.get("http://localhost:8082/myapi");
      setItems(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addingdata = async (e) => {
    e.preventDefault();
    try {
      if (!editingId) {
        await axios.post("http://localhost:8082/myapi", { name, description });
      } else {
        await axios.put(`http://localhost:8082/myapi/${editingId}`, {
          name,
          description,
        });
        setEditingId(null);
      }
      datafetch();
      setName("");
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  const datadelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/myapi/${id}`);
      datafetch();
    } catch (err) {
      console.log(err);
    }
  };

  const handleedit = (data) => {
    setEditingId(data._id);
    setName(data.name);
    setDescription(data.description);
  };

  return (
    <>
      <section class="container">
        <div class="heading">
          <img
            class="heading__img"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/756881/laptop.svg"
          />
          <h1 class="heading__title">To-Do List</h1>
        </div>
        <form class="form" onSubmit={addingdata}>
          <div>
            <label class="form__label" for="todo">
              ~ Today I need to ~
            </label>
            <input
              class="form__input"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              class="form__input"
              placeholder="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <button class="button">
              <span>{editingId ? "update Task" : "Add Task"}</span>
            </button>
          </div>
        </form>
        <div>
          <ul>
            {items.map((item) => (
              <li key={item._id}>
                <h1>{item.name}</h1>
                <h1>{item.description}</h1>
                <div className="edbuttons">
                <button className="edit"
                  onClick={() => {
                    handleedit(item);
                  }}
                >
                  <span>
                    <AiTwotoneEdit />
                  </span>
                </button>
                <button className="delete"
                  onClick={() => {
                    datadelete(item._id);
                  }}
                >
                  <MdDelete />
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default App;
