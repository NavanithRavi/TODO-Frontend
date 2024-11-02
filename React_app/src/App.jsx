
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import './App.css'
function App() {
    const[todo,setTodo]=useState([]);
    const[Duedate,setDuedate]=useState('');
    const[title,setTitle]=useState('');
    const[Description,setDescription]=useState('');
    const[edit,setEdit]=useState(null);
    const[id,setEditid]=useState('');
    const[completed,setCompleted]=useState(false);
    const[error,setError]=useState('');
    const addTodo = (e) => {
        if(edit===null){
          fetch("http://localhost:3000/put",{
            method:"POST",
            body:JSON.stringify({
              id: uuidv4(),
              title:title,
              Description:Description,
              Duedate:Duedate
            }),
            headers:{
              "Content-Type":"application/json"
            }
          }).then((resp)=>{
            resp.json().then((resp)=>{
              setTodo((prevTodo)=>[...prevTodo,resp])
            })
          })
        }
        else{
          e.preventDefault();
         console.log(id);
          fetch("http://localhost:3000/update",{
            method:"PUT",
            body:JSON.stringify({
              id:id,
              title:title,
              Description:Description,
              Duedate:Duedate
            }),
            headers:{
              "Content-Type":"application/json"
            }
          }).then((resp)=>{
            resp.text().then((resp)=>{
              console.log(resp)
            })
          })
        }
        
      
      // const newTodo ={
      //  title:title,
      //  description:Description,
      //  completed:completed,
      //  Duedate:Duedate
      // }
      // if(edit!=null){
      //    setTodo((prevtodo)=>
      //     prevtodo.map((todo,index)=>
      //       index === edit ? newTodo : todo 
      //     )
      //    )
      //    setEdit(null)
      // }
      // else
      // {
      // setTodo((prevtodo)=>[...prevtodo,newTodo]);
      
      // }
      setTitle('')
      setDescription('')
      setDuedate('')
      // setEdit(false);
      // setEdit('');
    }
    const editItem =(id) => {
      const editTodo = todo.find((todoItem) => todoItem.id === id);
      setTitle(editTodo.title);
      setDescription(editTodo.Description);
      setDuedate(editTodo.Duedate)
      setEdit(true);
      setEditid(editTodo.id);
      console.log(id);
      console.log(edit);
    }
    useEffect(() => {
      console.log("Edit state updated:", edit);
  }, [edit]); 
    React.useEffect(() =>{
      setInterval(()=>{
      fetch("http://localhost:3000/getList",{
        method:"GET"
      }).then((resp)=>{
        resp.json().then((resp)=>{
        setTodo(resp);
    })})},1000)},[])
    const handelcheckbox= (checkindex) =>{
      setTodo((prevtodo)=>prevtodo.map((todo,index)=>
        index === checkindex ? { ...todo, completed: !todo.completed }: todo
      ))
    }
    const deleteItem=(id)=>{
      
      fetch("http://localhost:3000/delete",{
        method:"DELETE",
        body:JSON.stringify({
          id:id
        }),
        headers: { "Content-Type": "application/json" }
      }).then((resp)=>{
        resp.text().then((res)=>{
          console.log(res)
        })
      })
    }

   return (
    <>
    <h2>Todo App</h2>
     <form onSubmit={addTodo} > 
     <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={Description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          placeholder="Duedate"
          value={Duedate}
          onChange={(e) => setDuedate(e.target.value)}
        />
         <button type="submit">{edit != null ? "Update Todo" : "Add Todo"}</button>
     </form>
     <ul>
        {todo.map((todo,index) =>{
          return(
          <div>
            <li key={index}>
            <input 
                  type = "checkbox"
                  checked={todo.completed}
                  onChange={()=> handelcheckbox(index)}
                  />
                   
            <i>Title:{todo.title}</i>
            <br></br>
            <i>Description:{todo.Description}</i>
            <br>
            </br>
            <i>DueDate:{todo.Duedate}</i>
            <br>
            </br>
            {error && <p>{error}</p>}
            <button onClick={() => editItem(todo.id)}>edit</button>
            <button onClick={() => deleteItem(todo.id)}>delete</button>
          </li> 
          </div>
          )
          }
        )
        }
      </ul>
    
    </>
   )
}

export default App
