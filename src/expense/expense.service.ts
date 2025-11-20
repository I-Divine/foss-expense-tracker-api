import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Expense, ExpenseCategory } from '@prisma/client';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const newExpense = await this.prisma.expense.create({
      data: {
        title: createExpenseDto.title,
        amount: createExpenseDto.amount,
        category: createExpenseDto.category,
        date: new Date(),
        userId: createExpenseDto.userId,
      },
    });
    return newExpense;
  }

  async findAll() {
    const expenses: Expense[] = await this.prisma.expense.findMany({});
    return expenses;
  }

  async findOne(id: number) {
    try {
      const expense = await this.prisma.expense.findUniqueOrThrow({
        where: { id },
      });
      return expense;
    } catch (error) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    try {
      const updatedExpense = await this.prisma.expense.update({
        where: { id },
        data: {
          ...updateExpenseDto,
        },
      });
      return updatedExpense;
    } catch (error) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      const deletedExpense = await this.prisma.expense.delete({
        where: { id },
      });
      return deletedExpense;
    } catch (error) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }
  // Find expenses by user
  async findByUser(userId: number) {
    return await this.prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  // Find expenses by category
  async findByCategory(category: ExpenseCategory) {
    return await this.prisma.expense.findMany({
      where: { category },
    });
  }

  // Get total expenses for a user
  async getTotalByUser(userId: number) {
    const result = await this.prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}
