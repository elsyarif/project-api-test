import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn
} from "typeorm"
import * as bcrypt from "bcrypt"

@Entity()
export class Users {
	@PrimaryGeneratedColumn("uuid", {
		primaryKeyConstraintName: "PK_Users"
	})
	id: string

	@Column()
	name: string

	@Column({
		unique: true,
		length: 35
	})
	email: string

	@Column({
		unique: true,
		length: 35
	})
	username: string

	@Column()
	password?: string

	@Column({
		default: false
	})
	is_active: boolean

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)"
	})
	create_at: Date

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)"
	})
	update_at: Date

	async hashPassword() {
		this.password = bcrypt.hashSync(this.password, 10)
	}

	async checkPassword?(password: string) {
		return bcrypt.compareSync(password, this.password)
	}
}
