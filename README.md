# YTDL-Discord-Bot

## Setup

To build the docker container, run the command:

```bash
yarn build
```

Some required environment variables are:

- `TOKEN`: The Discord Bot Token
- `APPLICATION_ID`: The Discord Application ID
- `GUILD_ID`: This is the ID of the Discord server you wish to run the bot on
- `SFTP_HOST`: The IP address of the SFTP server you wish to upload files to
- `SFTP_PORT`: The port of the SFTP server you wish to upload to (default 22)
- `SFTP_USERNAME`: Username of SFTP server
- `SFTP_PASSWORD`: Password of SFTP server
