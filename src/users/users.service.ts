import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
}

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async create(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await this.db.getPool().query(query, [
      userData.username,
      userData.email,
      userData.password,
    ]);
    
    return result.rows[0];
  }

  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await this.db.getPool().query(query);
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.db.getPool().query(query, [id]);
    return result.rows[0] || null;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const fields = Object.keys(userData).filter(key => userData[key] !== undefined);
    const values = fields.map(field => userData[field]);
    
    if (fields.length === 0) return null;
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const result = await this.db.getPool().query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.db.getPool().query(query, [id]);
    return result.rowCount > 0;
  }
}