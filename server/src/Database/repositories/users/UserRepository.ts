import { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { UserRole } from "../../../Domain/enums/UserRole";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const query = `
        INSERT INTO users (username, email, role, password, first_name, last_name, bio, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.username,
        user.email,
        user.role,
        user.password,
        user.first_name,
        user.last_name,
        user.bio,
        user.avatar_url,
      ]);


      if (result.insertId) {
        // Vraćamo novog korisnika sa dodeljenim ID-om
        return new User(
          result.insertId,
          user.username,
          user.email,
          user.role,
          user.password,
          user.first_name,
          user.last_name,
          user.bio,
          user.avatar_url,
        );
      }

      // Vraćamo prazan objekat ako kreiranje nije uspešno
      return new User();
    } catch (error) {
      console.error('Error creating user:', error);
      return new User();
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const query =  `SELECT id, username, email, role, password,first_name, last_name, bio, avatar_url, created_at
                      FROM users
                      WHERE id = ?`;

      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(
          row.id,
          row.username,
          row.email,
          row.role,
          row.password,
          row.first_name,
          row.last_name,
          row.bio,
          row.avatar_url,
          row.created_at
        );
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async getByUsername(username: string): Promise<User> {
    try {
      const query = `
        SELECT id, username, email, role, password, first_name, last_name, bio, avatar_url, created_at
        FROM users
        WHERE username = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [username]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(
          row.id,
          row.username,
          row.email,
          row.role,
          row.password,
          row.first_name,
          row.last_name,
          row.bio,
          row.avatar_url,
          row.created_at
        );
      }

      return new User();
    } catch (error) {
      console.log("user get by username: " + error);
      return new User();
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const query = `
        SELECT id, username, email, role, password, first_name, last_name, bio, avatar_url, created_at
        FROM users
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);

      return rows.map(
        (row) => 
          new User(
            row.id,
            row.username,
            row.email,
            row.role,
            row.password,
            row.first_name,
            row.last_name,
            row.bio,
            row.avatar_url,
            row.created_at
          )
      );
    } catch {
      return [];
    }
  }

  async update(user: User): Promise<User> {
    try {
      const query = `
        UPDATE users 
        SET username = ?, password = ? 
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.username,
        user.password,
        user.id,
      ]);

      if (result.affectedRows > 0) {
        return user;
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM users 
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [id]);

      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE id = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      return rows[0].count > 0;
    } catch {
      return false;
    }
  }

  async getByEmail(email: string): Promise<User> {
    try{
      const query = `
        SELECT id, username, email, role, password, first_name, last_name, bio, avatar_url, created_at
        FROM users
        WHERE email = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [email]);
      if (rows.length > 0) {
        const row = rows[0];
        return new User(
          row.id,
          row.username,
          row.email,
          row.role,
          row.password,
          row.first_name,
          row.last_name,
          row.bio,
          row.avatar_url,
          row.created_at
        );
      }

    return new User();

    } catch (error) {
      console.log("getByEmail error: ", error);
      return new User();
    }
  }

  async updateRole(id: number, role: UserRole): Promise<boolean> {
    try{
      const query = `
        UPDATE users
        SET role = ?
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [role, id]);
      
      return result.affectedRows > 0;
    } catch (error){
      console.log("updateRole error: ", error);
      return false;
    }
  }

  async searchPublic(query: string): Promise<User[]> {
    try{
      const search = `%${query}%`;

      const sql = `
        SELECT id, username, email, role, password,first_name, last_name, bio, avatar_url, created_at
        FROM users
        WHERE username LIKE ?
        OR first_name LIKE ?
        OR last_name LIKE ?
        ORDER BY username ASC
        LIMIT 50
      `;

      const [rows] = await db.execute<RowDataPacket[]>(sql, [
        search,
        search,
        search
      ]);

      return rows.map(
        (row) => new User(
          row.id,
          row.username,
          row.email,
          row.role,
          row.password,
          row.first_name,
          row.last_name,
          row.bio,
          row.avatar_url,
          row.created_at 
        )
      );
    } catch(error){
      console.log("searchPublic users error: ", error);
      return [];
    }
  }

  async updateProfile(
    id: number, 
    username: string, 
    email: string, 
    first_name: string, 
    last_name: string, 
    bio: string, 
    avatar_url: string
  ): Promise<boolean> {
    try{
      const query = `
        UPDATE users
        SET username = ?, email = ?, first_name = ?, last_name = ?, bio = ?, avatar_url = ?
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        username,
        email,
        first_name,
        last_name,
        bio,
        avatar_url,
        id
      ]);

      return result.affectedRows > 0;
    } catch (error){
      console.log("updateProfile user error: ", error);
      return false;
    }
  }

  async updatePassword(id: number, hashedPassword: string): Promise<boolean> {
    try{
      const query = `
        UPDATE users
        SET password = ?
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [hashedPassword, id]);
      return result.affectedRows > 0;
    } catch(error){
      console.log("updatePassword user error: ", error);
      return false;
    }
  }
}