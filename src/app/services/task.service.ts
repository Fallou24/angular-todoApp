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

  deleteTask(id: string) {
    return this.http.delete('http://localhost:3000/todos/' + id);
  }
  updatedTaskStatus(taskInfo: { id: string; status: boolean }) {
    return this.http.patch('http://localhost:3000/todos/' + taskInfo.id, {
      status: !taskInfo.status,
    });
  }
  updateTaskTitle(taskInfo: { id: string; title: string; deadline: Date }) {
    return this.http.patch('http://localhost:3000/todos/' + taskInfo.id, {
      title: taskInfo.title,
      deadline: taskInfo.deadline,
    });
  }
}
