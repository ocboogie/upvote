import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  Repository,
  Connection,
  JoinColumn
} from "typeorm"
import { broadcast } from "../../wss"
import Player from "../player/model"
import Post from "../post/model"
import Prompt from "../prompt/model"

type LobbyStage = "game" | "lobby" | "break" | "waitingForPlayers"
export type LobbyId = Lobby["id"]

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
    default: "lobby"
  })
  stage: LobbyStage

  @Column({
    nullable: true
  })
  roundEndAt: Date

  @Column({ default: 60 })
  roundTime: number

  @OneToMany(type => Player, player => player.lobby)
  players: Player[]

  @OneToMany(type => Prompt, prompt => prompt.lobby)
  prompts: Prompt[]

  @Column({ nullable: true })
  hostId: number

  @OneToOne(type => Player, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hostId" })
  host: Player

  @Column({ nullable: true })
  activePromptId: number

  @OneToOne(type => Prompt)
  @JoinColumn({ name: "activePromptId" })
  activePrompt: Prompt

  async getWinner() {
    const posts = await Post.r
      .createQueryBuilder("post")
      .leftJoin("post.author", "author")
      .select("author.name", "authorName")
      .addSelect("author.id", "authorId")
      .leftJoin("post.votes", "votes")
      .where("post.lobbyId = :lobbyId", { lobbyId: this.id })
      .addSelect("COALESCE(SUM(`votes`.`vote`), 0)", "upvotes")
      .groupBy("post.id")
      .getRawMany()

    // TODO: Move the winner logic to sql
    if (!posts.length) {
      return
    }

    let max = -Infinity
    const winners: Set<number> = new Set()

    posts.forEach(post => {
      if (post.upvotes > max) {
        winners.clear()
        max = post.upvotes
      }
      if (post.upvotes === max) {
        winners.add(post.authorId)
      }
    })

    return winners
  }

  async roundEnd() {
    let winners = await this.getWinner()

    let hasPosts = true

    if (!winners) {
      hasPosts = false
      winners = new Set()
    }

    broadcast("roundEnded", this.id, Array.from(winners))

    await Lobby.r.update(this.id, { stage: "break" })
    if (hasPosts) {
      await Post.r.delete({ lobbyId: this.id })
    }

    this.scheduleNextRoundHandler()
  }

  updateRoundEndAt() {
    this.roundEndAt = new Date(Date.now() + this.roundTime * 1000)
  }

  async setupRound() {
    const playersExist = Boolean(
      await Player.r.findOne({
        where: {
          lobbyId: this.id
        }
      })
    )

    if (!playersExist) {
      await Lobby.r.update(this.id, {
        stage: "waitingForPlayers"
      })
      return
    }

    this.prompts = await Prompt.r.find({
      where: {
        lobbyId: this.id
      }
    })

    this.activePrompt = this.prompts[
      Math.floor(Math.random() * this.prompts.length)
    ]
    this.stage = "game"
    this.updateRoundEndAt()

    broadcast("gameStarted", this.id, {
      prompt: this.activePrompt.text,
      timeTillRoundEnd: this.roundEndAt.getTime() - Date.now()
    })

    this.scheduleRoundEndHandler()

    // Using update instead of save to prevent an unnecessary query
    await Lobby.r.update(this.id, {
      activePrompt: this.activePrompt,
      stage: this.stage,
      roundEndAt: this.roundEndAt
    })
  }

  scheduleRoundEndHandler() {
    setTimeout(() => {
      this.roundEnd()
    }, this.roundEndAt.getTime() - Date.now())
  }

  scheduleNextRoundHandler() {
    setTimeout(() => {
      this.setupRound()
    }, 5000)
  }
}
