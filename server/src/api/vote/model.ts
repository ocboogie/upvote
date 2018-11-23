import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Connection,
  Repository
} from "typeorm"
import Player from "../player/model"
import Post from "../post/model"
import { broadcast } from "../../wss"

@Entity()
export default class Vote {
  static r: Repository<Vote>

  static init(connection: Connection) {
    this.r = connection.getRepository(Vote)
  }

  static async voterDisconnected(disconnectingPlayer: Player) {
    const posts = await Post.r
      .createQueryBuilder("post")
      .select("post.id", "id")
      .addSelect(
        subQuery =>
          subQuery
            .from(Vote, "votes")
            .select("SUM(votes.vote)")
            .where("votes.postId = post.id")
            .andWhere("votes.voterId != :disconnectedId"),
        "upvotes"
      )
      .where("post.authorId != :disconnectedId")
      .innerJoin("post.votes", "votes", "votes.voterId = :disconnectedId")
      .setParameter("disconnectedId", disconnectingPlayer.id)
      .getRawMany()

    broadcast(
      "updatePosts",
      disconnectingPlayer.lobbyId,
      posts.reduce(
        (
          postAccumulator: { [key: number]: { upvotes: number } },
          post: { id: number; upvotes: number }
        ) => ({
          ...postAccumulator,
          [post.id]: { upvotes: post.upvotes || 0 }
        }),
        {}
      )
    )
  }

  @Column()
  vote: number

  @PrimaryColumn()
  voterId: number

  @ManyToOne(type => Player, player => player.votes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "voterId" })
  voter: Player

  @PrimaryColumn()
  postId: number

  @ManyToOne(type => Post, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post: Post

  async updateClients(ignoreSelf = false) {
    const data = await Promise.all([
      Vote.r
        .createQueryBuilder()
        .select("SUM(vote.vote)", "upvotes")
        .where("vote.postId = :postId", { postId: this.postId })
        .getRawOne(),
      Player.r
        .createQueryBuilder()
        .select("lobbyId")
        .where("id = :voterId", { voterId: this.voterId })
        .getRawOne()
    ])

    let upvotes: number = data[0].upvotes || 0
    const { lobbyId }: { lobbyId: string } = data[1]

    if (ignoreSelf) {
      upvotes -= this.vote
    }

    broadcast("updatePost", lobbyId, {
      id: this.postId,
      modPost: {
        upvotes
      }
    })
  }
}
