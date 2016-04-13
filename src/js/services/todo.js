import {Injectable, EventEmitter} from "angular2/core";
import {DB} from "../storage/forerunnerdb";

import {Observable} from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class Todo {
  emitter: EventEmitter = new EventEmitter;
  todos: Array<object> = [];

  constructor(){
    DB.load(() => {
      console.log('Loaded Database!');
    })
  }

  ngOnInit(){}

  fetch(){
    return new Observable((obs) => {
      obs.next(this.todos = DB.data())

      return () => console.log('done');
    })
    .delay(2500)
  }

  listen(){
    return this.emitter
  }

  save(){
    DB.save((x) => {
      this.emitter.next(this.todos)
    });
  }

  create(todo){
    todo.status = false;
    DB.insert(todo)
    this.save()
  }

  update(todo){
    DB.update({id: todo.id}, {
      content: todo.content,
      status: todo.status
    });
    this.save()
    return todo;
  }

  remove(index){
    DB.remove({id: index })
    this.save()
  }

  toggle(todo){
    todo.status = !todo.status;
    this.save()
  }

  toggleAll(){
    this.todos.forEach((t) => t.status = !t.status );
    this.save()
  }

  doneAll(){
    this.todos.forEach((t) => {
      if(t.status == false)
        t.status = true;
    });
    this.save()
  }

  undoneAll(){
    this.todos.forEach((t) => {
      if(t.status == true)
        t.status = false;
    });
    this.save()
  }
}
