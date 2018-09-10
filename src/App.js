import React, { Component } from 'react';
import axios from "axios"
import './App.css';
let rootURL = "http://localhost:3000/todos";
class UnCompletedTasks extends React.Component{
  get = () => {
     if(this.props.task.star)
     return <i className="far fa-star fa-1x checked" ></i>

     return <i className="far fa-star fa-1x" ></i>
  }
  render()
  {
    return (<div className="task">
         <span><button onClick={() => this.props.finishedTask(this.props.task)}>
          <span><i class="fas fa-check-circle"></i></span>
         </button>
         {this.props.task.text}</span>
         <span className="taskActions">
         <button className="fav" onClick={() =>this.props.makeFavorite(this.props.task)}>{this.get()}</button>
         </span>
      </div>)
  }
}
class CompletedTasks extends React.Component
{
  get = () => {
    if(this.props.task.star)
    return <i className="far fa-star fa-1x checked" ></i>

    return <i className="far fa-star fa-1x" ></i>
 }
 render()
 {
   return (<div className="task">
        <span><button onClick={() => this.props.undoneTask(this.props.task)}>
         <span><i class="fas fa-times"></i></span>
        </button>
        {this.props.task.text}</span>
        <span className="taskActions">
        <button className="fav" onClick={() => this.props.makeFavorite(this.props.task)}>
        {this.get()}</button>
        </span>
     </div>)
 }
}
class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      toDos:[],
      newToDo:'',
      isClicked:false
    }
  }
  componentDidMount()
  {
    axios.get(rootURL)
     .then(res => this.setState({toDos:res.data}))
  }
  createNewToDo = () => {
    let newTask = {
      text:this.state.newToDo,
      done:false,
      star:false
    }
    axios.post(rootURL,newTask) 
     .then(res => this.setState({
       toDos:[...this.state.toDos, res.data]
     }))
  }
  makeFavorite = (task) => {
    console.log(task)
     axios.put(rootURL+`/${task.id}`,{
       ...task,
       star:!task.star
     }).then(res => this.setState({
       toDos:this.state.toDos.map(t =>{
         if(t.id === task.id)
          return res.data;
          
          return t;
       })
     }))
  }
  undoneTask = (task) => {
    axios.put(rootURL+`/${task.id}`,{
      ...task,
       done:false
    }).then(res =>this.setState({
      toDos:this.state.toDos.map(t => {
        if(t.id === task.id)
         return res.data;

         return t;
      })
    }))
  }
  finishedTask = (task) => {
    axios.put(rootURL+`/${task.id}`,{
      ...task,
        done:true
    }).then(res => this.setState({
      toDos:this.state.toDos.map(t => {
        if(t.id === task.id)
         return res.data;

         return t;
      })
    }))
  }
  render()
  {
    return (<div className="wrapper">
        <form className="newTaskForm">
          <input type="text" value={`${this.state.newToDo}`}
          placeholder="New Todo"
           onChange={(e) => this.setState({newToDo:e.target.value})}
           onKeyPress={(e) => {
             if(e.which === 13){
                this.createNewToDo()
              e.preventDefault()}
           }} />
        </form>
        <div className="uncompletedTask">
         <h4 className="center">UnCompleted Tasks         <br />
         <hr noshade></hr></h4>
          {this.state.toDos.filter(task =>!task.done)
            .map((task) =><UnCompletedTasks task={task} 
            makeFavorite={this.makeFavorite}
            finishedTask={this.finishedTask}
            />)}
        </div>
        <div className="completedTasks">
        <h4 className="center">Completed Tasks
         <br />
         <hr></hr>
        </h4>
          {this.state.toDos.filter(task => task.done)
            .map((task) => <CompletedTasks task={task} makeFavorite={this.makeFavorite}
            undoneTask={this.undoneTask}/>)}
        </div>
     </div>)
  }
}
export default App;
