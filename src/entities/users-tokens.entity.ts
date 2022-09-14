import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from "typeorm"
import { Users } from "@entities/users.entity"

@Entity()
export class UsersTokens {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@ManyToOne(() => Users)
	@JoinColumn({
		name: "user_id",
		referencedColumnName: "id",
		foreignKeyConstraintName: "fk_token_users"
	})
	user: string

	@Column({
		type: 'text',
	})
	access_token: string

	@Column({
		type: 'text'
	})
	refresh_token: string

	@Column({
		length: 30
	})
	ip: string

	@Column({
		type: 'varchar',
		length: 250
	})
	user_agent: string
}
