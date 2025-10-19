import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  startDestination!: string;

  @Column()
  endDestination!: string;

  @Column()
  locationType!: string;

  @Column()
  departTime!: Date;

  @Column()
  arriveTime!: Date;

  @Column()
  price!: number;
}
