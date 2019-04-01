<template>
  <base-card paddingless class="post">
    <div class="upvotes">
      <button
        :class="{ 'is-selected': vote === 'upvote' }"
        class="arrow upvote"
        @click="upvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 15">
          <path
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="5"
            d="m2.5 12.5l10-10 10 10"
          />
        </svg>
      </button>
      {{ upvotes }}
      <button
        :class="{ 'is-selected': vote === 'downvote' }"
        class="arrow downvote"
        @click="downvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 15">
          <path
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="5"
            d="m2.5 2.5l10 10 10-10"
          />
        </svg>
      </button>
    </div>
    <div class="body">{{ content }}</div>
    <div class="author">
      <div class="avatar-container"><avatar :avatar-data="avatar" /></div>
      <div class="name-container">{{ author }}</div>
    </div>
  </base-card>
</template>
<script>
import { mapActions } from "vuex"
import Avatar from "./Avatar.vue"

export default {
  components: {
    Avatar
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
    avatar: {
      type: String,
      required: true
    },
    id: {
      type: Number,
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
$arrowCircleSize: 31.25px;
$avatarCircleSize: 65px;

.post {
  margin: 2rem 0;
  min-height: 85px;

  display: flex;
  flex-direction: row;
  .upvotes {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-width: 40px;
    .arrow {
      position: absolute;
      border-radius: 50%;
      border: none;
      background-color: $white;
      width: $arrowCircleSize;
      height: $arrowCircleSize;
      transition: color 0.1s ease;
      outline: none;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.09);
      stroke: #3d3d3d;
      padding: 3px;
      cursor: pointer;

      & > svg {
        display: block;
        margin: auto;
      }

      &:focus {
        background-color: darken($white, 7.5%);
      }

      &.upvote {
        top: -$arrowCircleSize / 5 * 2;
        &.is-selected {
          stroke: $primary-color;
        }

        &:hover {
          stroke: lighten($primary-color, 10%);
        }

        &:active {
          stroke: darken($primary-color, 10%);
        }
      }
      &.downvote {
        bottom: -$arrowCircleSize / 5 * 2;
        &.is-selected {
          stroke: $error-color;
        }

        &:hover {
          stroke: lighten($error-color, 5%);
        }

        &:active {
          stroke: darken($error-color, 10%);
        }
      }
    }
  }
  .body {
    border-left: 1px solid $border-lighter-color;
    padding: 10px;
    word-break: break-word;
    flex-grow: 1;
  }
  .author {
    max-width: 110px;
    text-align: center;
    padding-right: 5px;
    margin-top: -$avatarCircleSize / 3;

    .name-container {
      margin-top: 0.1rem;
      width: 100%;
      height: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .avatar-container {
      margin: auto;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.09);
      border-radius: 50%;
      background-color: $white;
      padding: 11px;
      width: $avatarCircleSize;
      height: $avatarCircleSize;
    }
  }
}
</style>
