import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface Comment {
  id?: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at?: Date;
}

export interface CommentWithDetails extends Comment {
  username?: string;
  post_title?: string;
}

@Injectable()
export class CommentsService {
  constructor(private db: DatabaseService) {}

  async create(commentData: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> {
    const query = `
      INSERT INTO comments (content, user_id, post_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await this.db.getPool().query(query, [
      commentData.content,
      commentData.user_id,
      commentData.post_id,
    ]);
    
    return result.rows[0];
  }

  async findByPostId(postId: number): Promise<CommentWithDetails[]> {
    const query = `
      SELECT 
        c.*,
        u.username,
        p.title as post_title
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN posts p ON c.post_id = p.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `;
    const result = await this.db.getPool().query(query, [postId]);
    return result.rows;
  }

  async findAll(): Promise<CommentWithDetails[]> {
    const query = `
      SELECT 
        c.*,
        u.username,
        p.title as post_title
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN posts p ON c.post_id = p.id
      ORDER BY c.created_at DESC
    `;
    const result = await this.db.getPool().query(query);
    return result.rows;
  }
}