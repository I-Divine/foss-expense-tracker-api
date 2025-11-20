import { ExpenseCategory } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';

export class Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  userId: number;
  user: User;
  createdAt: Date;
}
