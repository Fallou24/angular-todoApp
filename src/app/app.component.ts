import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { Observable, map } from 'rxjs';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  task$!: Observable<any>;
  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    this.task$ = this.taskService.getTasks();
  }
}
