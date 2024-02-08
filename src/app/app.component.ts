import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { Observable, map } from 'rxjs';
import { Task } from './models/task.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  task$!: Observable<any>;
  taskControl!: FormControl;
  statusValue!: boolean;
  editTask = false;
  taskId!: string;
  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.task$ = this.taskService.getTasks();
    this.taskControl = this.formBuilder.control('', Validators.required);
  }
  onSubmitForm(e: Event) {
    e.preventDefault();

    const taskTitle = this.taskControl.value;
    if (!this.editTask) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        status: false,
        createdAt: new Date(),
      };
      this.taskService.createTask(newTask).subscribe(
        (res: any) => console.log('Réponse de la requéte', res),
        (err: any) => console.log('Erreur ', err)
      );
      this.taskControl.reset();
      window.location.reload();
    } else {
      this.taskService
        .updateTaskTitle({ id: this.taskId, title: taskTitle })
        .subscribe(
          (res) => console.log('Reponse, ' + res),
          (err) => console.log('Erreur ' + err)
        );
      window.location.reload();
      this.editTask = false;
      this.taskControl.reset();
    }
  }

  onDeleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(
      (res) => console.log('Reponse, ' + res),
      (err) => console.log('Erreur ' + err)
    );
    window.location.reload();
  }

  onChangeStatus(data: { id: string; status: boolean }) {
    this.taskService.updatedTaskStatus(data).subscribe(
      (res) => console.log('Reponse, ' + res),
      (err) => console.log('Erreur ' + err)
    );
    window.location.reload();
  }

  editTaskTitle(task: Task) {
    this.editTask = true;
    this.taskControl = this.formBuilder.control(task.title);
    this.taskId = task.id;
  }
}
