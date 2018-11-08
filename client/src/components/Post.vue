<template>
  <awsom-card paddingless class="post">
    <div class="upvotes">
      <button
        :class="{ 'is-selected': vote === 'upvote' }"
        class="arrow upvote"
        @click="upvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="12.5 12.5 25 25">
          <path d="M33.3 28.7L25 20.4l-8.3 8.3-1.4-1.4 9.7-9.7 9.7 9.7z" />
        </svg>
      </button>
      {{ upvotes }}
      <button
        :class="{ 'is-selected': vote === 'downvote' }"
        class="arrow downvote"
        @click="downvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="12.5 12.5 25 25">
          <path d="M25 32.4l-9.7-9.7 1.4-1.4 8.3 8.3 8.3-8.3 1.4 1.4z" />
        </svg>
      </button>
    </div>
    <div class="body">
      {{ content }}
      <div class="author">By {{ author }}</div>
    </div>
  </awsom-card>
</template>
<script>
import { mapActions } from "vuex"
import AwsomCard from "./AwsomCard.vue"

export default {
  components: {
    AwsomCard
  },
  props: {
    upvotes: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    vote: {
      type: String,
      default: "none"
    }
  },
  methods: {
    ...mapActions({ voteForPost: "vote" }),
    upvote() {
      this.voteForPost({
        id: this.id,
        vote: this.vote === "upvote" ? "none" : "upvote"
      })
    },
    downvote() {
      this.voteForPost({
        id: this.id,
        vote: this.vote === "downvote" ? "none" : "downvote"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
  margin-bottom: 1rem;

  display: flex;
  flex-direction: row;
  .upvotes {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    max-height: 65px;
    padding: 10px;
    .arrow {
      padding: 0;
      border: none;
      background-color: $white;
      width: 22.5px;
      height: 22.5px;
      transition: color 0.1s ease;
      outline: none;
      border-radius: 2.5px;
      cursor: pointer;

      &:focus {
        background-color: darken($white, 7.5%);
      }

      &.upvote {
        &.is-selected {
          fill: $primary-color;
        }

        &:hover {
          fill: lighten($primary-color, 10%);
        }

        &:active {
          fill: darken($primary-color, 10%);
        }
      }
      &.downvote {
        &.is-selected {
          fill: $error-color;
        }

        &:hover {
          fill: lighten($error-color, 5%);
        }

        &:active {
          fill: darken($error-color, 10%);
        }
      }
    }
  }
  .body {
    border-left: 1px solid $border-lighter-color;
    padding: 10px;

    min-height: 100%;
    .author {
      font-size: 0.9rem;
      color: lighten($text-primary-color, 35%);
    }
  }
}
</style>
