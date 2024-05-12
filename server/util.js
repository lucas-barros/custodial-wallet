export const safeExit = async (server, bitcoinService) => {
  await bitcoinService.unloadWallet();

  server.close((err) => {
    if (err) {
      console.error("server: closed with ERROR", err);
      process.exit(81);
    }
    console.debug("server: closed");
    process.exit();
  });
};
