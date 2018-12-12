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
import schedule from "node-schedule"
import { broadcast } from "../../wss"
import Player from "../player/model"
import Post from "../post/model"
import Prompt from "../prompt/model"

type LobbyStage = "game" | "lobby" | "break" | "waitingForPlayers"

export interface ILobby {
  id: string
  prompt?: string
  stage: LobbyStage
  roundEndAt?: Date
  roundTime: number
}

export interface NewLobby {
  id: string
  prompt?: string
  stage?: LobbyStage
  roundEndAt?: Date
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
    let winners: { [key: number]: string } = {}

    posts.forEach(post => {
      if (post.upvotes > max) {
        winners = {}
        max = post.upvotes
      }
      if (post.upvotes === max) {
        winners[post.authorId] = post.authorName
      }
    })

    return winners
  }

  async roundEnd() {
    let winners = await this.getWinner()

    if (winners) {
      await Post.r.delete({ lobbyId: this.id })
    } else {
      winners = {}
    }

    Lobby.r.update(this.id, { stage: "break" })
    broadcast("roundEnded", this.id, Object.values(winners))
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

    // Using update instead of save to prevent an unnecessary query
    await Lobby.r.update(this.id, {
      activePrompt: this.activePrompt,
      stage: this.stage,
      roundEndAt: this.roundEndAt
    })

    this.scheduleRoundEndHandler()

    broadcast("gameStarted", this.id, {
      prompt: this.activePrompt.text,
      roundEndAt: this.roundEndAt
    })
  }

  scheduleRoundEndHandler() {
    schedule.scheduleJob(this.roundEndAt, () => {
      this.roundEnd()
    })
  }

  scheduleNextRoundHandler() {
    setTimeout(() => {
      this.setupRound()
    }, 5000)
  }
}
