import { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const query = `
        INSERT INTO users (korisnickoIme, email, uloga, lozinka, ime, prezime, bio, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.email,
        user.uloga,
        user.lozinka,
        user.ime,
        user.prezime,
        user.bio,
        user.avatar_url,
      ]);


      if (result.insertId) {
        // Vraćamo novog korisnika sa dodeljenim ID-om
        return new User(
          result.insertId,
          user.korisnickoIme,
          user.email,
          user.uloga,
          user.lozinka,
          user.ime,
          user.prezime,
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
      const query = `SELECT *FROM users WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(row.id, row.korisnickoIme, row.uloga, row.lozinka);
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async getByUsername(korisnickoIme: string): Promise<User> {
    try {
      const query = `
        SELECT id, korisnickoIme, email, uloga, lozinka, ime, prezime, bio, avatar_url, created_at
        FROM users
        WHERE korisnickoIme = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [korisnickoIme]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(
          row.id,
          row.korisnickoIme,
          row.email,
          row.uloga,
          row.lozinka,
          row.ime,
          row.prezime,
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
        SELECT id, korisnickoIme, email, uloga, lozinka, ime, prezime, bio, avatar_url, created_at
        FROM users
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);

      return rows.map(
        (row) => 
          new User(
            row.id,
            row.korisnickoIme,
            row.email,
            row.uloga,
            row.lozinka,
            row.ime,
            row.prezime,
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
        SET korisnickoIme = ?, lozinka = ? 
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.lozinka,
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
        SELECT id, korisnickoIme, email, uloga, lozinka, ime, prezime, bio, avatar_url, created_at
        FROM users
        WHERE email = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [email]);
      if (rows.length > 0) {
        const row = rows[0];
        return new User(
          row.id,
          row.korisnickoIme,
          row.email,
          row.uloga,
          row.lozinka,
          row.ime,
          row.prezime,
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
}