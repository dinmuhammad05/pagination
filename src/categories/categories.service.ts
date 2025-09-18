import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface Category {
  id?: number;
  name: string;
  description?: string;
  created_at?: Date;
}

@Injectable()
export class CategoriesService {
  constructor(private db: DatabaseService) {}

  async create(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await this.db.getPool().query(query, [
      categoryData.name,
      categoryData.description,
    ]);
    
    return result.rows[0];
  }

  async findAll(): Promise<Category[]> {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    const result = await this.db.getPool().query(query);
    return result.rows;
  }

  async findById(id: number): Promise<Category | null> {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await this.db.getPool().query(query, [id]);
    return result.rows[0] || null;
  }
}
