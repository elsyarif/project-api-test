import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UsersGroup {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({
		type: 'varchar',
		unique: true,
		length: 30
	})
	name: string

	@Column({
		type: 'text',
	})
	description: string
}
