import { NotFoundException } from '@nestjs/common';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    //send one parameters
    if (status) {
      query.where('task.status = :status', { status });
    }

    //send parameters search and not send status
    if (search && !status) {
      query.where(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    //send parameters search and status
    if (search && status) {
      query.where('task.status = :status', { status }).andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(task.title) LIKE LOWER(:status)', {
            search: `%${search}%`,
          }).orWhere('LOWER(task.description) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // createQueryBuilder("user")
    // .where("user.registered = :registered", { registered: true })
    // .andWhere(
    //     new Brackets((qb) => {
    //         qb.where("user.firstName = :firstName", {
    //             firstName: "Timber",
    //         }).orWhere("user.lastName = :lastName", { lastName: "Saw" })
    //     }),
    // )

    const task = await query.getMany();

    // exception when query return empty
    if (task.length === 0) {
      throw new NotFoundException(`Not found Tasks with your search.`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const newTask = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.save(newTask);
    return newTask;
  }
}
