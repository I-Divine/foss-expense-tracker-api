import { ExpenseCategory } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';

export class CreateExpenseDto {
  title: string;
  amount: number;
  category: ExpenseCategory;
  userId: number;
  user: User;
}
