import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import * as bcrypt from 'bcryptjs';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }

  @CreateDateColumn()
  createdAt: Date;

  // @BeforeInsert()
  // async hashPassword(): Promise<any> {
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
}
