<template>
  <div class="user-list">
    <h3>
      Users
    </h3>
    <!-- TODO: Add a group transition -->
    <ul>
      <li 
        v-for="name in users"
        :key="name" 
        class="user"
      >{{ name }}<template v-if="name === usersName"> (you)</template></li>
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    users: "userList",
    usersName: state => state.login.name
  })
};
</script>
<style lang="scss" scoped>
.user-list {
  padding: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid $border-lighter-color;
  background-color: $white;
  overflow: hidden;
  color: $text-primary-color;
  h3 {
    margin-top: 0;
    margin-bottom: 0.3rem;
  }
  ul {
    line-height: 1.35;
    list-style-type: none;
    padding-left: 0.5rem;
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>

