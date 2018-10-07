<template>
  <div class="post">
    <div class="upvotes">
      <button 
        class="arrow upvote" 
        :class="{'is-selected': vote === 'upvote'}" 
        @click="upvote"
      >
        <font-awesome-icon 
          size="lg" 
          icon="arrow-up"
        />
      </button>
      {{ upvotes }}
      <button 
        class="arrow downvote" 
        :class="{'is-selected': vote === 'downvote'}" 
        @click="downvote"
      >
        <font-awesome-icon 
          size="lg" 
          :rotation="180" 
          icon="arrow-up"
        />
      </button>
    </div>
    <div class="body">{{ content }}<div class="author">By {{ author }}</div></div>
    
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
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
      });
    },
    downvote() {
      this.voteForPost({
        id: this.id,
        vote: this.vote === "downvote" ? "none" : "downvote"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.post {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid $border-lighter-color;
  background-color: $white;
  overflow: hidden;
  color: $text-primary-color;
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
          color: $primary-color;
        }

        &:hover {
          color: lighten($primary-color, 10%);
        }

        &:active {
          color: darken($primary-color, 10%);
        }
      }
      &.downvote {
        &.is-selected {
          color: $error-color;
        }

        &:hover {
          color: lighten($error-color, 5%);
        }

        &:active {
          color: darken($error-color, 10%);
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
