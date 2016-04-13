import {Component} from 'angular2/core';

@Component({
  selector: 'title-main',
  template: `
    <h1
      [ngStyle] = "{
        background: '#E91E63',
        color: 'white',
        fontWeight: '100'
      }"
    >
      {{ title }}

    </h1>
  `,
  inputs: ['title: titleName']
})
export class Title {}
