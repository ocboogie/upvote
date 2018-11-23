import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  JoinTable,
  Repository,
  Connection
} from "typeorm"
import { broadcast } from "../../wss"
import Player from "../player/model"

export interface ILobby {
  id: string
  prompt?: string
  inGame: boolean
  nextRoundAt?: Date
  roundTime: number
}

export interface NewLobby {
  id: string
  prompt?: string
  inGame?: boolean
  nextRoundAt?: Date
  roundTime?: number
}

@Entity()
export default class Lobby {
  static r: Repository<Lobby>

  static init(connection: Connection) {
    this.r = connection.getRepository(Lobby)
  }

  static async hostDisconnected(host: Player) {
    broadcast(
      "hostDisconnected",
      host.lobbyId,
      null,
      client => client.id !== host.id
    )
  }

  @PrimaryColumn()
  id: string

  @Column({
    nullable: true
  })
  prompt: string

  @Column({
    default: "0"
  })
  inGame: boolean

  @Column({
    nullable: true
  })
  nextRoundAt: Date

  @Column({
    default: "60"
  })
  roundTime: number

  @OneToMany(type => Player, player => player.lobby)
  players: Player[]

  @Column({ nullable: true })
  hostId: number

  @OneToOne(type => Player, { onDelete: "CASCADE" })
  @JoinTable({ name: "hostId" })
  host: Player
}
