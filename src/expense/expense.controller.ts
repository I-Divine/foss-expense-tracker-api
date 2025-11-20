import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ExpenseCategory } from '@prisma/client';

@Controller('expense')
@UseGuards(JwtAuthGuard) // Protect all routes
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    // Override userId from token to prevent users from creating expenses for others
    createExpenseDto.userId = req.user.userId;
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  findAll(@Request() req) {
    // Only return expenses for the authenticated user
    return this.expenseService.findByUser(req.user.userId);
  }

  @Get('total')
  getTotalExpenses(@Request() req) {
    return this.expenseService.getTotalByUser(req.user.userId);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: ExpenseCategory, @Request() req) {
    // You'll need to filter by user in the service or add a new method
    return this.expenseService.findByCategory(category);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const expense = await this.expenseService.findOne(id);

    // Ensure user can only access their own expenses
    if (expense.userId !== req.user.userId) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req,
  ) {
    const expense = await this.expenseService.findOne(id);

    // Ensure user can only update their own expenses
    if (expense.userId !== req.user.userId) {
      throw new NotFoundException('Expense not found');
    }

    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const expense = await this.expenseService.findOne(id);

    // Ensure user can only delete their own expenses
    if (expense.userId !== req.user.userId) {
      throw new NotFoundException('Expense not found');
    }

    return this.expenseService.remove(id);
  }
}
