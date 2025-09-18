import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface Post {
  id?: number;
  title: string;
  content: string;
  user_id: number;
  category_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PostWithDetails extends Post {
  username?: string;
  category_name?: string;
}

@Injectable()
export class PostsService {
  constructor(private db: DatabaseService) {}

  async create(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    const query = `
      INSERT INTO posts (title, content, user_id, category_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await this.db.getPool().query(query, [
      postData.title,
      postData.content,
      postData.user_id,
      postData.category_id,
    ]);
    
    return result.rows[0];
  }

  async findAll(): Promise<PostWithDetails[]> {
    const query = `
      SELECT 
        p.*,
        u.username,
        c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    const result = await this.db.getPool().query(query);
    return result.rows;
  }

  async findById(id: number): Promise<PostWithDetails | null> {
    const query = `
      SELECT 
        p.*,
        u.username,
        c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const result = await this.db.getPool().query(query, [id]);
    return result.rows[0] || null;
  }

  async findByUserId(userId: number): Promise<PostWithDetails[]> {
    const query = `
      SELECT 
        p.*,
        u.username,
        c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await this.db.getPool().query(query, [userId]);
    return result.rows;
  }
}
