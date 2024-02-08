import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}
  getTasks() {
    return this.http.get('http://localhost:3000/todos');
  }
  createTask(data: Task) {
    return this.http.post('http://localhost:3000/todos', data);
  }
}
