import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { Observable, filter, map } from 'rxjs';
import { Task } from './models/task.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  task$!: Observable<Task[]>;
  form!: FormGroup;
  statusValue!: boolean;
  editTask = false;
  taskId!: string;
  listAllTask = true;
  completedTask$!: Observable<Task[]>;
  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.task$ = this.taskService.getTasks();
    this.completedTask$ = this.taskService
      .getTasks()
      .pipe(map((items) => items.filter((item) => item.status === true)));
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      deadline: [null, Validators.required],
    });
    this.completedTask$.subscribe((data) => console.log(data));
  }
  onSubmitForm(e: Event) {
    e.preventDefault();
    const values = this.form.value;

    if (!this.editTask) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: values.title,
        status: false,
        createdAt: new Date(),
        deadline: values.deadline,
      };
      this.taskService.createTask(newTask).subscribe(
        (res: any) => {
          console.log('Réponse de la requéte', res);
          this.task$ = this.taskService.getTasks();
        },
        (err: any) => console.log('Erreur ', err)
      );
      this.form.reset();
    } else {
      this.taskService
        .updateTaskTitle({
          id: this.taskId,
          title: values.title,
          deadline: values.deadline,
        })
        .subscribe(
          (res) => {
            console.log('Reponse, ' + res);
            this.task$ = this.taskService.getTasks();
          },
          (err) => console.log('Erreur ' + err)
        );

      this.editTask = false;
      this.form.reset();
    }
  }

  onDeleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(
      (res) => {
        console.log('Reponse, ' + res);
        this.task$ = this.taskService.getTasks();
      },
      (err) => console.log('Erreur ' + err)
    );
  }

  onChangeStatus(data: { id: string; status: boolean }) {
    this.taskService.updatedTaskStatus(data).subscribe(
      (res) => {
        console.log('Reponse, ' + res);
        this.listAllTask
          ? (this.task$ = this.taskService.getTasks())
          : (this.completedTask$ = this.taskService
              .getTasks()
              .pipe(
                map((items) => items.filter((item) => item.status === true))
              ));
      },
      (err) => console.log('Erreur ' + err)
    );
  }

  editTaskTitle(task: Task) {
    this.editTask = true;
    this.form.patchValue({
      title: task.title,
      deadline: task.deadline,
    });
    this.taskId = task.id;
  }
  isDateBeforeToday(date: Date) {
    const today = new Date();
    return new Date(date) < today;
  }
  viewAllTask() {
    this.listAllTask = true;
  }
  viewCompletedTask() {
    this.listAllTask = false;
  }
}
