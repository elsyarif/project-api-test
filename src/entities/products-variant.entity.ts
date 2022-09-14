import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import { Products } from "@entities//products.entity";

@Entity()
export class ProductVariant {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Products, {
		onDelete: 'CASCADE'
	})
	@JoinColumn({
		name: "product_id",
		referencedColumnName: "id",
		foreignKeyConstraintName: "fk_product_variant"
	})
	product: string;

	@Column({
		length: 35
	})
	sku: string;

	@Column({
		type: "varchar",
		length: 200
	})
	name: string;

	@Column({
		type: "varchar"
	})
	model: string;

	@Column({
		type: "decimal"
	})
	price: number;

	@Column({
		type: "decimal"
	})
	cost: number;

	@Column({
		type: "decimal"
	})
	stock: number;

	@Column({
		type: "decimal"
	})
	minimum: number;

	@Column({
		type: "varchar"
	})
	unit: string;
	
	@Column({
		type: "varchar"
	})
	description: string;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)"
	})
	create_at: Date;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)"
	})
	update_at: Date;

	@DeleteDateColumn()
	delete_at: Date;
}
