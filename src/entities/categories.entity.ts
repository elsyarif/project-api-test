import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn
} from "typeorm";
import * as slug from 'slug';
import { Products } from "./products.entity";

@Entity()
export class Categories {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({
		type: "varchar",
		length: 35
	})
	name: string

	@Column({
		type: "varchar",
		unique: true
	})
	slug: string

	@Column({
		type: "enum",
		enum: ["PUBLISH", "DRAFT"],
		default: "PUBLISH"
	})
	status: string

	@Column({
		type: "varchar",
		length: 100
	})
	description: string

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)"
	})
	created_at: Date

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)"
	})
	updated_at: Date

	@OneToMany(()=> Products, (product) => product.category)
	products: Products[]

	@BeforeInsert()
	@BeforeUpdate()
	assignSlug() {
		this.slug = slug(this.name)
	}
}
