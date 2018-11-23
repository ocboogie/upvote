import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Repository,
  Connection
} from "typeorm"
import { broadcast } from "../../wss"
import Player from "../player/model"
import Lobby from "../lobby/model"
import Vote from "../vote/model"

export interface IPost {
  id: number
  content: string
}

export interface PostForClient extends IPost {
  author: string
  upvotes: number
}

@Entity()
export default class Post {
  static r: Repository<Post>

  static init(connection: Connection) {
    this.r = connection.getRepository(Post)
  }

  static async authorDisconnected(disconnectingPlayer: Player) {
    const posts = await Post.r.find({
      select: ["id"],
      where: { authorId: disconnectingPlayer.id }
    })

    if (!posts.length) {
      return
    }

    broadcast(
      "removePosts",
      disconnectingPlayer.lobbyId,
      posts.map(post => post.id)
    )
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @Column()
  authorId: number

  @ManyToOne(type => Player, player => player.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" })
  author: Player

  @Column()
  lobbyId: string

  @ManyToOne(type => Lobby, { onDelete: "CASCADE" })
  @JoinColumn({ name: "lobbyId" })
  lobby: Lobby

  @OneToMany(type => Vote, vote => vote.post)
  votes: Vote[]
}
