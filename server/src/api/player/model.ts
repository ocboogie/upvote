import WebSocket from "ws"
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Repository,
  Connection,
  BeforeRemove,
  AfterInsert
} from "typeorm"
import { emit, broadcast } from "../../wss"
import Lobby from "../lobby/model"
import Post from "../post/model"
import Vote from "../vote/model"

export type PlayerId = Player["id"]

export type PlayerForClient = Pick<Player, "id" | "name" | "avatar">

@Entity()
export default class Player {
  static r: Repository<Player>

  static init(connection: Connection) {
    this.r = connection.getRepository(Player)
  }

  static async deregister(socket: WebSocket, destroy = true) {
    const { id } = socket

    delete socket.id
    delete socket.lobbyId

    if (destroy) {
      const player = await Player.r.findOne(id)
      if (!player) {
        return
      }
      await Player.r.remove(player)
    }
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  avatar: string

  @Column()
  lobbyId: string

  @Column({ default: false })
  hosting: boolean

  @ManyToOne(type => Lobby, lobby => lobby.players, { onDelete: "CASCADE" })
  @JoinColumn({ name: "lobbyId" })
  lobby: Lobby

  @OneToMany(type => Post, post => post.author, {
    onDelete: "CASCADE"
  })
  posts: Post[]

  @OneToMany(type => Vote, vote => vote.voter, {
    onDelete: "CASCADE"
  })
  votes: Vote[]

  forClient(): PlayerForClient {
    return { id: this.id, name: this.name, avatar: this.avatar }
  }

  async register(socket: WebSocket): Promise<boolean> {
    if (socket.id) {
      emit(socket, "alreadyInALobby")
      return false
    }

    const existingPlayer = await Player.r.findOne({
      name: this.name,
      lobbyId: this.lobbyId
    })
    if (existingPlayer) {
      emit(socket, "existingPlayer")
      return false
    }

    await Player.r.save(this)

    socket.id = this.id
    socket.lobbyId = this.lobbyId
    return true
  }

  @AfterInsert()
  sendNewPlayerToClients() {
    broadcast(
      "newPlayer",
      this.lobbyId,
      this.forClient(),
      client => client.id !== this.id
    )
  }

  @BeforeRemove()
  updateClientsVotes() {
    return Vote.voterDisconnected(this)
  }

  @BeforeRemove()
  sendRemovedPostsToClients() {
    return Post.authorDisconnected(this)
  }

  @BeforeRemove()
  sendHostLeftIfHosting() {
    if (this.hosting) {
      return Lobby.hostDisconnected(this)
    }
  }

  @BeforeRemove()
  sendRemovedPlayerToClients() {
    broadcast(
      "removePlayer",
      this.lobbyId,
      this.id,
      client => client.id !== this.id
    )
  }
}
