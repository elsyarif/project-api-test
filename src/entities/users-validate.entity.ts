import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UsersValidate {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	type: string;

	@Column()
	user: string;

	@Column()
	validateToken: string;

	@Column()
	validateCode: string;

	@Column()
	validTime: number;
}
