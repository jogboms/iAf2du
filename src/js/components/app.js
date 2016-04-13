import {Component} from 'angular2/core';
import {Title} from './title';
import {TodoItem} from './todoItems';
import {Todo} from '../services/todo';
import {Window} from '../nw/main';

import {Observable} from "rxjs/Observable";

let template = `
  <div class="menubar">
    <span *ngIf="0" title="top" (click)="Window.minimize()">-</span>
    <span *ngIf="0" title="bottom" (click)="Window.minimize()">-</span>
    <span title="minimize" (click)="Window.minimize()">-</span>
    <span title="quit" (click)="Window.close()">&times;</span>
  </div>

  <div class="main">
    <title-main [titleName]="title"></title-main>

    <br />

    <form (submit)="(edit.status) ? onEdit($event, todoElement) : onAdd($event, todoElement)" method="GET">
      <label>Todo</label>
      <input [focus]="edit.status == true" [class.focus]="edit.status == true" [value]="edit.status ? edit.todo.content : ''" autofocus="true" type="text" (keyup)="0" #todoElement placeholder=" this is what i af todo..." />
      <button type="reset" *ngIf="edit.status == true" (click)="onCancelEvent()" [class]="'cancel'">Cancel</button>
      <button type="submit" [disabled]="todoElement.value.trim().length < 3">Submit</button>
    </form>

    <h4 *ngIf="todoElement.value.length > 0" [ngStyle]="{backgroundColor: '#eee', margin:'0', padding: '15px 1em', fontSize: '14px', color: '#777'}">
      <em>{{todoElement.value}}</em>
      <div>...</div>
    </h4>

    <div *ngIf="!fetched">
      <br />
      <progress class="progress" value="{{count | async}}" max="100"></progress>
      <br />
      <a href="#" (click)="count = 0;$event.preventDefault()" class="btn"> refresh </a>
    </div>

    <div *ngIf="fetched && todos.length == 0">
      <br />
      <p>
        <small>You currently have an empty List</small>
      </p>
      <br />
    </div>

    <div *ngIf="fetched && todos.length > 0">
      <todo-item *ngFor="#todo of todos" (todoEdit)="onEditEvent($event)" (todoRemoved)="onDeleteEvent($event)" (todoChanged)="onDoneEvent($event)" [todoItem]="todo"></todo-item>

      <br />
      <div>
        <div>

          <a href="#" (click)="onDoneAllEvent($event)" class="btn opt">All?</a>
          <a href="#" (click)="onUndoneAllEvent($event)" class="btn opt">None?</a>

        </div>

        <br />
        <p>
          <small><strong>{{todos.length}}</strong> item(s)</small>
          &middot;
          <small><strong>{{getDone().length}}</strong> done</small>
          &middot;
          <small><strong>{{getUndone().length}}</strong> undone</small>
        </p>
      </div>
    </div>
  </div>
`
@Component({
  selector: 'main',
  template: template,
  providers: [Todo],
  directives: [Title, TodoItem]
})

export class App {
  __todo: Todo = null;
  todos: Array<object> = [];
  edit = {status: false};
  fetched = false;

  constructor(todo: Todo){
    this.Window = Window;
    this.title = this.Window.App.name
    this.__todo = todo;

    this.count = new Observable((obs) => {
      let count = 0, int = setInterval(() => obs.next(count += 20), 1000);

      return () => clearInterval(int);
    })
  }

  getDone(){
    return this.todos.filter((t) => t.status === true)
  }

  getUndone(){
    return this.todos.filter((t) => t.status === false)
  }

  ngOnInit(){
    this.__todo.fetch()
      .subscribe((todos) => {
        this.todos = todos
        this.fetched = true
      })
  }

  onAdd(e, input){
    this.__todo.create({content: input.value})
    input.value = "";
    e.preventDefault()
  }

  onEdit(e, input){
    this.__todo.update({id: this.edit.todo.id, content: input.value});
    this.onCancelEvent()
    e.preventDefault()
  }

  onCancelEvent(){
    this.edit.status = false;
  }

  onUndoneAllEvent(e){
    this.__todo.undoneAll();
    e.preventDefault()
  }

  onDoneAllEvent(e){
    this.__todo.doneAll();
    e.preventDefault()
  }

  onSwitchAllEvent(e){
    this.__todo.toggleAll();
    e.preventDefault()
  }

  onDoneEvent(todo){
    this.__todo.toggle(todo);
    return false;
  }

  onEditEvent(todo){
    this.edit = {todo: todo, status: true};
    return false;
  }

  onDeleteEvent(id){
    this.__todo.remove(id);
    return false;
  }
}
