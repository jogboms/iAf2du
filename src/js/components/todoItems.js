import {Component, EventEmitter} from 'angular2/core';

@Component({
  selector: 'todo-item',
  template: `
    <div [class]="'item'">
      <span class="btn"
        [style.backgroundColor]="(todo.status ? '#4CAF50' : '#F44336')"
        [class]="'state'">
        {{todo.status ? 'D': 'P'}}
      </span>

      &nbsp;

      <strong [class.undone]="todo.status == true">
        {{todo.content|uppercase}}
      </strong>

      &nbsp;

      <span [class]="'toolbar'">
        <a title="Done" href="#" class="btn" (click)="onSwitch($event)">
          S
        </a>
        <a title="Edit" href="#" class="btn" (click)="onEdit($event)">
          E
        </a>
        <a title="Remove" href="#" class="btn x" (click)="onDelete($event)">
          X
        </a>
      </span>
    </div>
  `,
  outputs: [
    'todoChanged', 'todoEdit', 'todoRemoved'
  ],
  inputs: [
    'todo: todoItem'
  ],
  styles: [
    `
    .item {
      overflow: hidden;
      text-align: left;
      background-color: #eee;
      padding: 10px 15px;
      margin: 2px auto;
      border: solid #e6e6e6 1px;
      transition: all ease-in-out .5s;
    }
    .item strong {
      word-wrap: break-word;
      display: inline-block;
      word-break: break-word;
      vertical-align: middle;
    }
    .item:hover {
      background: #f9f9f9;
    }
    .item:hover .toolbar .btn {
      background: #00BCD4;
      color: #f9f9f9;
    }
    .toolbar .btn {
      transition: all ease-in-out .5s;
    }
    .state {
      color: white;
      transition: all ease-in-out .35s;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      padding: 0 4pt;
    }
    .toolbar {
      float: right;
    }
    .undone {
      text-decoration: line-through;
      color: #bbb;
    }
    `
  ]
})
export class TodoItem {
  todo = {};
  todoChanged = new EventEmitter();
  todoEdit = new EventEmitter();
  todoRemoved = new EventEmitter();

  onSwitch(e){
    this.todoChanged.emit(this.todo)
    e.preventDefault();
  }

  onEdit(e){
    this.todoEdit.emit(this.todo)
    e.preventDefault();
  }

  onDelete(e){
    this.todoRemoved.emit(this.todo.id)
    e.preventDefault();
  }
}
