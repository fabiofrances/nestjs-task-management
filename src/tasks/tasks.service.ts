import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private tasksRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    //..
  }

  async getTasksById(id: string): Promise<Task> {
    const foundID = await this.tasksRepository.findOne(id);

    if (!foundID) {
      throw new NotFoundException(`Tasks with id "${id}" not found.`);
    }
    return foundID;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    const foundTask = await this.tasksRepository.delete(id);

    if (foundTask.affected === 0) {
      throw new NotFoundException(`Tasks with id "${id}" not found.`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTasksById(id);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }
}
