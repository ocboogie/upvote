import {
  Entity,
  Column,
  JoinTable,
  Repository,
  Connection,
  PrimaryGeneratedColumn,
  ManyToOne
} from "typeorm"
import Lobby from "../lobby/model"

@Entity()
export default class Prompt {
  static r: Repository<Prompt>

  static init(connection: Connection) {
    this.r = connection.getRepository(Prompt)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @Column()
  lobbyId: string

  @ManyToOne(type => Lobby, lobby => lobby.prompts, { onDelete: "CASCADE" })
  @JoinTable({ name: "lobbyId" })
  lobby: Lobby
}
