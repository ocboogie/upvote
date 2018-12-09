export default {
  waitingForGameToFinish: {
    text: "Waiting for game to finish",
    redirect(to, from, next) {
      if (!to.path.startsWith("/loading") || from.path !== "/game") {
        next()
        return
      }
      next("/")
    }
  }
}
