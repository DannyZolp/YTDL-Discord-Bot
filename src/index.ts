const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const ytdl = require("ytdl-core");
const str = require("randomstring");
const { Client: SSHClient } = require("ssh2");

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.APPLICATION_ID,
        process.env.GUILD_ID
      ),
      {
        body: [
          new SlashCommandBuilder()
            .setName("download")
            .setDescription("Downloads a YT-DL compatible video")
            .addStringOption((option: any) =>
              option
                .setName("link")
                .setDescription("The link of the video")
                .setRequired(true)
            )
        ].map((c) => c.toJSON())
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const conn = new SSHClient();
conn
  .on("ready", () => {
    conn.sftp((err: any, sftp: any) => {
      if (err) {
        console.error(err);
        return;
      }
      client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
      });

      client.on("interactionCreate", async (interaction: any) => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === "download") {
          const link = interaction.options.getString("link");
          if (!ytdl.validateURL(link)) {
            await interaction.reply("URL Invalid!");
            return;
          }

          const fileName = `${str.generate()}.mp4`;
          ytdl(link).pipe(sftp.createWriteStream(fileName));
          await interaction.reply(
            `Finished downloading video <${link}> to file ${fileName}!`
          );
        }
      });

      client.login(process.env.TOKEN);
    });
  })
  .connect({
    host: process.env.SFTP_HOST,
    port: Number.parseInt(process.env.SFTP_PORT ?? "22"),
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD
  });
